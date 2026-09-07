# 04 — BACKEND ARCHITECTURE & EXPRESS CONTROLLERS DEEP DIVE

---

## 1. Server Setup & Middlewares (`server.js`)

`server.js` initializes the Express application, HTTP server, and Socket.io instance:

```javascript
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./utils/db.js";
import dotenv from "dotenv";
import http from "http";
import { initSocket } from "./utils/socket.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io WebSocket server
initSocket(server);

// Global Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOption = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOption));

// API Routers
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/notification", notificationRoute);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  connectDB();
  console.log(`Server running at port ${PORT}`);
});
```

---

## 2. Express Routers Overview

| Router Path | Route File | Purpose |
| :--- | :--- | :--- |
| `/api/v1/user` | `userRoute.js` | User authentication, session logout, and profile update (resumes & avatars). |
| `/api/v1/company` | `companyRoute.js` | Company registration, company update with logo upload, company retrieval. |
| `/api/v1/job` | `jobRoute.js` | Job posting, filtered job retrieval, admin job retrieval, job bookmarking. |
| `/api/v1/application` | `applicationRoute.js` | Job application submission, applicant tracking, status updating, recruiter stats analytics. |
| `/api/v1/notification` | `notificationRoute.js` | Fetching persistent notifications, marking notifications read, clearing notifications. |

---

## 3. Middleware Implementations

### A. `isAuthenticated.js`
- **Purpose**: Verifies incoming JWT cookie for protected routes.
- **Implementation**:
  ```javascript
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "User not authenticated", success: false });

  const decode = jwt.verify(token, process.env.SECRET_KEY);
  req.id = decode.userId;
  const user = await User.findById(decode.userId).select("-password");
  req.user = user;
  next();
  ```

### B. `authorizeRoles.js`
- **Purpose**: Enforces Role-Based Access Control (RBAC).
- **Normalizations**: Normalizes role strings to lowercase. Maps candidate/student/employee aliases interchangeably. Grants `admin` full global access to all protected endpoints.

### C. `multer.js`
- **Purpose**: Intercepts `multipart/form-data` file uploads.
- **Config**: Configured with `multer.memoryStorage()`, keeping raw file buffers in `req.file.buffer`.

---

## 4. Backend Controllers Breakdown

### 1. `user.controller.js`
- `register(req, res)`: Registers new candidate or recruiter. Hashes password using `bcrypt.hash(password, 10)`. Uploads optional avatar photo to Cloudinary.
- `login(req, res)`: Verifies user credentials, role, generates JWT token (`expiresIn: "1d"`), and sets `token` HTTP-only cookie.
- `logout(req, res)`: Clears the `token` cookie (`maxAge: 0`).
- `updateProfile(req, res)`: Updates bio, skills array, and processes resume PDF upload to Cloudinary (`resource_type: "raw"`).

### 2. `company.controller.js`
- `registerCompany(req, res)`: Registers a unique company linked to `userId: req.id`.
- `getCompany(req, res)`: Fetches all companies registered by the logged-in recruiter (`{ userId }`).
- `getCompanyById(req, res)`: Fetches single company document by ID.
- `updateCompany(req, res)`: Updates name, description, website, location, and uploads company logo to Cloudinary.

### 3. `job.controller.js`
- `postJob(req, res)`: Creates a new job document linked to `companyId` and `created_by: req.id`.
- `getAllJobs(req, res)`: Advanced filter query search supporting `keyword` (regex search on title, description, requirements), `location`, `jobtype` (`$in` match), and salary range (`$gte`, `$lte`).
- `getJobById(req, res)`: Fetches single job populated with applications.
- `getAdminJobs(req, res)`: Returns all jobs for Admin, or recruiter-specific jobs for Recruiter.
- `bookmarkJob(req, res)`: Toggles job ID inside candidate's `user.savedJobs` array.
- `getSavedJobs(req, res)`: Populates candidate's `savedJobs` with company details.

### 4. `application.controller.js`
- `applyJob(req, res)`: Prevents duplicate applications, creates application document with initial status `'applied'` and timestamped `statusHistory`, updates `job.applications`, and dispatches `NEW_APPLICATION` notification to recruiter.
- `getAppliedJobs(req, res)`: Returns candidate's application list with populated job & company details.
- `getApplicants(req, res)`: Returns applicants for a recruiter job with populated applicant profiles.
- `updateStatus(req, res)`: Updates application status, pushes timestamped object into `statusHistory`, and dispatches real-time `STATUS_UPDATE` notification to candidate over Socket.io.
- `getRecruiterStats(req, res)`: Computes recruiter dashboard analytics (`totalJobs`, `totalApplications`, status counts breakdown).

### 5. `notification.controller.js`
- `getNotifications(req, res)`: Fetches last 50 notifications for logged-in user and unread count.
- `markNotificationsAsRead(req, res)`: Sets `isRead: true` for user's notifications.
- `clearNotifications(req, res)`: Deletes user's notification documents.
