import { Application } from "../models/application.model.js";
import { JOB } from '../models/job.model.js';
import { User } from '../models/user.model.js';
import { createAndSendNotification } from "../utils/socket.js";

// Helper to ensure statusHistory is populated for existing applications
const ensureStatusHistory = (application) => {
    if (!application) return application;
    const doc = application.toObject ? application.toObject() : application;
    if (!doc.statusHistory || doc.statusHistory.length === 0) {
        doc.statusHistory = [{
            status: doc.status || 'applied',
            updatedAt: doc.createdAt || new Date()
        }];
    }
    return doc;
};

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            });
        }

        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
        if (existingApplication) {
            return res.status(400).json({
                message: "You already applied for this job.",
                success: false
            });
        }

        const job = await JOB.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        const now = new Date();
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
            status: 'applied',
            statusHistory: [{
                status: 'applied',
                updatedAt: now
            }]
        });

        // Ensure job.applications array contains application ID
        if (!job.applications.includes(newApplication._id)) {
            job.applications.push(newApplication._id);
            await job.save();
        }

        // Notify Recruiter / Job creator
        if (job.created_by) {
            await createAndSendNotification(job.created_by, {
                type: 'NEW_APPLICATION',
                message: `A new candidate applied for your job: "${job.title}"`,
                link: `/admin/jobs/${job._id}/applicants`
            });
        }

        return res.status(201).json({
            message: "Job applied successfully.",
            success: true,
            application: newApplication
        });

    } catch (error) {
        console.error("applyJob error:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

// Get all applied jobs for candidate
export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;

        const rawApplications = await Application
            .find({ applicant: userId })
            .sort({ createdAt: -1 })
            .populate({
                path: "job",
                populate: {
                    path: "company"
                }
            });

        const applications = rawApplications.map(app => ensureStatusHistory(app));

        return res.status(200).json({
            applications,
            success: true
        });

    } catch (error) {
        console.error("getAppliedJobs error:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

// Get single application detail/history
export const getApplicationDetail = async (req, res) => {
    try {
        const applicationId = req.params.id;

        const application = await Application.findById(applicationId)
            .populate({
                path: "job",
                populate: {
                    path: "company"
                }
            })
            .populate({
                path: "applicant",
                select: "fullname email phoneNumber profile role createdAt"
            });

        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            });
        }

        return res.status(200).json({
            application: ensureStatusHistory(application),
            success: true
        });

    } catch (error) {
        console.error("getApplicationDetail error:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

// Get all applications for a job (Recruiter, Coordinator, Admin view)
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found.", success: false });
        }

        const jobDoc = await JOB.findById(jobId)
            .populate('company')
            .populate('created_by', 'fullname email role');

        if (!jobDoc) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        // Authorization: Admin & Coordinator have full access; Recruiter must be job creator or company member
        const userRole = (user.role || "").toLowerCase();
        if (userRole !== "admin" && userRole !== "coordinator") {
            const isOwner = jobDoc.created_by?._id?.toString() === userId.toString() ||
                            (user.profile?.company && jobDoc.company?._id?.toString() === user.profile.company.toString());
            if (!isOwner) {
                return res.status(403).json({
                    message: "Access denied. You do not have permission to view applicants for this job.",
                    success: false
                });
            }
        }

        // DIRECT QUERY on Application collection to guarantee 100% data visibility
        const rawApplications = await Application.find({ job: jobId })
            .sort({ createdAt: -1 })
            .populate({
                path: 'applicant',
                select: 'fullname email phoneNumber profile role createdAt'
            })
            .populate({
                path: 'job',
                populate: { path: 'company' }
            });

        const applications = rawApplications.map(app => ensureStatusHistory(app));

        // Sync jobDoc.applications array in MongoDB if needed
        const appIds = applications.map(a => a._id);
        const currentAppIds = (jobDoc.applications || []).map(id => id.toString());
        if (JSON.stringify(currentAppIds) !== JSON.stringify(appIds.map(id => id.toString()))) {
            jobDoc.applications = appIds;
            await jobDoc.save();
        }

        const jobObj = jobDoc.toObject();
        jobObj.applications = applications;

        return res.status(200).json({
            job: jobObj,
            applications,
            success: true
        });

    } catch (error) {
        console.error("getApplicants error:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

// Update status (applied, application viewed, shortlisted, interview scheduled, interview completed, selected, accepted, rejected)
export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        if (!status) {
            return res.status(400).json({
                message: "Status is required.",
                success: false
            });
        }

        const application = await Application.findById(applicationId);

        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            });
        }

        const normalizedStatus = status.toLowerCase().trim();
        const now = new Date();

        if (!application.statusHistory) {
            application.statusHistory = [];
        }

        if (application.statusHistory.length === 0) {
            application.statusHistory.push({
                status: application.status || 'applied',
                updatedAt: application.createdAt || now
            });
        }

        application.status = normalizedStatus;
        application.statusHistory.push({
            status: normalizedStatus,
            updatedAt: now
        });

        await application.save();

        await application.populate({
            path: 'job',
            select: 'title company',
            populate: { path: 'company', select: 'name' }
        });

        let notifMessage = `Your application for "${application.job?.title}" status updated to: ${status.toUpperCase()}`;
        if (normalizedStatus === 'shortlisted') {
            notifMessage = `Your application for "${application.job?.title}" has been shortlisted.`;
        } else if (normalizedStatus === 'interview scheduled' || normalizedStatus === 'interviewing') {
            notifMessage = `Your interview for "${application.job?.title}" has been scheduled.`;
        } else if (normalizedStatus === 'interview completed') {
            notifMessage = `Your interview for "${application.job?.title}" has been marked as completed.`;
        } else if (normalizedStatus === 'application viewed' || normalizedStatus === 'viewed') {
            notifMessage = `Your application for "${application.job?.title}" has been viewed by the recruiter.`;
        } else if (normalizedStatus === 'selected' || normalizedStatus === 'accepted') {
            notifMessage = `Congratulations! You have been selected for "${application.job?.title}" at ${application.job?.company?.name || 'Company'}.`;
        } else if (normalizedStatus === 'rejected') {
            notifMessage = `Your application status for "${application.job?.title}" has been updated to: Rejected.`;
        }

        await createAndSendNotification(application.applicant, {
            type: 'STATUS_UPDATE',
            message: notifMessage,
            link: `/profile`
        });

        return res.status(200).json({
            message: `Status updated to ${status} successfully.`,
            success: true,
            application: ensureStatusHistory(application)
        });

    } catch (error) {
        console.error("updateStatus error:", error);
        return res.status(500).json({
            message: "Server Error",
            success: false,
            error: error.message
        });
    }
};

// Recruiter / Coordinator / Admin Dashboard Analytics & Stats API
export const getRecruiterStats = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        const userRole = (user.role || "").toLowerCase();
        let jobQuery = { created_by: userId };

        // Admin metrics query for ALL jobs
        if (userRole === "admin") {
            jobQuery = {};
        } 
        // Coordinator metrics query for company or platform jobs
        else if (userRole === "coordinator") {
            if (user.profile && user.profile.company) {
                jobQuery = { $or: [{ created_by: userId }, { company: user.profile.company }] };
            } else {
                jobQuery = {};
            }
        } 
        // Recruiter metrics query for own jobs or company jobs
        else if (userRole === "recruiter") {
            if (user.profile && user.profile.company) {
                jobQuery = { $or: [{ created_by: userId }, { company: user.profile.company }] };
            } else {
                jobQuery = { created_by: userId };
            }
        }

        const recruiterJobs = await JOB.find(jobQuery).select('_id title requirments company created_by');
        const jobIds = recruiterJobs.map(j => j._id);

        const rawApplications = await Application.find({ job: { $in: jobIds } })
            .sort({ createdAt: -1 })
            .populate({
                path: 'applicant',
                select: 'fullname email phoneNumber profile role createdAt'
            })
            .populate({
                path: 'job',
                select: 'title requirments company',
                populate: { path: 'company', select: 'name logo' }
            });

        const applications = rawApplications.map(a => ensureStatusHistory(a));

        const totalJobs = recruiterJobs.length;
        const totalApplications = applications.length;

        const statusCounts = {
            pending: 0,
            applied: 0,
            viewed: 0,
            shortlisted: 0,
            interviewing: 0,
            accepted: 0,
            rejected: 0
        };

        applications.forEach(app => {
            const st = (app.status || 'applied').toLowerCase().trim();
            if (st === 'shortlisted') statusCounts.shortlisted++;
            else if (st === 'interview scheduled' || st === 'interviewing') statusCounts.interviewing++;
            else if (st === 'accepted' || st === 'selected') statusCounts.accepted++;
            else if (st === 'rejected') statusCounts.rejected++;
            else if (st === 'application viewed' || st === 'viewed') statusCounts.viewed++;
            else statusCounts.applied++;
        });

        statusCounts.pending = statusCounts.applied + statusCounts.viewed;

        return res.status(200).json({
            stats: {
                totalJobs,
                totalApplications,
                statusCounts,
                recentApplications: applications.slice(0, 15)
            },
            success: true
        });

    } catch (error) {
        console.error("RECRUITER STATS ERROR:", error);
        return res.status(500).json({
            message: "Failed to fetch analytics",
            success: false
        });
    }
};



