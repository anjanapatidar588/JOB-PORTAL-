import { setAllJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const { searchedQuery, filterParams } = useSelector(store => store.job || {});

    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                const params = new URLSearchParams();
                
                const keywordVal = filterParams?.keyword || searchedQuery || "";
                if (keywordVal) params.append("keyword", keywordVal);
                if (filterParams?.location) params.append("location", filterParams.location);
                if (filterParams?.jobtype) params.append("jobtype", filterParams.jobtype);
                if (filterParams?.minSalary !== "" && filterParams?.minSalary !== undefined) {
                    params.append("minSalary", filterParams.minSalary);
                }
                if (filterParams?.maxSalary !== "" && filterParams?.maxSalary !== undefined) {
                    params.append("maxSalary", filterParams.maxSalary);
                }

                const res = await axios.get(`${JOB_API_END_POINT}/get?${params.toString()}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                console.log("Error fetching jobs:", error);
            }
        };
        fetchAllJobs();
    }, [searchedQuery, filterParams, dispatch]);
};

export default useGetAllJobs;