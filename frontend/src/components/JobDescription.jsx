import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJobs } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import SkillMatchCard from './SkillMatchCard';

const JobDescription = () => {

    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);

    console.log(singleJob);

    const isInitiallyApplied =
        singleJob?.applications?.some(
            application => application.applicant === user?._id
        ) || false;

    const [isApplied, setIsApplied] = useState(isInitiallyApplied);

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();

    const applyJobHandler = async () => {
        try {
            const res = await axios.post(
                `${APPLICATION_API_END_POINT}/apply/${jobId}`,
                {},
                { withCredentials: true }
            );

            if (res.data.success) {
                setIsApplied(true);

                const updatedSingleJob = {
                    ...singleJob,
                    applications: [
                        ...(singleJob?.applications || []),
                        { applicant: user?._id }
                    ]
                };

                dispatch(setSingleJobs(updatedSingleJob));
                toast.success(res.data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message);
        }
    }

    useEffect(() => {

        const fetchSingleJob = async () => {
            try {

                const res = await axios.get(
                    `${JOB_API_END_POINT}/get/${jobId}`,
                    { withCredentials: true }
                );

                if (res.data.success) {
                    dispatch(setSingleJobs(res.data.job));

                    setIsApplied(
                        res.data.job.applications?.some(
                            application => application.applicant === user?._id
                        )
                    );
                }

            } catch (error) {
                console.log(error);
            }
        }

        fetchSingleJob();

    }, [jobId, dispatch, user?._id]);


    return (
        <div className='min-h-screen bg-slate-50 py-10 px-4'>
            <div className='max-w-5xl mx-auto p-8 bg-white border border-slate-100 shadow-sm rounded-2xl'>
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100'>
                    <div>
                        <h1 className='font-extrabold text-2xl text-slate-900'>
                            {singleJob?.title}
                        </h1>
                        <div className='flex items-center gap-2 mt-3 flex-wrap'>
                            <Badge className='bg-accent-50 text-accent-700 font-semibold text-xs border-0 px-3 py-1 rounded-full' variant="ghost">
                                {singleJob?.position} Positions
                            </Badge>

                            <Badge className='bg-rose-50 text-rose-700 font-semibold text-xs border-0 px-3 py-1 rounded-full' variant="ghost">
                                {singleJob?.jobtype}
                            </Badge>

                            <Badge className='bg-brand-50 text-brand-700 font-semibold text-xs border-0 px-3 py-1 rounded-full' variant="ghost">
                                {singleJob?.salary} LPA
                            </Badge>
                        </div>
                    </div>

                    {user && (user.role === 'recruiter' || user.role === 'coordinator') ? (
                        <Button
                            disabled
                            className="rounded-xl px-6 py-2.5 font-semibold text-sm bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none"
                        >
                            {user.role === 'recruiter' ? 'Recruiters Cannot Apply' : 'Coordinators Cannot Apply'}
                        </Button>
                    ) : (
                        <Button
                            onClick={isApplied ? null : applyJobHandler}
                            disabled={isApplied}
                            className={`rounded-xl px-6 py-2.5 font-semibold text-sm transition-all shadow-sm ${
                                isApplied 
                                    ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed' 
                                    : 'btn-brand-gradient shadow-md'
                            }`}
                        >
                            {isApplied ? 'Already Applied' : 'Apply Now'}
                        </Button>
                    )}
                </div>

                {/* AI Skill Compatibility Analysis Section */}
                <SkillMatchCard user={user} job={singleJob} />

                <h2 className='font-bold text-slate-900 text-lg py-5 border-b border-slate-100'>
                    Job Details & Requirements
                </h2>

                <div className='my-6 space-y-4 text-sm'>
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-2 py-2 border-b border-slate-50'>
                        <span className='font-semibold text-slate-900'>Role Title:</span>
                        <span className='sm:col-span-2 text-slate-600 font-medium'>{singleJob?.title}</span>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-2 py-2 border-b border-slate-50'>
                        <span className='font-semibold text-slate-900'>Location:</span>
                        <span className='sm:col-span-2 text-slate-600 font-medium'>{singleJob?.location}</span>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-2 py-2 border-b border-slate-50'>
                        <span className='font-semibold text-slate-900'>Description:</span>
                        <span className='sm:col-span-2 text-slate-600 leading-relaxed'>{singleJob?.description}</span>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-2 py-2 border-b border-slate-50'>
                        <span className='font-semibold text-slate-900'>Experience Required:</span>
                        <span className='sm:col-span-2 text-slate-600 font-medium'>{singleJob?.experience} Years</span>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-2 py-2 border-b border-slate-50'>
                        <span className='font-semibold text-slate-900'>Offered Salary:</span>
                        <span className='sm:col-span-2 text-slate-600 font-medium'>{singleJob?.salary} LPA</span>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-2 py-2 border-b border-slate-50'>
                        <span className='font-semibold text-slate-900'>Total Applicants:</span>
                        <span className='sm:col-span-2 text-brand-700 font-bold'>{singleJob?.applications?.length || 0} candidates</span>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-2 py-2'>
                        <span className='font-semibold text-slate-900'>Posted Date:</span>
                        <span className='sm:col-span-2 text-slate-600 font-medium'>{singleJob?.createdAt?.split("T")[0]}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JobDescription;