import React from 'react';
import Navbar from './shared/Navbar';
import FilterCard from './FilterCard';
import Job from './Job';
import { useSelector } from 'react-redux';

const Jobs = () => {

    const { allJobs } = useSelector((store) => store.job);

    console.log("All Jobs Data:", allJobs);

    return (
        <div>
            <Navbar />

            <div className='max-w-7xl mx-auto mt-5'>
                <div className='flex gap-5'>

                    {/* Left side: Filter */}
                    <div className='w-1/5'>
                        <FilterCard />
                    </div>

                    {/* Right side: Job Listings */}
                    <div className='flex-1 h-[88vh] overflow-auto pb-5'>

                        {Array.isArray(allJobs) && allJobs.length > 0 ? (
                            <div className='grid grid-cols-3 gap-4'>
                                {allJobs.map((job) => (
                                    <Job key={job?._id} job={job} />
                                ))}
                            </div>
                        ) : (
                            <span className='text-gray-500 text-lg'>
                                Job not found
                            </span>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Jobs;