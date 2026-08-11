import { createSlice } from "@reduxjs/toolkit";

const initialFilterState = {
    keyword: "",
    location: "",
    jobtype: "",
    minSalary: "",
    maxSalary: ""
};

const jobSlice = createSlice({
    name:"job",
    initialState:{
        allJobs:[],
        allAdminJobs:[],
        singleJob:null, 
        searchJobByText:"",
        allAppliedJobs:[],
        allSavedJobs:[],
        searchedQuery:"",
        filterParams: initialFilterState,
    },
    reducers:{
        // actions
        setAllJobs:(state,action) => {
            state.allJobs = action.payload;
        },
        setSingleJobs:(state,action) => {
            state.singleJob = action.payload;
        },
        setAllAdminJobs:(state,action) => {
            state.allAdminJobs = action.payload;
        },
        setSearchJobByText:(state,action) => {
            state.searchJobByText = action.payload;
        },
        setAllAppliedJobs:(state,action) => {
            state.allAppliedJobs = action.payload;
        },
        setAllSavedJobs:(state,action) => {
            state.allSavedJobs = action.payload;
        },
        setSearchedQuery:(state,action) => {
            state.searchedQuery = action.payload;
        },
        setFilterParams:(state,action) => {
            const currentFilters = state.filterParams || initialFilterState;
            state.filterParams = { ...currentFilters, ...action.payload };
        },
        clearFilterParams:(state) => {
            state.filterParams = initialFilterState;
            state.searchedQuery = "";
        }
    }
});
export const {
    setAllJobs, 
    setSingleJobs, 
    setAllAdminJobs,
    setSearchJobByText, 
    setAllAppliedJobs,
    setAllSavedJobs,
    setSearchedQuery,
    setFilterParams,
    clearFilterParams
} = jobSlice.actions;
export default jobSlice.reducer;