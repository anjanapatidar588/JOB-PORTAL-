import React, { useEffect } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setsearchCompanyByText } from '@/redux/companySlice'
import { useState } from 'react'
import AdminJobTable from '../admin/AdminJobTable'
import useGetAllAdminJob from '@/hooks/useGetAllAdminJob'

const AdminJobs = () => {
  useGetAllAdminJob();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setsearchCompanyByText(input));
  }, [input]);

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto my-10">
        <div className='flex items-center justify-between my-5'>
          <Input
            className="w-fit"
            placeholder="filter by name,role"
            onChange={(e) => setInput(e.target.value)}
          />

          <Button onClick={() => navigate("/admin/companies/create")}>New Jobs</Button>
        </div>
      </div>

      <AdminJobTable />
    </div>
  )
}

export default AdminJobs
