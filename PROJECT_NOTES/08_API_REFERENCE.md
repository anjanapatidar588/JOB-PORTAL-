# 08 — COMPLETE API REFERENCE DOCUMENTATION

---

## 1. User & Auth Endpoints (`/api/v1/user`)

### 1. Register User
- **Method**: `POST`
- **URL**: `/api/v1/user/register`
- **Auth Required**: No
- **Content-Type**: `multipart/form-data`
- **Request Body**: `fullname`, `email`, `phoneNumber`, `password`, `role` (`candidate`/`recruiter`), `file` (optional avatar image)
- **Controller**: `register` in `user.controller.js`
- **Database Operation**: Creates new `User` document. Uploads photo to Cloudinary.
- **Success Response (201)**: `{ "message": "Account created successfully.", "success": true }`

### 2. Login User
- **Method**: `POST`
- **URL**: `/api/v1/user/login`
- **Auth Required**: No
- **Request Body**: `{ "email": "...", "password": "...", "role": "candidate" }`
- **Controller**: `login` in `user.controller.js`
- **Database Operation**: `User.findOne({ email })`. Sets `token` HTTP-only cookie.
- **Success Response (200)**: `{ "message": "Welcome back...", "user": { ... }, "success": true }`

### 3. Logout User
- **Method**: `GET`
- **URL**: `/api/v1/user/logout`
- **Auth Required**: No
- **Controller**: `logout` in `user.controller.js`
- **Operation**: Overwrites `token` cookie with `maxAge: 0`.
- **Success Response (200)**: `{ "message": "Logged out successfully", "success": true }`

### 4. Update Profile
- **Method**: `POST`
- **URL**: `/api/v1/user/profile/update`
- **Auth Required**: Yes (`isAuthenticated`)
- **Content-Type**: `multipart/form-data`
- **Request Body**: `fullname`, `email`, `phoneNumber`, `bio`, `skills` (comma-separated), `file` (resume PDF)
- **Controller**: `updateProfile` in `user.controller.js`
- **Database Operation**: `User.findById(userId)`. Saves raw file upload to Cloudinary.
- **Success Response (200)**: `{ "message": "Profile updated successfully", "user": { ... }, "success": true }`

---

## 2. Company Endpoints (`/api/v1/company`)

### 1. Register Company
- **Method**: `POST`
- **URL**: `/api/v1/company/register`
- **Auth Required**: Yes (`isAuthenticated`, `authorizeRoles('recruiter')`)
- **Request Body**: `{ "companyName": "TechCorp" }`
- **Controller**: `registerCompany` in `company.controller.js`
- **Database Operation**: `Company.create({ name: companyName, userId: req.id })`.

### 2. Get Recruiter Companies
- **Method**: `GET`
- **URL**: `/api/v1/company/get`
- **Auth Required**: Yes (`isAuthenticated`, `authorizeRoles('recruiter')`)
- **Controller**: `getCompany` in `company.controller.js`
- **Database Operation**: `Company.find({ userId: req.id })`.

### 3. Get Company by ID
- **Method**: `GET`
- **URL**: `/api/v1/company/get/:id`
- **Auth Required**: Yes (`isAuthenticated`)
- **Controller**: `getCompanyById` in `company.controller.js`
- **Database Operation**: `Company.findById(req.params.id)`.

### 4. Update Company Details & Logo
- **Method**: `PUT`
- **URL**: `/api/v1/company/update/:id`
- **Auth Required**: Yes (`isAuthenticated`, `authorizeRoles('recruiter')`)
- **Content-Type**: `multipart/form-data`
- **Request Body**: `name`, `description`, `website`, `location`, `file` (logo image)
- **Controller**: `updateCompany` in `company.controller.js`
- **Database Operation**: Uploads logo to Cloudinary, executes `Company.findByIdAndUpdate`.

---

## 3. Job Endpoints (`/api/v1/job`)

### 1. Post New Job
- **Method**: `POST`
- **URL**: `/api/v1/job/post`
- **Auth Required**: Yes (`isAuthenticated`, `authorizeRoles('recruiter', 'coordinator', 'admin')`)
- **Request Body**: `{ "title": "...", "description": "...", "requirments": "...", "salary": 12, "location": "...", "jobtype": "...", "experience": "...", "position": 2, "companyId": "..." }`
- **Controller**: `postJob` in `job.controller.js`
- **Database Operation**: `JOB.create(...)`.

### 2. Get All Filtered Jobs (Candidates)
- **Method**: `GET`
- **URL**: `/api/v1/job/get?keyword=...&location=...&jobtype=...&minSalary=...&maxSalary=...`
- **Auth Required**: No
- **Controller**: `getAllJobs` in `job.controller.js`
- **Database Operation**: Constructs regex query on title/description/requirements, salary range filters, populates company.

### 3. Get Admin Jobs
- **Method**: `GET`
- **URL**: `/api/v1/job/getadminjob`
- **Auth Required**: Yes (`isAuthenticated`, `authorizeRoles('recruiter', 'coordinator', 'admin')`)
- **Controller**: `getAdminJobs` in `job.controller.js`
- **Database Operation**: `JOB.find(query).populate("company")`.

### 4. Get Job by ID
- **Method**: `GET`
- **URL**: `/api/v1/job/get/:id`
- **Auth Required**: Yes (`isAuthenticated`)
- **Controller**: `getJobById` in `job.controller.js`
- **Database Operation**: `JOB.findById(id).populate("applications")`.

### 5. Bookmark / Save Job
- **Method**: `POST`
- **URL**: `/api/v1/job/bookmark/:id`
- **Auth Required**: Yes (`isAuthenticated`, `authorizeRoles('candidate', 'student', 'employee')`)
- **Controller**: `bookmarkJob` in `job.controller.js`
- **Database Operation**: Toggles job ID inside `user.savedJobs` array and calls `user.save()`.

### 6. Get Saved Jobs
- **Method**: `GET`
- **URL**: `/api/v1/job/saved`
- **Auth Required**: Yes (`isAuthenticated`, `authorizeRoles('candidate', 'student', 'employee')`)
- **Controller**: `getSavedJobs` in `job.controller.js`
- **Database Operation**: `User.findById(userId).populate({ path: 'savedJobs', populate: { path: 'company' } })`.

---

## 4. Application Endpoints (`/api/v1/application`)

### 1. Apply For Job
- **Method**: `POST`
- **URL**: `/api/v1/application/apply/:id`
- **Auth Required**: Yes (`isAuthenticated`, `authorizeRoles('candidate', 'student', 'employee')`)
- **Controller**: `applyJob` in `application.controller.js`
- **Database Operation**: `Application.create(...)`, updates `job.applications`, dispatches Socket notification to job creator.

### 2. Get Applied Jobs
- **Method**: `GET`
- **URL**: `/api/v1/application/get`
- **Auth Required**: Yes (`isAuthenticated`, `authorizeRoles('candidate', 'student', 'employee')`)
- **Controller**: `getAppliedJobs` in `application.controller.js`
- **Database Operation**: `Application.find({ applicant: userId }).populate({ path: 'job', populate: { path: 'company' } })`.

### 3. Get Application Applicants (Recruiter View)
- **Method**: `GET`
- **URL**: `/api/v1/application/:id/applicants`
- **Auth Required**: Yes (`isAuthenticated`, `authorizeRoles('coordinator', 'recruiter', 'admin')`)
- **Controller**: `getApplicants` in `application.controller.js`
- **Database Operation**: Direct query on `Application.find({ job: jobId })` populated with applicant profile & resume.

### 4. Update Application Status
- **Method**: `POST` / `PUT`
- **URL**: `/api/v1/application/status/:id/update`
- **Auth Required**: Yes (`isAuthenticated`, `authorizeRoles('coordinator', 'recruiter', 'admin')`)
- **Request Body**: `{ "status": "shortlisted" }`
- **Controller**: `updateStatus` in `application.controller.js`
- **Database Operation**: Updates `status`, pushes into `statusHistory`, saves to DB, dispatches real-time Socket notification to candidate.

### 5. Get Recruiter Dashboard Stats
- **Method**: `GET`
- **URL**: `/api/v1/application/stats`
- **Auth Required**: Yes (`isAuthenticated`, `authorizeRoles('coordinator', 'recruiter', 'admin')`)
- **Controller**: `getRecruiterStats` in `application.controller.js`
- **Database Operation**: Calculates total jobs, total applications, and stage counts breakdown.

---

## 5. Notification Endpoints (`/api/v1/notification`)

### 1. Get User Notifications
- **Method**: `GET`
- **URL**: `/api/v1/notification/get`
- **Auth Required**: Yes (`isAuthenticated`)
- **Controller**: `getNotifications` in `notification.controller.js`
- **Database Operation**: `Notification.find({ user: userId }).sort({ createdAt: -1 }).limit(50)`.

### 2. Mark Notifications As Read
- **Method**: `POST`
- **URL**: `/api/v1/notification/read`
- **Auth Required**: Yes (`isAuthenticated`)
- **Controller**: `markNotificationsAsRead` in `notification.controller.js`
- **Database Operation**: `Notification.updateMany({ user: userId, isRead: false }, { $set: { isRead: true } })`.

### 3. Clear Notifications
- **Method**: `DELETE`
- **URL**: `/api/v1/notification/clear`
- **Auth Required**: Yes (`isAuthenticated`)
- **Controller**: `clearNotifications` in `notification.controller.js`
- **Database Operation**: `Notification.deleteMany({ user: userId })`.
