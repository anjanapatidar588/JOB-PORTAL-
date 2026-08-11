import React, { useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal, Sparkles, Download, CheckCircle, Clock, UserCheck, Calendar, AlertCircle, Eye, History, User } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { calculateSkillMatch } from '@/utils/skillMatcher';
import { setAllApplicants } from '@/redux/applicationSlice';
import { ApplicationTrackerModal } from '../ApplicationTracker';

const shortlistingStatus = [
    "Application Viewed", 
    "Shortlisted", 
    "Interview Scheduled", 
    "Interview Completed", 
    "Selected", 
    "Rejected"
];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);
    const dispatch = useDispatch();
    const [selectedApp, setSelectedApp] = useState(null);
    const [trackerModalOpen, setTrackerModalOpen] = useState(false);

    // Safely extract candidate applications list
    const appList = Array.isArray(applicants?.applications)
        ? applicants.applications
        : Array.isArray(applicants)
        ? applicants
        : [];

    const handleOpenTimeline = (app) => {
        setSelectedApp({
            ...app,
            job: {
                title: applicants?.title || app?.job?.title || 'Job Application',
                company: applicants?.company || app?.job?.company || { name: 'Company' }
            }
        });
        setTrackerModalOpen(true);
    };

    const statusHandler = async (status, id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            if (res.data.success) {
                toast.success(res.data.message);

                // Update Redux state dynamically
                const updatedApps = appList.map(app => {
                    if (app._id === id) {
                        return res.data.application || {
                            ...app,
                            status: status.toLowerCase().trim()
                        };
                    }
                    return app;
                });

                if (Array.isArray(applicants?.applications)) {
                    dispatch(setAllApplicants({
                        ...applicants,
                        applications: updatedApps
                    }));
                } else {
                    dispatch(setAllApplicants(updatedApps));
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Status update failed");
        }
    };

    const exportToCSV = () => {
        if (!appList || appList.length === 0) {
            toast.error("No applicants to export");
            return;
        }

        const headers = ["Name", "Email", "Phone", "Status", "AI Match Score", "Applied Date"];
        const rows = appList.map(item => {
            const matchResult = calculateSkillMatch(
                item?.applicant?.profile?.skills,
                applicants?.requirments || item?.job?.requirments,
                item?.applicant?.profile?.bio
            );
            return [
                `"${item?.applicant?.fullname || 'Candidate'}"`,
                `"${item?.applicant?.email || ''}"`,
                `"${item?.applicant?.phoneNumber || ''}"`,
                `"${item?.status || 'applied'}"`,
                `"${matchResult.score}%"`,
                `"${item?.createdAt?.split("T")[0] || ''}"`
            ];
        });

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Applicants_${applicants?.title || 'Job'}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Applicants exported successfully to CSV!");
    };

    const getStatusBadge = (statusStr) => {
        const st = (statusStr || 'applied').toLowerCase().trim();
        if (st === 'shortlisted') return <Badge className="bg-blue-50 text-blue-700 border-blue-200 border font-semibold text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1"><UserCheck className="w-3 h-3" /> Shortlisted</Badge>;
        if (st === 'interview scheduled' || st === 'interviewing') return <Badge className="bg-purple-50 text-purple-700 border-purple-200 border font-semibold text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1"><Calendar className="w-3 h-3" /> Interview Scheduled</Badge>;
        if (st === 'interview completed') return <Badge className="bg-teal-50 text-teal-700 border-teal-200 border font-semibold text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Interview Done</Badge>;
        if (st === 'application viewed' || st === 'viewed') return <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 border font-semibold text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1"><Eye className="w-3 h-3" /> Viewed</Badge>;
        if (st === 'accepted' || st === 'selected') return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 border font-semibold text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Selected</Badge>;
        if (st === 'rejected') return <Badge className="bg-rose-50 text-rose-700 border-rose-200 border font-semibold text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Rejected</Badge>;
        return <Badge className="bg-amber-50 text-amber-700 border-amber-200 border font-semibold text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> Applied</Badge>;
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Total Candidates: <span className="text-brand-700 font-extrabold">{appList.length}</span>
                </span>
                <Button 
                    onClick={exportToCSV} 
                    variant="outline" 
                    className="border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                >
                    <Download className="w-3.5 h-3.5 text-brand-600" /> Export CSV
                </Button>
            </div>

            <Table>
                <TableCaption>A complete list of candidate applicants and stage status tracking</TableCaption>
                <TableHeader className="bg-slate-50">
                    <TableRow className="border-slate-100">
                        <TableHead className="font-semibold text-slate-700">FullName</TableHead>
                        <TableHead className="font-semibold text-slate-700">Email</TableHead>
                        <TableHead className="font-semibold text-slate-700">Contact</TableHead>
                        <TableHead className="font-semibold text-slate-700">AI Fit Match</TableHead>
                        <TableHead className="font-semibold text-slate-700">Current Status</TableHead>
                        <TableHead className="font-semibold text-slate-700">Resume</TableHead>
                        <TableHead className="font-semibold text-slate-700">Date</TableHead>
                        <TableHead className="text-right font-semibold text-slate-700">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        appList.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-12 text-slate-400 text-sm">
                                    No candidate applications found for this job yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            appList.map((item) => {
                                const matchResult = calculateSkillMatch(
                                    item?.applicant?.profile?.skills,
                                    applicants?.requirments || item?.job?.requirments,
                                    item?.applicant?.profile?.bio
                                );

                                const candidateName = item?.applicant?.fullname || 'Candidate';
                                const candidateEmail = item?.applicant?.email || 'N/A';
                                const candidatePhone = item?.applicant?.phoneNumber || 'N/A';
                                const appliedDate = item?.createdAt ? item.createdAt.split("T")[0] : 'N/A';

                                return (
                                    <TableRow key={item._id} className="border-slate-100 hover:bg-slate-50/50">
                                        <TableCell className="font-semibold text-slate-900">{candidateName}</TableCell>
                                        <TableCell className="text-slate-600 text-sm">{candidateEmail}</TableCell>
                                        <TableCell className="text-slate-600 text-sm">{candidatePhone}</TableCell>
                                        <TableCell>
                                            <Badge className={`${
                                                matchResult.score >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                matchResult.score >= 60 ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                matchResult.score >= 35 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                'bg-rose-50 text-rose-700 border-rose-200'
                                            } border font-bold text-xs px-2.5 py-0.5 rounded-full flex w-fit items-center gap-1`}>
                                                <Sparkles className="w-3 h-3" />
                                                {matchResult.score}% Match
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(item?.status)}
                                        </TableCell>
                                        <TableCell>
                                            {
                                                item?.applicant?.profile?.resume ? (
                                                    <a className="text-brand-600 font-semibold hover:underline text-xs" href={item?.applicant?.profile?.resume} target="_blank" rel="noopener noreferrer">
                                                        {item?.applicant?.profile?.resumeOriginalName || "View Resume"}
                                                    </a>
                                                ) : <span className="text-slate-400 text-xs">NA</span>
                                            }
                                        </TableCell>
                                        <TableCell className="text-slate-500 text-xs">{appliedDate}</TableCell>
                                        <TableCell className="text-right">
                                            <Popover>
                                                <PopoverTrigger className="p-1 rounded-lg hover:bg-slate-100 transition-colors">
                                                    <MoreHorizontal className="w-5 h-5 text-slate-600" />
                                                </PopoverTrigger>
                                                <PopoverContent className="w-52 p-2 border border-slate-100 shadow-lg rounded-xl">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 block border-b border-slate-100 mb-1">
                                                        Update Journey Stage
                                                    </span>
                                                    {
                                                        shortlistingStatus.map((status, index) => {
                                                            return (
                                                                <div 
                                                                    onClick={() => statusHandler(status, item?._id)} 
                                                                    key={index} 
                                                                    className='flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition-colors'
                                                                >
                                                                    <span>{status}</span>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                    <div className="border-t border-slate-100 mt-1 pt-1">
                                                        <div 
                                                            onClick={() => handleOpenTimeline(item)}
                                                            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-brand-50 text-brand-700 text-xs font-semibold cursor-pointer transition-colors"
                                                        >
                                                            <History className="w-3.5 h-3.5 text-brand-600" />
                                                            <span>View Full Timeline</span>
                                                        </div>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )
                    }
                </TableBody>
            </Table>

            {/* Application Tracker Modal for Candidate History */}
            <ApplicationTrackerModal 
                open={trackerModalOpen}
                setOpen={setTrackerModalOpen}
                application={selectedApp}
            />
        </div>
    )
}

export default ApplicantsTable