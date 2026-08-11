import React, { useState } from 'react';
import Navbar from './shared/Navbar';
import FilterCard from './FilterCard';
import Job from './Job';
import { useSelector, useDispatch } from 'react-redux';
import { setFilterParams, clearFilterParams, setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Search, X, SlidersHorizontal, SearchX, Briefcase, MapPin, IndianRupee } from 'lucide-react';

const Jobs = () => {
    // Invoke hook to auto-fetch jobs based on filter parameters
    useGetAllJobs();

    const dispatch = useDispatch();
    const { allJobs, searchedQuery, filterParams } = useSelector((store) => store.job || {});

    const [topSearch, setTopSearch] = useState(searchedQuery || filterParams?.keyword || '');

    const handleTopSearchSubmit = (e) => {
        e?.preventDefault();
        dispatch(setSearchedQuery(topSearch));
        dispatch(setFilterParams({ keyword: topSearch }));
    };

    const removeFilter = (key) => {
        if (key === 'keyword') {
            setTopSearch('');
            dispatch(setSearchedQuery(''));
            dispatch(setFilterParams({ keyword: '' }));
        } else if (key === 'location') {
            dispatch(setFilterParams({ location: '' }));
        } else if (key === 'jobtype') {
            dispatch(setFilterParams({ jobtype: '' }));
        } else if (key === 'salary') {
            dispatch(setFilterParams({ minSalary: '', maxSalary: '' }));
        }
    };

    const handleResetAll = () => {
        setTopSearch('');
        dispatch(clearFilterParams());
    };

    const activeKeyword = filterParams?.keyword || searchedQuery;
    const hasActiveFilters = Boolean(
        activeKeyword || 
        filterParams?.location || 
        filterParams?.jobtype || 
        filterParams?.minSalary || 
        filterParams?.maxSalary
    );

    return (
        <div className='min-h-screen bg-slate-50/50 pb-12'>
            <Navbar />

            <div className='max-w-7xl mx-auto px-4 mt-6'>
                {/* Top Search Bar & Header */}
                <div className='bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4'>
                    <div>
                        <h1 className='font-extrabold text-xl sm:text-2xl text-slate-900 flex items-center gap-2'>
                            <Briefcase className='w-6 h-6 text-brand-600' />
                            Explore Career Opportunities
                        </h1>
                        <p className='text-xs sm:text-sm text-slate-500 mt-0.5'>
                            Showing <span className='font-bold text-brand-700'>{allJobs?.length || 0}</span> available positions
                        </p>
                    </div>

                    <form onSubmit={handleTopSearchSubmit} className='flex w-full md:w-1/2 gap-2'>
                        <div className='relative flex-1'>
                            <Search className='absolute left-3.5 top-3 w-4 h-4 text-slate-400' />
                            <input
                                type="text"
                                placeholder="Search by job title, skills, or keywords..."
                                value={topSearch}
                                onChange={(e) => setTopSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100 outline-none transition-all"
                            />
                            {topSearch && (
                                <button 
                                    type="button" 
                                    onClick={() => { setTopSearch(''); dispatch(setSearchedQuery('')); dispatch(setFilterParams({ keyword: '' })); }}
                                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <Button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs">
                            Search
                        </Button>
                    </form>
                </div>

                {/* Active Filter Chips/Tags Bar */}
                {hasActiveFilters && (
                    <div className='bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-2xs mb-6 flex flex-wrap items-center gap-2'>
                        <span className='text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mr-1'>
                            <SlidersHorizontal className='w-3.5 h-3.5 text-brand-600' /> Active Filters:
                        </span>

                        {activeKeyword && (
                            <Badge className="bg-brand-50 text-brand-700 border border-brand-200 font-medium text-xs px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                                <Search className="w-3 h-3" /> Keyword: "{activeKeyword}"
                                <X onClick={() => removeFilter('keyword')} className="w-3.5 h-3.5 cursor-pointer hover:text-brand-900 transition-colors ml-0.5" />
                            </Badge>
                        )}

                        {filterParams?.location && (
                            <Badge className="bg-blue-50 text-blue-700 border border-blue-200 font-medium text-xs px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                                <MapPin className="w-3 h-3" /> Location: "{filterParams.location}"
                                <X onClick={() => removeFilter('location')} className="w-3.5 h-3.5 cursor-pointer hover:text-blue-900 transition-colors ml-0.5" />
                            </Badge>
                        )}

                        {filterParams?.jobtype && (
                            <Badge className="bg-purple-50 text-purple-700 border border-purple-200 font-medium text-xs px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                                <Briefcase className="w-3 h-3" /> Type: "{filterParams.jobtype}"
                                <X onClick={() => removeFilter('jobtype')} className="w-3.5 h-3.5 cursor-pointer hover:text-purple-900 transition-colors ml-0.5" />
                            </Badge>
                        )}

                        {(filterParams?.minSalary || filterParams?.maxSalary) && (
                            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium text-xs px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                                <IndianRupee className="w-3 h-3" /> Salary: {filterParams.minSalary || '0'} - {filterParams.maxSalary || '∞'} LPA
                                <X onClick={() => removeFilter('salary')} className="w-3.5 h-3.5 cursor-pointer hover:text-emerald-900 transition-colors ml-0.5" />
                            </Badge>
                        )}

                        <button
                            onClick={handleResetAll}
                            className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline ml-auto"
                        >
                            Reset All Filters
                        </button>
                    </div>
                )}

                {/* Main Content Layout */}
                <div className='flex flex-col lg:flex-row gap-6'>
                    {/* Left Sidebar Filter Controls */}
                    <div className='w-full lg:w-1/4 shrink-0'>
                        <FilterCard />
                    </div>

                    {/* Right Jobs Listing Grid */}
                    <div className='flex-1 min-h-[60vh]'>
                        {allJobs && allJobs.length > 0 ? (
                            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
                                {allJobs.map((job) => (
                                    <Job key={job?._id} job={job} />
                                ))}
                            </div>
                        ) : (
                            <div className='bg-white rounded-2xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-sm my-4'>
                                <div className='p-4 bg-slate-100 rounded-full text-slate-400'>
                                    <SearchX className='w-10 h-10' />
                                </div>
                                <h3 className='text-xl font-bold text-slate-900'>No Jobs Found</h3>
                                <p className='text-slate-500 text-sm max-w-md mx-auto'>
                                    We couldn't find any job postings matching your current filter criteria. Try adjusting your keyword, location, or salary parameters.
                                </p>
                                {hasActiveFilters && (
                                    <Button 
                                        onClick={handleResetAll} 
                                        className="bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-xs"
                                    >
                                        Clear All Filters
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Jobs;