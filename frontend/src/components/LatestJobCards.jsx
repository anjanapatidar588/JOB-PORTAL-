import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Sparkles } from 'lucide-react'
import { calculateSkillMatch } from '@/utils/skillMatcher'

const LatestJobCards = ({job}) => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);

    const matchResult = (user && user?.role !== 'recruiter') 
        ? calculateSkillMatch(user?.profile?.skills, job?.requirments, user?.profile?.bio) 
        : null;

    return (
        <div 
            onClick={() => navigate(`/description/${job._id}`)} 
            className='p-6 rounded-2xl shadow-xs bg-white border border-slate-100 hover:border-brand-200/80 hover-lift transition-all duration-300 cursor-pointer flex flex-col justify-between group'
        >
            <div>
                <div className="flex items-center justify-between">
                    <h1 className='font-semibold text-slate-800 text-base group-hover:text-brand-600 transition-colors'>{job?.company?.name}</h1>
                    <span className='text-xs text-slate-400 font-medium px-2 py-0.5 bg-slate-50 rounded border border-slate-100'>{job?.location || "India"}</span>
                </div>
                <div>
                    <h1 className='font-bold text-slate-900 text-lg my-2 line-clamp-1 group-hover:text-brand-600 transition-colors'>{job?.title}</h1>
                    <p className='text-sm text-slate-500 line-clamp-2 leading-relaxed'>{job?.description}</p>
                </div>
            </div>
            <div className='flex items-center gap-2 mt-5 flex-wrap'>
                {matchResult && matchResult.score > 0 && (
                    <Badge className={`${
                        matchResult.score >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        matchResult.score >= 60 ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        matchResult.score >= 35 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-rose-50 text-rose-700 border-rose-200'
                    } border font-bold text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs`}>
                        <Sparkles className="w-3 h-3" /> {matchResult.score}% Match
                    </Badge>
                )}
                <Badge className='bg-accent-50 text-accent-700 font-semibold text-xs border-0 px-2.5 py-1 rounded-full' variant="ghost">{job?.position} Positions</Badge>
                <Badge className='bg-rose-50 text-rose-700 font-semibold text-xs border-0 px-2.5 py-1 rounded-full' variant="ghost">{job?.jobtype}</Badge>
                <Badge className='bg-brand-50 text-brand-700 font-semibold text-xs border-0 px-2.5 py-1 rounded-full' variant="ghost">{job?.salary} LPA</Badge>
            </div>
        </div>
    )
}

export default LatestJobCards