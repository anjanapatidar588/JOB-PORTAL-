import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  }

  return (
    <div className='text-center py-14 px-4 relative overflow-hidden animate-fade-in'>
      <div className='flex flex-col gap-6 my-4 max-w-4xl mx-auto'>
        <span className='mx-auto px-4 py-1.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200/60 font-semibold text-sm shadow-xs inline-flex items-center gap-2 animate-float-slow'>
          ⚡ India's #1 Next-Gen Job Portal
        </span>
        <h1 className='text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight'>
          Search, Apply & <br /> Get Your <span className='text-brand-gradient'>Dream Job</span>
        </h1>
        <p className='text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed'>
          Explore thousands of top tech opportunities from leading startups and Fortune 500 companies. Your next career milestone starts here.
        </p>
        <div className='flex w-full sm:w-[85%] md:w-[65%] lg:w-[55%] shadow-lg hover:shadow-2xl border border-slate-200/80 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10 bg-white/90 backdrop-blur-sm pl-5 py-2 rounded-full items-center gap-3 mx-auto transition-all duration-300 hover-lift'>
          <Search className='h-5 w-5 text-slate-400 shrink-0' />
          <input
            type="text"
            placeholder='Job title, skills, or company name...'
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchJobHandler()}
            className='outline-none border-none w-full text-slate-800 placeholder-slate-400 bg-transparent text-sm sm:text-base font-medium'
          />
          <Button onClick={searchJobHandler} className="rounded-full btn-brand-gradient px-6 py-3 shadow-md btn-interactive font-semibold shrink-0">
            Search Jobs
          </Button>
        </div>
      </div>
    </div>
  )
}

export default HeroSection