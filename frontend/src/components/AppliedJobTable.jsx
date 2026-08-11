import React, { useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useSelector } from 'react-redux';
import { Sparkles, Eye, Clock, CheckCircle, Calendar, AlertCircle } from 'lucide-react';
import { CompactPipelineStepper, ApplicationTrackerModal } from './ApplicationTracker';

const AppliedJobTable = () => {
    const { allAppliedJobs } = useSelector(store => store.job);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const handleOpenTracking = (appliedJob) => {
        setSelectedApplication(appliedJob);
        setModalOpen(true);
    };

    const getStatusBadge = (statusStr) => {
        const status = (statusStr || 'applied').toLowerCase().trim();
        if (status === "rejected") {
            return <Badge className="bg-rose-50 text-rose-700 border-rose-200 border font-bold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1"><AlertCircle className="w-3 h-3" /> REJECTED</Badge>;
        } else if (status === "accepted" || status === "selected") {
            return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 border font-bold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" /> SELECTED / HIRED</Badge>;
        } else if (status === "interview completed") {
            return <Badge className="bg-teal-50 text-teal-700 border-teal-200 border font-bold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" /> INTERVIEW COMPLETED</Badge>;
        } else if (status === "interview scheduled" || status === "interviewing") {
            return <Badge className="bg-purple-50 text-purple-700 border-purple-200 border font-bold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1"><Calendar className="w-3 h-3" /> INTERVIEW SCHEDULED</Badge>;
        } else if (status === "shortlisted") {
            return <Badge className="bg-blue-50 text-blue-700 border-blue-200 border font-bold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1"><Sparkles className="w-3 h-3" /> SHORTLISTED</Badge>;
        } else if (status === "application viewed" || status === "viewed") {
            return <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 border font-bold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1"><Eye className="w-3 h-3" /> VIEWED</Badge>;
        }
        return <Badge className="bg-amber-50 text-amber-700 border-amber-200 border font-bold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> APPLIED</Badge>;
    };

    return (
        <div className="space-y-6">
            <Table>
                <TableCaption className="text-slate-400 text-xs mt-4">
                    Click any application row or stepper to inspect full journey timestamps & history.
                </TableCaption>
                <TableHeader className="bg-slate-50">
                    <TableRow className="border-slate-100">
                        <TableHead className="font-semibold text-slate-700">Applied Date</TableHead>
                        <TableHead className="font-semibold text-slate-700">Job Role</TableHead>
                        <TableHead className="font-semibold text-slate-700">Company</TableHead>
                        <TableHead className="font-semibold text-slate-700">Journey Tracker</TableHead>
                        <TableHead className="font-semibold text-slate-700">Current Status</TableHead>
                        <TableHead className="text-right font-semibold text-slate-700">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        !allAppliedJobs || allAppliedJobs.length <= 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12 text-slate-400 text-sm">
                                    You haven't applied to any jobs yet.
                                </TableCell>
                            </TableRow>
                        ) : allAppliedJobs.map((appliedJob) => {
                            const dateFormatted = appliedJob?.createdAt ? new Date(appliedJob.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            }) : 'N/A';

                            return (
                                <TableRow 
                                    key={appliedJob._id} 
                                    className="border-slate-100 hover:bg-slate-50/70 transition-colors"
                                >
                                    <TableCell className="text-slate-600 text-xs font-medium">
                                        {dateFormatted}
                                    </TableCell>
                                    <TableCell className="font-bold text-slate-900 text-sm">
                                        {appliedJob.job?.title || 'Job Title'}
                                    </TableCell>
                                    <TableCell className="text-slate-600 text-sm font-medium">
                                        {appliedJob.job?.company?.name || 'Company'}
                                    </TableCell>
                                    
                                    {/* Compact Interactive Pipeline Stepper */}
                                    <TableCell>
                                        <CompactPipelineStepper 
                                            application={appliedJob} 
                                            onOpenDetails={() => handleOpenTracking(appliedJob)}
                                        />
                                    </TableCell>

                                    <TableCell>
                                        {getStatusBadge(appliedJob?.status)}
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <Button
                                            onClick={() => handleOpenTracking(appliedJob)}
                                            variant="outline"
                                            size="sm"
                                            className="border-brand-200 text-brand-700 hover:bg-brand-50 hover:border-brand-300 text-xs font-semibold rounded-xl px-3 py-1 flex items-center gap-1.5 ml-auto"
                                        >
                                            <Eye className="w-3.5 h-3.5" /> Track Journey
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    }
                </TableBody>
            </Table>

            {/* Application Tracking Modal Dialog */}
            <ApplicationTrackerModal 
                open={modalOpen}
                setOpen={setModalOpen}
                application={selectedApplication}
            />
        </div>
    );
};

export default AppliedJobTable;