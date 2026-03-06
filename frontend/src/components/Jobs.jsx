import React from 'react';
import Navbar from './shared/Navbar';
import FilterCard from './FilterCard';
import Job from './Job';
import { useSelector } from 'react-redux';

const Jobs = () => {

    const { allJobs, searchedQuery } = useSelector((store) => store.job);

    // Filter logic
    const filteredJobs = allJobs?.filter((job) => {
        if (!searchedQuery) return true;

        return (
            job?.title?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
            job?.description?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
            job?.location?.toLowerCase().includes(searchedQuery.toLowerCase())
        );
    });

    return (
        <div>
            <Navbar />

            <div className='max-w-7xl mx-auto mt-5'>
                <div className='flex gap-5'>

                    {/* Filter Section */}
                    <div className='w-1/5'>
                        <FilterCard />
                    </div>

                    {/* Jobs Section */}
                    <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>

                        {filteredJobs && filteredJobs.length > 0 ? (
                            <div className='grid grid-cols-3 gap-4'>
                                {filteredJobs.map((job) => (
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