import { configureStore } from "@reduxjs/toolkit";
import  authSlice from '../redux/authSlice'; 
import jobSlice from '../redux/jobSlice';

const store = configureStore({
    reducer : {
         auth : authSlice,
         job : jobSlice
    }
});

export default store;