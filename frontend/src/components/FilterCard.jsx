import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilterParams, clearFilterParams } from '@/redux/jobSlice';
import { Button } from './ui/button';
import { Search, MapPin, Briefcase, IndianRupee, RotateCcw, Filter } from 'lucide-react';

const popularLocations = ["Remote", "Bangalore", "Delhi NCR", "Hyderabad", "Pune", "Mumbai"];
const jobTypes = ["Full-Time", "Part-Time", "Remote", "Internship", "Contract"];

const FilterCard = () => {
    const dispatch = useDispatch();
    const { filterParams, searchedQuery } = useSelector((store) => store.job || {});
    const activeFilters = filterParams || {};

    const [keyword, setKeyword] = useState(activeFilters.keyword || searchedQuery || '');
    const [location, setLocation] = useState(activeFilters.location || '');
    const [jobtype, setJobtype] = useState(activeFilters.jobtype || '');
    const [minSalary, setMinSalary] = useState(activeFilters.minSalary || '');
    const [maxSalary, setMaxSalary] = useState(activeFilters.maxSalary || '');

    // Sync state if Redux filterParams change (e.g., cleared from outside)
    useEffect(() => {
        setKeyword(activeFilters.keyword || searchedQuery || '');
        setLocation(activeFilters.location || '');
        setJobtype(activeFilters.jobtype || '');
        setMinSalary(activeFilters.minSalary || '');
        setMaxSalary(activeFilters.maxSalary || '');
    }, [filterParams, searchedQuery]);

    const handleApplyFilters = () => {
        dispatch(setFilterParams({
            keyword: keyword.trim(),
            location: location.trim(),
            jobtype: jobtype,
            minSalary: minSalary ? String(minSalary) : '',
            maxSalary: maxSalary ? String(maxSalary) : ''
        }));
    };

    const handleClearFilters = () => {
        setKeyword('');
        setLocation('');
        setJobtype('');
        setMinSalary('');
        setMaxSalary('');
        dispatch(clearFilterParams());
    };

    const hasActiveFilters = Boolean(keyword || location || jobtype || minSalary || maxSalary);

    return (
        <div className='w-full bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6'>
            {/* Filter Header */}
            <div className='flex items-center justify-between pb-3 border-b border-slate-100'>
                <div className='flex items-center gap-2'>
                    <Filter className='w-4 h-4 text-brand-600' />
                    <h1 className='font-bold text-slate-900 text-base'>Filter Jobs</h1>
                </div>
                {hasActiveFilters && (
                    <button 
                        onClick={handleClearFilters} 
                        className='text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 transition-colors'
                    >
                        <RotateCcw className='w-3 h-3' /> Clear All
                    </button>
                )}
            </div>

            {/* Keyword Search Input */}
            <div className='space-y-1.5'>
                <label className='text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5'>
                    <Search className='w-3.5 h-3.5 text-slate-400' /> Keyword Search
                </label>
                <div className='relative'>
                    <input
                        type="text"
                        placeholder="Job title, skill, or role..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                        className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Location Input & Quick Chips */}
            <div className='space-y-2'>
                <label className='text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5'>
                    <MapPin className='w-3.5 h-3.5 text-slate-400' /> Location
                </label>
                <input
                    type="text"
                    placeholder="Enter city or location..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                    className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
                />
                <div className='flex flex-wrap gap-1.5 pt-1'>
                    {popularLocations.map((loc, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => setLocation(location === loc ? '' : loc)}
                            className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                                location.toLowerCase() === loc.toLowerCase()
                                    ? 'bg-brand-50 border-brand-300 text-brand-700 font-bold'
                                    : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            {loc}
                        </button>
                    ))}
                </div>
            </div>

            {/* Job Type Dropdown / Select */}
            <div className='space-y-1.5'>
                <label className='text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5'>
                    <Briefcase className='w-3.5 h-3.5 text-slate-400' /> Job Type
                </label>
                <select
                    value={jobtype}
                    onChange={(e) => setJobtype(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none bg-white transition-all text-slate-700 font-medium"
                >
                    <option value="">All Job Types</option>
                    {jobTypes.map((type, idx) => (
                        <option key={idx} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            {/* Salary Range Inputs (LPA) */}
            <div className='space-y-2'>
                <label className='text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5'>
                    <IndianRupee className='w-3.5 h-3.5 text-slate-400' /> Salary Range (LPA)
                </label>
                <div className='grid grid-cols-2 gap-2'>
                    <input
                        type="number"
                        placeholder="Min (LPA)"
                        value={minSalary}
                        min="0"
                        onChange={(e) => setMinSalary(e.target.value)}
                        className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
                    />
                    <input
                        type="number"
                        placeholder="Max (LPA)"
                        value={maxSalary}
                        min="0"
                        onChange={(e) => setMaxSalary(e.target.value)}
                        className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className='pt-2 space-y-2'>
                <Button 
                    onClick={handleApplyFilters}
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm py-2.5 rounded-xl shadow-sm transition-all"
                >
                    Apply Filters
                </Button>
                {hasActiveFilters && (
                    <Button 
                        onClick={handleClearFilters}
                        variant="outline"
                        className="w-full border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-xs py-2 rounded-xl"
                    >
                        Clear Filters
                    </Button>
                )}
            </div>
        </div>
    );
};

export default FilterCard;