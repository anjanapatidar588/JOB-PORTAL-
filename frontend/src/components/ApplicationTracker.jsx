import React from 'react';
import { 
    CheckCircle2, 
    Circle, 
    Clock, 
    Eye, 
    FileText, 
    UserCheck, 
    Calendar, 
    Sparkles, 
    XCircle, 
    AlertCircle,
    ChevronRight,
    Building2,
    CalendarDays
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

// 6 Official Journey Stages
export const TRACKING_STAGES = [
    {
        key: 'applied',
        label: 'Applied',
        aliases: ['applied', 'pending'],
        icon: FileText,
        description: 'Application submitted successfully'
    },
    {
        key: 'application viewed',
        label: 'Application Viewed',
        aliases: ['application viewed', 'viewed'],
        icon: Eye,
        description: 'Recruiter reviewed your profile'
    },
    {
        key: 'shortlisted',
        label: 'Shortlisted',
        aliases: ['shortlisted'],
        icon: UserCheck,
        description: 'Selected for interview process'
    },
    {
        key: 'interview scheduled',
        label: 'Interview Scheduled',
        aliases: ['interview scheduled', 'interviewing'],
        icon: Calendar,
        description: 'Interview session arranged'
    },
    {
        key: 'interview completed',
        label: 'Interview Completed',
        aliases: ['interview completed'],
        icon: CheckCircle2,
        description: 'Interview finished, under final review'
    },
    {
        key: 'outcome',
        label: 'Selected / Rejected',
        aliases: ['selected', 'accepted', 'rejected'],
        icon: Sparkles,
        description: 'Final hiring outcome decision'
    }
];

export const getStageIndex = (status) => {
    const st = (status || 'applied').toLowerCase().trim();
    if (st === 'rejected' || st === 'accepted' || st === 'selected') return 5;
    if (st === 'interview completed') return 4;
    if (st === 'interview scheduled' || st === 'interviewing') return 3;
    if (st === 'shortlisted') return 2;
    if (st === 'application viewed' || st === 'viewed') return 1;
    return 0; // applied / pending
};

export const formatDateTime = (dateStr) => {
    if (!dateStr) return null;
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return null;
        return d.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return null;
    }
};

// Compact Stepper for Table Rows
export const CompactPipelineStepper = ({ application, onOpenDetails }) => {
    const currentStatus = (application?.status || 'applied').toLowerCase().trim();
    const activeIndex = getStageIndex(currentStatus);
    const isRejected = currentStatus === 'rejected';
    const isSelected = currentStatus === 'selected' || currentStatus === 'accepted';

    return (
        <div 
            onClick={onOpenDetails}
            className="flex items-center gap-1 min-w-[200px] cursor-pointer group py-1"
            title="Click to view complete tracking timeline history"
        >
            {TRACKING_STAGES.map((stage, idx) => {
                const isCompleted = idx <= activeIndex;
                const isCurrent = idx === activeIndex;

                let circleStyle = "bg-slate-100 text-slate-400 border border-slate-200";
                let lineStyle = "bg-slate-200";

                if (isCompleted) {
                    if (idx === 5) {
                        if (isRejected) {
                            circleStyle = "bg-rose-500 text-white border-rose-600 shadow-xs";
                            lineStyle = "bg-rose-500";
                        } else if (isSelected) {
                            circleStyle = "bg-emerald-500 text-white border-emerald-600 shadow-xs";
                            lineStyle = "bg-emerald-500";
                        } else {
                            circleStyle = "bg-brand-600 text-white border-brand-700 shadow-xs";
                            lineStyle = "bg-brand-600";
                        }
                    } else if (isCurrent) {
                        circleStyle = "bg-brand-600 text-white ring-4 ring-brand-100 shadow-xs animate-pulse";
                        lineStyle = "bg-brand-600";
                    } else {
                        circleStyle = "bg-brand-600 text-white border-brand-700";
                        lineStyle = "bg-brand-600";
                    }
                }

                return (
                    <React.Fragment key={idx}>
                        <div 
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${circleStyle}`}
                            title={`${stage.label}${isCurrent ? ' (Current Stage)' : ''}`}
                        >
                            {isCompleted ? (
                                isRejected && idx === 5 ? '✕' : '✓'
                            ) : (
                                idx + 1
                            )}
                        </div>
                        {idx < TRACKING_STAGES.length - 1 && (
                            <div className={`flex-1 h-1 rounded-full transition-all duration-300 ${idx < activeIndex ? 'bg-brand-600' : 'bg-slate-200'}`} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

// Full Timeline Component
export const DetailedTimeline = ({ application }) => {
    if (!application) return null;

    const currentStatus = (application?.status || 'applied').toLowerCase().trim();
    const activeIndex = getStageIndex(currentStatus);
    const history = application?.statusHistory || [];
    const createdAt = application?.createdAt;

    // Helper to find exact timestamp for stage
    const getStageTimestamp = (stage, idx) => {
        // Search history for matching status
        const historyMatch = history.find(h => {
            const hStatus = (h.status || '').toLowerCase().trim();
            return stage.aliases.includes(hStatus) || hStatus === stage.key;
        });

        if (historyMatch && historyMatch.updatedAt) {
            return formatDateTime(historyMatch.updatedAt);
        }

        // Fallback for Applied stage if initial application creation date exists
        if (idx === 0 && createdAt) {
            return formatDateTime(createdAt);
        }

        // If stage is reached or completed before active index, return closest available previous timestamp
        if (idx <= activeIndex && history.length > 0) {
            const closest = history[Math.min(idx, history.length - 1)];
            return closest?.updatedAt ? formatDateTime(closest.updatedAt) : formatDateTime(createdAt);
        }

        return null;
    };

    return (
        <div className="py-2 space-y-6">
            {/* Job Banner Header */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm border border-slate-800 relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 relative z-10">
                    <div>
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
                            <Building2 className="w-3.5 h-3.5 text-brand-400" />
                            <span>{application?.job?.company?.name || 'Company'}</span>
                        </div>
                        <h3 className="text-xl font-extrabold text-white tracking-tight">
                            {application?.job?.title || 'Job Application'}
                        </h3>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                            <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                            Applied: {formatDateTime(createdAt) || 'Recent'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Vertical Progress Timeline */}
            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3.5 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {TRACKING_STAGES.map((stage, idx) => {
                    const isCompleted = idx <= activeIndex;
                    const isCurrent = idx === activeIndex;
                    const isUpcoming = idx > activeIndex;
                    const stageTime = getStageTimestamp(stage, idx);
                    const IconComponent = stage.icon;

                    let isRejectedStage = idx === 5 && currentStatus === 'rejected';
                    let isSelectedStage = idx === 5 && (currentStatus === 'selected' || currentStatus === 'accepted');

                    let iconBg = "bg-slate-100 text-slate-400 border border-slate-200";
                    let cardBorder = "border-slate-100 bg-slate-50/50 opacity-60";
                    let titleColor = "text-slate-500";
                    let badgeLabel = "Upcoming";
                    let badgeStyle = "bg-slate-100 text-slate-500 border-slate-200";

                    if (isCompleted) {
                        if (isRejectedStage) {
                            iconBg = "bg-rose-500 text-white ring-4 ring-rose-100 border-rose-600";
                            cardBorder = "border-rose-200 bg-rose-50/30";
                            titleColor = "text-rose-900 font-extrabold";
                            badgeLabel = "Rejected";
                            badgeStyle = "bg-rose-100 text-rose-800 border-rose-200";
                        } else if (isSelectedStage) {
                            iconBg = "bg-emerald-500 text-white ring-4 ring-emerald-100 border-emerald-600";
                            cardBorder = "border-emerald-200 bg-emerald-50/30";
                            titleColor = "text-emerald-900 font-extrabold";
                            badgeLabel = "Selected / Hired";
                            badgeStyle = "bg-emerald-100 text-emerald-800 border-emerald-200";
                        } else if (isCurrent) {
                            iconBg = "bg-brand-600 text-white ring-4 ring-brand-100 border-brand-700 animate-pulse";
                            cardBorder = "border-brand-200 bg-brand-50/30 shadow-xs";
                            titleColor = "text-brand-950 font-extrabold";
                            badgeLabel = "Current Stage";
                            badgeStyle = "bg-brand-100 text-brand-800 border-brand-300 font-bold";
                        } else {
                            iconBg = "bg-brand-600 text-white border-brand-700";
                            cardBorder = "border-slate-200 bg-white shadow-2xs";
                            titleColor = "text-slate-900 font-bold";
                            badgeLabel = "Completed";
                            badgeStyle = "bg-slate-100 text-slate-700 border-slate-200";
                        }
                    }

                    return (
                        <div key={idx} className="relative flex items-start gap-4 group">
                            {/* Icon Circle Marker */}
                            <div className={`absolute -left-6 sm:-left-8 top-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs transition-all duration-300 z-10 ${iconBg}`}>
                                {isRejectedStage ? (
                                    <XCircle className="w-4 h-4" />
                                ) : isSelectedStage ? (
                                    <Sparkles className="w-4 h-4" />
                                ) : isCompleted ? (
                                    <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                    <IconComponent className="w-4 h-4" />
                                )}
                            </div>

                            {/* Content Card */}
                            <div className={`flex-1 p-4 rounded-xl border transition-all duration-300 ${cardBorder}`}>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                                    <h4 className={`text-base tracking-tight ${titleColor}`}>
                                        {idx === 5 ? (
                                            isRejectedStage ? 'Application Rejected' : isSelectedStage ? 'Selected for Hiring!' : 'Final Outcome'
                                        ) : stage.label}
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        <Badge className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${badgeStyle}`}>
                                            {badgeLabel}
                                        </Badge>
                                    </div>
                                </div>

                                <p className="text-slate-500 text-xs mt-1 font-medium">
                                    {stage.description}
                                </p>

                                {stageTime ? (
                                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500 font-medium">
                                        <span className="flex items-center gap-1.5 text-brand-700 font-semibold">
                                            <Clock className="w-3.5 h-3.5 text-brand-600" />
                                            {stageTime}
                                        </span>
                                        {isCurrent && (
                                            <span className="text-[11px] bg-brand-50 text-brand-700 px-2 py-0.5 rounded-md font-semibold">
                                                Active Stage
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 text-xs text-slate-400 font-medium italic">
                                        Stage pending completion
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// Modal Wrapper for detailed timeline view
export const ApplicationTrackerModal = ({ open, setOpen, application }) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-6 bg-white rounded-2xl border border-slate-100 shadow-2xl">
                <DialogHeader className="border-b border-slate-100 pb-4">
                    <DialogTitle className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-brand-600" />
                        Application Tracking Journey
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 text-xs">
                        Real-time status updates and complete stage timestamp history for your job application.
                    </DialogDescription>
                </DialogHeader>

                <DetailedTimeline application={application} />
            </DialogContent>
        </Dialog>
    );
};

export default ApplicationTrackerModal;
