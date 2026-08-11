import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'

const Signup = () => {

  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "candidate",
    file: ""
  });
  const { loading, user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  }
  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  }
  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();    //formdata object
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { 'Content-Type': "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      dispatch(setLoading(false));
    }
  }

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [])
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />
      <div className='flex items-center justify-center max-w-7xl mx-auto px-4 py-8 w-full'>
        <form onSubmit={submitHandler} className='w-full max-w-lg border border-slate-100 rounded-2xl p-8 my-6 bg-white shadow-md'>
          <div className="mb-6">
            <h1 className='font-extrabold text-2xl text-slate-900'>Create an Account</h1>
            <p className='text-slate-500 text-sm mt-1'>Join thousands of job seekers and recruiters today</p>
          </div>
          
          <div className='my-3'>
            <Label className="text-slate-700 font-medium mb-1 block">Full Name</Label>
            <Input
              type="text"
              value={input.fullname}
              name="fullname"
              onChange={changeEventHandler}
              placeholder="Alex Morgan"
              className="border-slate-200 focus-within:border-brand-600"
            />
          </div>

          <div className='my-3'>
            <Label className="text-slate-700 font-medium mb-1 block">Email Address</Label>
            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="alex@gmail.com"
              className="border-slate-200 focus-within:border-brand-600"
            />
          </div>

          <div className='my-3'>
            <Label className="text-slate-700 font-medium mb-1 block">Phone Number</Label>
            <Input
              type="text"
              value={input.phoneNumber}
              name="phoneNumber"
              onChange={changeEventHandler}
              placeholder="+91 9876543210"
              className="border-slate-200 focus-within:border-brand-600"
            />
          </div>

          <div className='my-3'>
            <Label className="text-slate-700 font-medium mb-1 block">Password</Label>
            <Input
              type="password"
              value={input.password}
              name="password"
              placeholder="••••••••"
              onChange={changeEventHandler}
              className="border-slate-200 focus-within:border-brand-600"
            />
          </div>

          <div className='my-4 p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center'>
            <div className="w-full sm:w-1/2">
              <Label className="text-slate-700 font-medium mb-1.5 block">Select Role</Label>
              <select
                name="role"
                value={input.role}
                onChange={changeEventHandler}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all cursor-pointer shadow-xs font-medium"
              >
                <option value="candidate">Candidate</option>
                <option value="recruiter">Recruiter</option>
              </select>
            </div>

            <div>
              <Label className="text-slate-700 font-medium mb-1.5 block">Profile Photo</Label>
              <Input
                accept="image/*"
                type="file"
                onChange={changeFileHandler}
                className="cursor-pointer text-xs file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
              />
            </div>
          </div>

          {
            loading ? (
              <Button disabled className="w-full my-4 btn-brand-gradient py-2.5 rounded-xl opacity-80"> 
                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Creating Account... 
              </Button>
            ) : (
              <Button type="submit" className="btn-brand-gradient font-semibold w-full my-4 py-2.5 rounded-xl shadow-md transition-all">
                Sign Up
              </Button>
            )
          }

          <div className="text-center mt-3">
            <span className='text-sm text-slate-600'>Already have an account? <Link to="/login" className='text-brand-600 font-semibold hover:underline'>Log in</Link></span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup