import React, { useState } from 'react'
import { Button } from './ui/button'
import { Bookmark, Sparkles } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
import { calculateSkillMatch } from '@/utils/skillMatcher'

const Job = ({ job }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);

    // Check if this job is already bookmarked by the user
    const isInitiallySaved = user?.savedJobs?.some(id => id.toString() === job?._id?.toString() || id._id === job?._id);
    const [isSaved, setIsSaved] = useState(isInitiallySaved);

    // AI Skill Match Score calculation for job seeker candidate
    const matchResult = (user && user?.role !== 'recruiter') 
        ? calculateSkillMatch(user?.profile?.skills, job?.requirments, user?.profile?.bio) 
        : null;

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    }

    const bookmarkHandler = async () => {
        if (!user) {
            toast.error("Please login to save jobs");
            return navigate("/login");
        }
        try {
            const res = await axios.post(`${JOB_API_END_POINT}/bookmark/${job?._id}`, {}, { withCredentials: true });
            if (res.data.success) {
                setIsSaved(res.data.isBookmarked);
                // Update user's savedJobs in Redux store
                dispatch(setUser({ ...user, savedJobs: res.data.savedJobs }));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to save job");
        }
    }

    return (
        <div className='p-6 rounded-2xl shadow-xs hover-lift bg-white border border-slate-100 hover:border-brand-200/80 transition-all duration-300 flex flex-col justify-between group'>
            <div>
                <div className='flex items-center justify-between'>
                    <span className='text-xs text-slate-400 font-medium px-2.5 py-1 bg-slate-50 rounded-full border border-slate-100'>
                        {daysAgoFunction(job?.createdAt) === 0 ? "Posted Today" : `${daysAgoFunction(job?.createdAt)}d ago`}
                    </span>
                    <Button 
                        onClick={bookmarkHandler} 
                        variant="outline" 
                        className={`rounded-full h-9 w-9 p-0 border-slate-200 btn-interactive ${isSaved ? "bg-accent-50 border-accent-200 text-accent-600" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`} 
                        size="icon"
                    >
                        <Bookmark className={`h-4 w-4 ${isSaved ? "text-accent-600 fill-accent-600" : ""}`} />
                    </Button>
                </div>

                <div className='flex items-center gap-3 my-4'>
                    <div className="w-12 h-12 rounded-xl border border-slate-100 flex items-center justify-center p-1 bg-slate-50 overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-200">
                        <Avatar className="w-full h-full rounded-md">
                            <AvatarImage src={job?.company?.logo} className="object-contain" />
                        </Avatar>
                    </div>
                    <div>
                        <h1 className='font-semibold text-slate-900 text-base leading-snug group-hover:text-brand-600 transition-colors'>{job?.company?.name}</h1>
                        <p className='text-xs text-slate-400 font-medium'>{job?.location || "India"}</p>
                    </div>
                </div>

                <div>
                    <h1 className='font-bold text-slate-900 text-lg mb-1.5 line-clamp-1 group-hover:text-brand-600 transition-colors'>{job?.title}</h1>
                    <p className='text-sm text-slate-500 line-clamp-2 leading-relaxed'>{job?.description}</p>
                </div>
                <div className='flex items-center gap-2 mt-4 flex-wrap'>
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

            <div className='flex items-center gap-3 mt-6 pt-4 border-t border-slate-100'>
                <Button onClick={() => navigate(`/description/${job?._id}`)} variant="outline" className="w-1/2 border-slate-200 text-slate-700 hover:bg-slate-50 font-medium btn-interactive">Details</Button>
                <Button 
                    onClick={bookmarkHandler} 
                    className={`w-1/2 font-medium btn-interactive ${isSaved ? "bg-accent-600 hover:bg-accent-700 text-white" : "btn-brand-gradient"} transition-all`}
                >
                    {isSaved ? "Saved" : "Save Job"}
                </Button>
            </div>
        </div>
    )
}

export default Job