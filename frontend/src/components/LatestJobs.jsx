import React from 'react'
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux'; 

// const randomJobs = [1, 2, 3, 4, 5, 6, 7, 8];

const LatestJobs = () => {
    const {allJobs} = useSelector(store=>store.job);
   
    return (
        <div className='max-w-7xl mx-auto my-16 px-4'>
            <h1 className='text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2'>
                <span className='text-brand-600'>Latest & Top </span> Job Openings
            </h1>
            <p className='text-slate-500 text-sm mb-8'>Discover recently posted opportunities matching your skill set.</p>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {
                    allJobs.length <= 0 
                        ? <div className='col-span-full p-8 text-center bg-white rounded-xl border border-slate-100 text-slate-500'>No Jobs Available Right Now</div> 
                        : allJobs?.slice(0, 6).map((job) => <LatestJobCards key={job._id} job={job}/>)
                }
            </div>
        </div>
    )
}

export default LatestJobs