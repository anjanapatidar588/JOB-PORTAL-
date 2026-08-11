import React from 'react';
import { calculateSkillMatch } from '@/utils/skillMatcher';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CheckCircle2, AlertCircle, Lightbulb, Sparkles, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SkillMatchCard = ({ user, job }) => {
    const navigate = useNavigate();

    if (!user) {
        return (
            <div className="my-6 p-6 rounded-2xl bg-gradient-to-r from-purple-50 via-slate-50 to-brand-50 border border-purple-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-600 text-white rounded-xl shadow-md">
                        <Sparkles className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-base">AI Resume & Skill Match Analysis</h3>
                        <p className="text-xs text-slate-500">Log in as a job seeker to calculate your instant match compatibility score for this position.</p>
                    </div>
                </div>
                <Button 
                    onClick={() => navigate('/login')}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs px-5 py-2 rounded-xl shadow-sm transition-all"
                >
                    Log In to View Fit Score
                </Button>
            </div>
        );
    }

    // Only show detailed skill match for student candidates
    if (user.role === 'recruiter') {
        return null;
    }

    const {
        score,
        matchLevel,
        colorClass,
        matchedSkills,
        missingSkills,
        totalRequired,
        recommendations
    } = calculateSkillMatch(user?.profile?.skills, job?.requirments, user?.profile?.bio);

    const getScoreColor = () => {
        if (score >= 80) return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', ring: 'text-emerald-500' };
        if (score >= 60) return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', ring: 'text-blue-500' };
        if (score >= 35) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', ring: 'text-amber-500' };
        return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', ring: 'text-rose-500' };
    };

    const colors = getScoreColor();
    const radius = 34;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="my-6 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm transition-all hover:shadow-md">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                    <div className="p-2.5 bg-brand-50 text-brand-600 rounded-xl">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                            AI Skill Compatibility Analysis
                        </h3>
                        <p className="text-xs text-slate-500">Automated match between your profile skills and job requirements</p>
                    </div>
                </div>
                <Badge className={`${colors.bg} ${colors.text} border ${colors.border} font-bold px-3 py-1 text-xs rounded-full`}>
                    {matchLevel}
                </Badge>
            </div>

            {/* Content Body */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5 items-center">
                {/* Score Circular Ring */}
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50/80 rounded-xl border border-slate-100">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                            <circle
                                cx="40"
                                cy="40"
                                r={radius}
                                className="text-slate-200"
                                strokeWidth="7"
                                stroke="currentColor"
                                fill="transparent"
                            />
                            <circle
                                cx="40"
                                cy="40"
                                r={radius}
                                className={colors.ring}
                                strokeWidth="7"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="transparent"
                                style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-black text-slate-900 leading-none">{score}%</span>
                            <span className="text-[10px] font-semibold text-slate-400 uppercase mt-0.5">Match</span>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-2 text-center">
                        {matchedSkills.length} of {totalRequired} required skills matched
                    </p>
                </div>

                {/* Skills Breakdown */}
                <div className="md:col-span-2 space-y-4">
                    {/* Matched Skills */}
                    <div>
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Matched Skills ({matchedSkills.length})
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                            {matchedSkills.length > 0 ? (
                                matchedSkills.map((skill, i) => (
                                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-100">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <span className="text-xs text-slate-400 italic">No skills matched yet. Add your skills to profile!</span>
                            )}
                        </div>
                    </div>

                    {/* Missing Skills */}
                    {missingSkills.length > 0 && (
                        <div>
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                                <AlertCircle className="w-4 h-4 text-amber-600" />
                                Missing / Recommended Skills ({missingSkills.length})
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                                {missingSkills.map((skill, i) => (
                                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 text-xs font-semibold rounded-lg border border-rose-100">
                                        <AlertCircle className="w-3 h-3 text-rose-500" />
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Smart Tip / Recommendation Banner */}
            <div className="mt-5 p-3.5 rounded-xl bg-purple-50/60 border border-purple-100 flex items-start gap-3 text-xs text-purple-900">
                <Lightbulb className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                    <span className="font-bold block text-purple-950">AI Recommendation:</span>
                    <p className="mt-0.5 text-purple-800 leading-relaxed">{recommendations}</p>
                </div>
                <Button 
                    onClick={() => navigate('/profile')} 
                    variant="ghost" 
                    className="text-purple-700 hover:bg-purple-100 text-xs font-bold px-3 py-1 rounded-lg shrink-0 h-auto"
                >
                    <UserCheck className="w-3.5 h-3.5 mr-1" />
                    Update Skills
                </Button>
            </div>
        </div>
    );
};

export default SkillMatchCard;
