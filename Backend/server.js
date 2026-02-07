import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./utils/db.js";
import dotenv from "dotenv";

import userRoute from "./routes/userRoute.js";
import companyRoute from "./routes/companyRoute.js";
import jobRoute from "./routes/jobRoute.js";
import applicationRoute from "./routes/applicatonRoute.js";

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//  CORRECT CORS CONFIG
const corsOption = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOption));

// apis
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running at port ${PORT}`);
});

export default app;
