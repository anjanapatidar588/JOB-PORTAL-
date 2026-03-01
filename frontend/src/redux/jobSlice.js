import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name: "job",
    initialState: {
        allJobs: [],
        singleJob: null,
        searchedQuery: ""   
    },
    reducers: {
        setAllJobs: (state, action) => {
            state.allJobs = action.payload;
        },
        setSingleJobs: (state, action) => {
            state.singleJob = action.payload;
        },
        setSearchedQuery: (state, action) => {   
            state.searchedQuery = action.payload;
        }
    }
});

export const { 
    setAllJobs, 
    setSingleJobs, 
    setSearchedQuery  
} = jobSlice.actions;

export default jobSlice.reducer;