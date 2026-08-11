import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { USER_API_END_POINT } from "../../utils/constant";
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'


const Login = () => {

  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "candidate",
  })

  const { loading } = useSelector(store => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const submitHandler = async (e) => {
    e.preventDefault()

      console.log("Login input:", input)

    try {
      dispatch(setLoading(true))   

      const res = await axios.post(
        `${USER_API_END_POINT}/login`,
        input,
        {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true,
        }
      )

      if (res.data.success) {

        dispatch(setUser(res.data.user));

         navigate("/")
        toast.success(res.data.message)
       
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Login failed")
    }
  finally{
      dispatch(setLoading(false))
  }
}

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />
      <div className='flex items-center justify-center max-w-7xl mx-auto px-4 py-8 w-full'>
        <form
          onSubmit={submitHandler}
          className='w-full max-w-md border border-slate-100 rounded-2xl p-8 my-6 bg-white shadow-md'
        >
          <div className="mb-6">
            <h1 className='font-extrabold text-2xl text-slate-900'>Welcome Back</h1>
            <p className='text-slate-500 text-sm mt-1'>Please log in to access your portal</p>
          </div>

          <div className='my-4'>
            <Label className="text-slate-700 font-medium mb-1.5 block">Email Address</Label>
            <Input
              type="email"
              name="email"
              placeholder="name@example.com"
              value={input.email}
              onChange={changeEventHandler}
              className="border-slate-200 focus-within:border-brand-600 focus-within:ring-brand-600"
            />
          </div>

          <div className='my-4'>
            <Label className="text-slate-700 font-medium mb-1.5 block">Password</Label>
            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              value={input.password}
              onChange={changeEventHandler}
              className="border-slate-200 focus-within:border-brand-600 focus-within:ring-brand-600"
            />
          </div>

          {/* ROLE SELECTION DROPDOWN */}
          <div className="my-5">
            <Label className="text-slate-700 font-medium mb-1.5 block">Select Account Type</Label>
            <select
              name="role"
              value={input.role}
              onChange={changeEventHandler}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all cursor-pointer shadow-xs font-medium"
            >
              <option value="candidate">Candidate</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>

          {/* submit button */}
          {
            loading ? (
              <Button disabled className='w-full my-4 btn-brand-gradient py-2.5 rounded-xl opacity-80'> 
                <Loader2 className='mr-2 h-4 w-4 animate-spin'/> Logging in...
              </Button>
            ) : (
              <Button type="submit" className='btn-brand-gradient font-semibold w-full my-4 py-2.5 rounded-xl shadow-md transition-all'>
                Log In
              </Button>
            )
          }

          <div className="text-center mt-4">
            <span className='text-sm text-slate-600'>
              Don't have an account?{" "}
              <Link to="/signup" className='text-brand-600 font-semibold hover:underline'>Sign up</Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
