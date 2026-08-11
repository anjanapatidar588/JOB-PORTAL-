import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Briefcase, Users, UserCheck, TrendingUp, Sparkles, Clock, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { calculateSkillMatch } from '@/utils/skillMatcher';

const RecruiterDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/stats`, { withCredentials: true });
                if (res.data.success) {
                    setStats(res.data.stats);
                }
            } catch (error) {
                console.log("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const totalApps = stats?.totalApplications || 0;
    const shortlistedCount = (stats?.statusCounts?.shortlisted || 0) + (stats?.statusCounts?.interviewing || 0);
    const acceptedCount = stats?.statusCounts?.accepted || 0;
    const hireRate = totalApps > 0 ? Math.round((acceptedCount / totalApps) * 100) : 0;

    return (
        <div className="min-h-screen bg-slate-50/60 pb-12">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 mt-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            Recruiter Analytics Dashboard
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Real-time metrics, applicant candidate pipeline, and job post statistics
                        </p>
                    </div>

                    <Button 
                        onClick={() => navigate('/admin/jobs/create')}
                        className="bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-sm transition-all"
                    >
                        + Post New Job
                    </Button>
                </div>

                {/* Metric Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {/* Card 1: Total Jobs */}
                    <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between transition-all hover:shadow-md">
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Posted Jobs</span>
                            <h2 className="text-3xl font-black text-slate-900 mt-1">{stats?.totalJobs || 0}</h2>
                            <span className="text-[11px] font-semibold text-emerald-600 mt-1 block flex items-center gap-0.5">
                                Active Listings
                            </span>
                        </div>
                        <div className="p-3.5 bg-brand-50 text-brand-600 rounded-2xl">
                            <Briefcase className="w-6 h-6" />
                        </div>
                    </div>

                    {/* Card 2: Total Applications */}
                    <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between transition-all hover:shadow-md">
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Applicants</span>
                            <h2 className="text-3xl font-black text-slate-900 mt-1">{totalApps}</h2>
                            <span className="text-[11px] font-semibold text-blue-600 mt-1 block">
                                Candidates Applied
                            </span>
                        </div>
                        <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>

                    {/* Card 3: Shortlisted & Interviewing */}
                    <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between transition-all hover:shadow-md">
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shortlisted Pipeline</span>
                            <h2 className="text-3xl font-black text-slate-900 mt-1">{shortlistedCount}</h2>
                            <span className="text-[11px] font-semibold text-purple-600 mt-1 block">
                                In Active Review
                            </span>
                        </div>
                        <div className="p-3.5 bg-purple-50 text-purple-600 rounded-2xl">
                            <UserCheck className="w-6 h-6" />
                        </div>
                    </div>

                    {/* Card 4: Placement Rate */}
                    <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between transition-all hover:shadow-md">
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hired Ratio</span>
                            <h2 className="text-3xl font-black text-slate-900 mt-1">{hireRate}%</h2>
                            <span className="text-[11px] font-semibold text-indigo-600 mt-1 block">
                                Candidates Accepted
                            </span>
                        </div>
                        <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Status Breakdown & Activity Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Status Breakdown Progress Cards */}
                    <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-5">
                        <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3">
                            Applicant Pipeline Stages
                        </h3>

                        {/* Stage 1: Pending */}
                        <div>
                            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                                <span>Applied / Under Review</span>
                                <span>{stats?.statusCounts?.pending || 0}</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div 
                                    className="bg-amber-500 h-full transition-all" 
                                    style={{ width: `${totalApps ? ((stats?.statusCounts?.pending || 0) / totalApps) * 100 : 0}%` }}
                                />
                            </div>
                        </div>

                        {/* Stage 2: Shortlisted */}
                        <div>
                            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                                <span>Shortlisted</span>
                                <span>{stats?.statusCounts?.shortlisted || 0}</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div 
                                    className="bg-blue-500 h-full transition-all" 
                                    style={{ width: `${totalApps ? ((stats?.statusCounts?.shortlisted || 0) / totalApps) * 100 : 0}%` }}
                                />
                            </div>
                        </div>

                        {/* Stage 3: Interviewing */}
                        <div>
                            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                                <span>Interviewing</span>
                                <span>{stats?.statusCounts?.interviewing || 0}</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div 
                                    className="bg-purple-500 h-full transition-all" 
                                    style={{ width: `${totalApps ? ((stats?.statusCounts?.interviewing || 0) / totalApps) * 100 : 0}%` }}
                                />
                            </div>
                        </div>

                        {/* Stage 4: Accepted */}
                        <div>
                            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                                <span>Accepted / Hired</span>
                                <span>{stats?.statusCounts?.accepted || 0}</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div 
                                    className="bg-emerald-500 h-full transition-all" 
                                    style={{ width: `${totalApps ? ((stats?.statusCounts?.accepted || 0) / totalApps) * 100 : 0}%` }}
                                />
                            </div>
                        </div>

                        {/* Stage 5: Rejected */}
                        <div>
                            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                                <span>Rejected</span>
                                <span>{stats?.statusCounts?.rejected || 0}</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div 
                                    className="bg-rose-500 h-full transition-all" 
                                    style={{ width: `${totalApps ? ((stats?.statusCounts?.rejected || 0) / totalApps) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Recent Applicants Feed */}
                    <div className="lg:col-span-2 p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="font-extrabold text-slate-900 text-base">
                                Recent Job Applicants
                            </h3>
                            <Button 
                                onClick={() => navigate('/admin/jobs')}
                                variant="ghost" 
                                className="text-brand-600 hover:bg-brand-50 text-xs font-bold px-3 py-1"
                            >
                                View All Posted Jobs <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                            </Button>
                        </div>

                        <div className="divide-y divide-slate-100 max-h-[350px] overflow-y-auto">
                            {stats?.recentApplications?.length === 0 ? (
                                <p className="text-center text-slate-400 text-xs py-8">
                                    No recent applicants yet.
                                </p>
                            ) : (
                                stats?.recentApplications?.map((app) => {
                                    const matchResult = calculateSkillMatch(
                                        app?.applicant?.profile?.skills,
                                        app?.job?.requirments,
                                        app?.applicant?.profile?.bio
                                    );

                                    return (
                                        <div key={app._id} className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-xl transition-colors">
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm">{app?.applicant?.fullname}</h4>
                                                <p className="text-xs text-slate-500">Applied for <span className="font-semibold text-slate-700">{app?.job?.title}</span></p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <Badge className={`${
                                                    matchResult.score >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                    matchResult.score >= 60 ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                    'bg-amber-50 text-amber-700 border-amber-200'
                                                } border font-bold text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1`}>
                                                    <Sparkles className="w-3 h-3" /> {matchResult.score}% Fit
                                                </Badge>

                                                <Button 
                                                    onClick={() => navigate(`/admin/jobs/${app?.job?._id}/applicants`)}
                                                    variant="outline"
                                                    className="text-xs font-semibold px-2.5 py-1 rounded-lg border-slate-200 text-slate-700 hover:bg-slate-100 h-auto"
                                                >
                                                    Manage
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecruiterDashboard;
