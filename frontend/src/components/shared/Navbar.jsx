import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Bell, Bookmark, LogOut, User2, Trash2, Briefcase, Clock, ArrowUpRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT, NOTIFICATION_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { markAllAsRead, clearNotifications } from '@/redux/notificationSlice'
import useSocket from '@/hooks/useSocket'
import { toast } from 'sonner'
import hireflowLogo from '@/assets/hireflow-logo.png'

const Navbar = () => {
    useSocket();

    const { user } = useSelector(store => store.auth);
    const { notifications, unreadCount } = useSelector(store => store.notification);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isRecruiter = user?.role === 'recruiter';

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Logout failed");
        }
    };

    const handleMarkAsRead = async () => {
        dispatch(markAllAsRead());
        try {
            await axios.post(`${NOTIFICATION_API_END_POINT}/read`, {}, { withCredentials: true });
        } catch (error) {
            console.log("Error marking read:", error);
        }
    };

    const handleClearNotifications = async () => {
        dispatch(clearNotifications());
        try {
            await axios.delete(`${NOTIFICATION_API_END_POINT}/clear`, { withCredentials: true });
            toast.success("Notifications cleared");
        } catch (error) {
            console.log("Error clearing notifications:", error);
        }
    };

    return (
        <div className='glass-header border-b border-slate-200/60 sticky top-0 z-50 shadow-xs transition-all duration-300'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4 sm:px-6'>
                <div>
                    <Link to="/" className="group flex items-center transition-all duration-300">
                        <img 
                            src={hireflowLogo} 
                            alt="HireFlow Logo" 
                            className="h-10 sm:h-11 md:h-12 w-auto object-contain mix-blend-multiply transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_4px_12px_rgba(59,130,246,0.3)] animate-fade-in"
                        />
                    </Link>
                </div>
                <div className='flex items-center gap-6'>
                    <ul className='flex font-medium items-center gap-6 text-slate-700 text-sm'>
                        {
                            !user ? (
                                <>
                                    <li><Link to="/" className='hover:text-brand-600 transition-colors'>Home</Link></li>
                                    <li><Link to="/jobs" className='hover:text-brand-600 transition-colors'>Jobs</Link></li>
                                    <li><Link to="/browse" className='hover:text-brand-600 transition-colors'>Browse</Link></li>
                                </>
                            ) : isRecruiter ? (
                                <>
                                    <li><Link to="/admin/dashboard" className='hover:text-brand-600 transition-colors font-medium'>Dashboard</Link></li>
                                    <li><Link to="/admin/companies" className='hover:text-brand-600 transition-colors font-medium'>Companies</Link></li>
                                    <li><Link to="/admin/jobs" className='hover:text-brand-600 transition-colors font-medium'>Jobs</Link></li>
                                    <li>
                                        <Link to="/admin/jobs/create">
                                            <Button className="btn-brand-gradient text-xs px-3.5 py-1.5 rounded-lg shadow-xs font-semibold">
                                                + Post Job
                                            </Button>
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/" className='hover:text-brand-600 transition-colors'>Home</Link></li>
                                    <li><Link to="/jobs" className='hover:text-brand-600 transition-colors'>Jobs</Link></li>
                                    <li><Link to="/browse" className='hover:text-brand-600 transition-colors'>Browse</Link></li>
                                    <li><Link to="/saved-jobs" className='hover:text-brand-600 transition-colors'>Saved Jobs</Link></li>
                                </>
                            )
                        }
                    </ul>

                    {
                        !user ? (
                            <div className='flex items-center gap-3'>
                                <Link to="/login"><Button variant="outline" className="border-slate-300 text-slate-700 hover:text-brand-600 hover:bg-brand-50/50 rounded-xl transition-all">Login</Button></Link>
                                <Link to="/signup"><Button className="btn-brand-gradient font-medium rounded-xl shadow-sm transition-all">Signup</Button></Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                {/* REAL-TIME NOTIFICATION BELL */}
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button 
                                            onClick={handleMarkAsRead}
                                            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors focus:outline-none"
                                            title="Notifications"
                                        >
                                            <Bell className="h-5 w-5" />
                                            {unreadCount > 0 && (
                                                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs animate-pulse">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent 
                                        align="end" 
                                        sideOffset={8}
                                        className="w-80 sm:w-96 max-w-[calc(100vw-2rem)] p-0 border border-slate-200/80 shadow-2xl rounded-2xl overflow-hidden bg-white/98 backdrop-blur-md z-50 mr-2 sm:mr-0"
                                    >
                                        <div className="p-3.5 px-4 bg-slate-50/90 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm">
                                            <div className="flex items-center gap-2">
                                                <Bell className="h-4 w-4 text-brand-600 shrink-0" />
                                                <h4 className="font-extrabold text-slate-900 text-sm tracking-tight">Notifications</h4>
                                                {unreadCount > 0 && (
                                                    <span className="text-[10px] bg-brand-100 text-brand-700 font-bold px-2 py-0.5 rounded-full">
                                                        {unreadCount} new
                                                    </span>
                                                )}
                                            </div>
                                            {notifications.length > 0 && (
                                                <button 
                                                    onClick={handleClearNotifications} 
                                                    className="text-xs text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 font-semibold transition-colors shrink-0"
                                                >
                                                    <Trash2 className="h-3 w-3" /> Clear All
                                                </button>
                                            )}
                                        </div>

                                        <div className="max-h-80 sm:max-h-96 overflow-y-auto divide-y divide-slate-100/70">
                                            {notifications.length === 0 ? (
                                                <div className="p-8 text-center text-slate-400 text-xs">
                                                    No notifications yet
                                                </div>
                                            ) : (
                                                notifications.map((item, idx) => (
                                                    <div 
                                                        key={idx} 
                                                        onClick={() => item.link && navigate(item.link)}
                                                        className={`p-3.5 px-4 transition-all duration-200 border-b border-slate-100/80 last:border-0 ${
                                                            item.link ? 'cursor-pointer hover:bg-slate-50/80 group' : ''
                                                        } ${!item.isRead ? 'bg-brand-50/30' : 'bg-white'}`}
                                                    >
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="flex-1 min-w-0 space-y-1.5">
                                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                                                                        item.type === 'NEW_APPLICATION' 
                                                                            ? 'bg-blue-50 text-blue-700 border-blue-200' 
                                                                            : item.type === 'STATUS_UPDATE' 
                                                                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                                                                            : 'bg-slate-100 text-slate-700 border-slate-200'
                                                                    }`}>
                                                                        {item.type ? item.type.replace('_', ' ') : 'ALERT'}
                                                                    </span>
                                                                </div>

                                                                <p className="text-xs font-medium text-slate-800 leading-relaxed break-words whitespace-normal font-sans">
                                                                    {item.message}
                                                                </p>

                                                                <div className="flex items-center justify-between gap-2 pt-1">
                                                                    <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                                                                        <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                                                                        {item.createdAt ? new Date(item.createdAt).toLocaleString('en-US', {
                                                                            month: 'short',
                                                                            day: 'numeric',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        }) : 'Just now'}
                                                                    </span>

                                                                    {item.link && (
                                                                        <span className="text-[11px] font-bold text-brand-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 shrink-0">
                                                                            View Details <ArrowUpRight className="w-3 h-3" />
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {!item.isRead && (
                                                                <span className="w-2.5 h-2.5 rounded-full bg-brand-600 shrink-0 mt-1 shadow-2xs ring-2 ring-brand-100" title="Unread notification" />
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </PopoverContent>
                                </Popover>

                                {/* USER AVATAR POPOVER */}
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Avatar className="cursor-pointer ring-2 ring-brand-600/20 hover:ring-brand-600/50 transition-all">
                                            <AvatarImage src={user?.profile?.profilePhoto} alt="@user" />
                                        </Avatar>
                                    </PopoverTrigger>
                                    <PopoverContent 
                                        align="end"
                                        sideOffset={8}
                                        className="w-80 p-4 border border-slate-200/90 shadow-2xl rounded-2xl bg-white z-50 mr-2 sm:mr-0 opacity-100 backdrop-blur-none"
                                    >
                                        <div>
                                            <div className='flex gap-3 items-center pb-3.5 border-b border-slate-100'>
                                                <Avatar className="cursor-pointer shrink-0">
                                                    <AvatarImage src={user?.profile?.profilePhoto} alt="@user" />
                                                </Avatar>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h4 className='font-bold text-slate-900 text-sm truncate'>{user?.fullname}</h4>
                                                        <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 bg-brand-100 text-brand-700 rounded-full shrink-0">
                                                            {isRecruiter ? 'Recruiter' : 'Candidate'}
                                                        </span>
                                                    </div>
                                                    <p className='text-xs text-slate-500 truncate mt-0.5'>{user?.email}</p>
                                                </div>
                                            </div>
                                            <div className='flex flex-col mt-3 space-y-1 text-slate-600 text-sm'>
                                                {!isRecruiter ? (
                                                    <>
                                                        <div className='flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer'>
                                                            <User2 className="h-4 w-4 text-slate-500 shrink-0" />
                                                            <Link to="/profile" className="w-full text-left font-medium text-xs sm:text-sm">View Profile</Link>
                                                        </div>
                                                        <div className='flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer'>
                                                            <Bookmark className="h-4 w-4 text-slate-500 shrink-0" />
                                                            <Link to="/saved-jobs" className="w-full text-left font-medium text-xs sm:text-sm">Saved Jobs</Link>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className='flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer'>
                                                        <Briefcase className="h-4 w-4 text-slate-500 shrink-0" />
                                                        <Link to="/admin/dashboard" className="w-full text-left font-medium text-xs sm:text-sm">Recruiter Dashboard</Link>
                                                    </div>
                                                )}

                                                <div className='flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-rose-50 text-rose-600 cursor-pointer transition-colors mt-1' onClick={logoutHandler}>
                                                    <LogOut className="h-4 w-4 text-rose-500 shrink-0" />
                                                    <span className="font-medium text-xs sm:text-sm">Logout</span>
                                                </div>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Navbar;