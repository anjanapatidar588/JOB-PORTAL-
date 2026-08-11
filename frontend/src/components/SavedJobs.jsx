import React, { useEffect } from 'react';
import Navbar from './shared/Navbar';
import Job from './Job';
import Footer from './shared/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { setAllSavedJobs } from '@/redux/jobSlice';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

const SavedJobs = () => {
    const dispatch = useDispatch();
    const { allSavedJobs } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);

    useEffect(() => {
        const fetchSavedJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/saved`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setAllSavedJobs(res.data.savedJobs));
                }
            } catch (error) {
                console.log("FETCH SAVED JOBS ERROR:", error);
            }
        };

        if (user) {
            fetchSavedJobs();
        }
    }, [user, dispatch]);

    return (
        <div className="min-h-screen flex flex-col justify-between bg-slate-50">
            <div>
                <Navbar />
                <div className="max-w-7xl mx-auto my-10 px-4">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-accent-50 rounded-xl text-accent-600 border border-accent-100">
                            <BookmarkCheck className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="font-extrabold text-2xl text-slate-900">Saved Jobs</h1>
                            <p className="text-slate-500 text-sm">
                                {allSavedJobs?.length === 0 
                                    ? "You haven't bookmarked any jobs yet" 
                                    : `You have ${allSavedJobs?.length} saved ${allSavedJobs?.length === 1 ? 'job' : 'jobs'}`
                                }
                            </p>
                        </div>
                    </div>

                    {allSavedJobs?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-100 shadow-xs my-8 text-center">
                            <Bookmark className="h-16 w-16 text-slate-300 mb-4" />
                            <h2 className="text-xl font-bold text-slate-800 mb-2">No Saved Jobs Found</h2>
                            <p className="text-slate-500 max-w-md mb-6 text-sm">
                                Save jobs that catch your interest so you can review and apply to them whenever you are ready.
                            </p>
                            <Link to="/jobs">
                                <Button className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-sm transition-all">
                                    Explore Jobs Now
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {allSavedJobs?.map((job) => (
                                <Job key={job._id} job={job} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SavedJobs;
