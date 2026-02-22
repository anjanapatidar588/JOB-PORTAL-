import {createSlice} from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name : "job",
    initialState : {
        allJobs : [],
        singleJob:null,
    },
    //actions
    reducers : {
        setAllJobs : (state,action) => {
            state.allJobs = action.payload;
        },
        setSingleJobs : (state,action) => {
            state.singleJob = action.payload;
        }
    }
});


export const { setAllJobs ,setSingleJobs} = jobSlice.actions;
export default jobSlice.reducer;