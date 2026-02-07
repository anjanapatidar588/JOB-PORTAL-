import React from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './filterCard'
import Job from './Job';

const jobsarray = [1, 2, 3, 4, 5, 6, 7, 8];

const Jobs = () => {
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
                        {jobsarray.length === 0 ? (
                            <span>Job not found</span>
                        ) : (
                            <div className='grid grid-cols-3 gap-4'>
                                {jobsarray.map((item, index) => (
                                    <div key={index}>
                                        <Job />
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
