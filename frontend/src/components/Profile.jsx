import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Contact, Pen, Mail } from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'

// const skills = ['HTML', 'CSS', 'JS', 'React'];
const isResume = true;

const Profile = () => {
    useGetAppliedJobs();
    const [open,setOpen] = useState(false);
    const {user} = useSelector(store => store.auth);
    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            <Navbar />
            <div className="max-w-4xl mx-auto bg-white border border-slate-100 shadow-sm rounded-2xl my-8 p-8">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-6">
                        <Avatar className="h-24 w-24 border-2 border-brand-100 shadow-sm">
                            <AvatarImage src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"} />
                        </Avatar>

                        <div>
                            <h1 className="font-extrabold text-2xl text-slate-900">{user?.fullname}</h1>
                            <p className="text-slate-500 text-sm mt-1">{user?.profile?.bio || "No bio added yet"}</p>
                        </div>
                    </div>

                    <Button onClick={() => setOpen(true)} variant="outline" className="border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg">
                        <Pen className="h-4 w-4 mr-2" /> Edit Profile
                    </Button>
                </div>

                <div className='my-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-600 text-sm'>
                    <div className='flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100'>
                        <Mail className="h-5 w-5 text-brand-600" />
                        <span className="font-medium text-slate-800">{user?.email}</span>
                    </div>

                    <div className='flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100'>
                        <Contact className="h-5 w-5 text-brand-600" />
                        <span className="font-medium text-slate-800">{user?.phoneNumber || "Not provided"}</span>
                    </div>
                </div>

                <div className='my-6'>
                    <h1 className="text-slate-900 font-bold text-base mb-3">Skills</h1>
                    <div className="flex flex-wrap items-center gap-2">
                        {
                          user?.profile?.skills && user?.profile?.skills.length !== 0
                                ? user?.profile?.skills.map((item, index) => (
                                    <Badge key={index} className="bg-brand-50 text-brand-700 border-0 font-semibold px-3 py-1 rounded-full text-xs">{item}</Badge>
                                ))
                                : <span className="text-slate-400 text-sm italic">No skills listed</span>
                        }
                    </div>
                </div>

                <div className='pt-4 border-t border-slate-100 flex flex-col gap-1.5'>
                    <Label className='text-slate-900 font-bold text-base'>Resume</Label>
                    {
                        user?.profile?.resume 
                            ? <a target='_blank' rel="noopener noreferrer" href={user?.profile?.resume} className='text-brand-600 font-semibold hover:underline text-sm inline-flex items-center gap-1.5'>
                                📄 {user?.profile?.resumeOriginalName || "Download Resume"}
                              </a> 
                            : <span className="text-slate-400 text-sm italic">No resume uploaded</span>
                    }
                </div>
            </div>

            <div className='max-w-4xl mx-auto bg-white border border-slate-100 shadow-sm rounded-2xl p-8'>
                <h1 className='font-extrabold text-xl text-slate-900 mb-6'>Applied Jobs History</h1>
                <AppliedJobTable />
            </div>

            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile
