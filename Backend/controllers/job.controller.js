import { JOB } from '../models/job.model.js';
import { User } from '../models/user.model.js';
import { Company } from '../models/company.model.js';

export const postJob = async (req,res) => {
    try {
        const {title,description,requirments,salary,location,jobtype,experience,position,companyId} = req.body;

        const userId = req.id;

        if(!title || !description || !requirments || !salary || !location || !jobtype || !experience || !position || !companyId ){
            return res.status(404).json({
                message : "Somthing is missing",
                success : false
            });
        };

        const job = await JOB.create({
            title,
            description,
            requirments,
            salary : Number(salary),
            location,
            jobtype,
            experience:experience,
            position,
            company : companyId,
            created_by : userId
        });

        return res.status(201).json({
            message : "new job created successfully.",
            job,
            success : true
        });

    } catch (error) {
        console.log(error);
    }
}

// get all jobs for student with advanced query filtering
export const getAllJobs = async (req, res) => {
  try {
    const { keyword, location, jobtype, minSalary, maxSalary } = req.query;

    const query = {};

    if (keyword && keyword.trim() !== "") {
      const keywordRegex = new RegExp(keyword.trim(), "i");
      query.$or = [
        { title: { $regex: keywordRegex } },
        { description: { $regex: keywordRegex } },
        { requirments: { $regex: keywordRegex } }
      ];
    }

    if (location && location.trim() !== "") {
      query.location = { $regex: new RegExp(location.trim(), "i") };
    }

    if (jobtype && jobtype.trim() !== "") {
      const types = jobtype.split(',').map(t => t.trim()).filter(Boolean);
      if (types.length > 0) {
        query.jobtype = { $in: types.map(t => new RegExp(t, "i")) };
      }
    }

    if ((minSalary !== undefined && minSalary !== "") || (maxSalary !== undefined && maxSalary !== "")) {
      query.salary = {};
      if (minSalary !== undefined && minSalary !== "") {
        query.salary.$gte = Number(minSalary);
      }
      if (maxSalary !== undefined && maxSalary !== "") {
        query.salary.$lte = Number(maxSalary);
      }
    }

    const jobs = await JOB.find(query)
      .populate("company")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      jobs,
      count: jobs.length,
      success: true
    });

  } catch (error) {
    console.log("GET ALL JOBS ERROR:", error);
    res.status(500).json({ 
      message: "Server error while fetching jobs", 
      success: false 
    });
  }
};

//get jobs by id
export const getJobById = async(req,res) => {
    try {
        const jobId = req.params.id;
        const job = await JOB.findById(jobId).populate({
            path : "applications"
        });

        if(!job){
            return res.status(404).json({
                message : "Jobs not found.",
                success : false
            });
        };

        return res.status(200).json({
            job,
            success : true,
        });
    } catch (error) {
        console.log(error);
    }
}

// job for recruiter / admin --> dekhega kitne job post hue hain
export const getAdminJobs = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        const userRole = (user.role || "").toLowerCase();
        let query = {};

        if (userRole === "admin") {
            query = {}; // Admin sees all jobs
        } else {
            // Find all companies registered by this user
            const recruiterCompanies = await Company.find({ userId: userId }).select('_id');
            const companyIds = recruiterCompanies.map(c => c._id);

            query = {
                $or: [
                    { created_by: userId },
                    { company: { $in: companyIds } }
                ]
            };
        }

        const jobs = await JOB.find(query)
            .populate("company")
            .populate("created_by", "fullname email role")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            jobs: jobs || [],
            success: true
        });

    } catch (error) {
        console.error("GET ADMIN JOBS ERROR:", error);
        return res.status(500).json({
            message: "Failed to fetch admin jobs",
            success: false
        });
    }
}

/* ================= BOOKMARK / SAVE JOB ================= */
export const bookmarkJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // Check if job is already bookmarked
        const isBookmarked = user.savedJobs.some(id => id.toString() === jobId);

        if (isBookmarked) {
            // Remove from savedJobs
            user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
            await user.save();
            return res.status(200).json({
                message: "Job removed from saved list",
                isBookmarked: false,
                savedJobs: user.savedJobs,
                success: true
            });
        } else {
            // Add to savedJobs
            user.savedJobs.push(jobId);
            await user.save();
            return res.status(200).json({
                message: "Job saved successfully",
                isBookmarked: true,
                savedJobs: user.savedJobs,
                success: true
            });
        }
    } catch (error) {
        console.log("BOOKMARK JOB ERROR:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

/* ================= GET ALL SAVED JOBS ================= */
export const getSavedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).populate({
            path: 'savedJobs',
            populate: {
                path: 'company'
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        return res.status(200).json({
            savedJobs: user.savedJobs || [],
            success: true
        });
    } catch (error) {
        console.log("GET SAVED JOBS ERROR:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};