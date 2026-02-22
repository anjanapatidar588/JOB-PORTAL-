import React from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './filterCard'
import Job from './Job';
import { useSelector } from 'react-redux';

const jobsarray = [1, 2, 3, 4, 5, 6, 7, 8];

const Jobs = () => {
      
    const {allJobs} = useSelector(store=>store.job);
    
    console.log("All Jobs Data:", allJobs);

    return (
 
        <div>
            <Navbar />

            <div className='max-w-7xl mx-auto mt-5'>
                <div className='flex gap-5'>
                    {/* Left side: filter */}
                    <div className='w-1/5'>
                        <FilterCard />
                    </div>

                    {/* Right side: job postings */}
                    <div className='flex-1 h-[88vh] overflow-auto pb-5'>
                        {
                        allJobs.length <= 0 ? (
                            <span>Job not found</span>
                        ) : (
                            <div className='grid grid-cols-3 gap-4'>
                                {allJobs.map((job) => (
                                    <div key={job?._id}>
                                        <Job job ={job}/>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Jobs
