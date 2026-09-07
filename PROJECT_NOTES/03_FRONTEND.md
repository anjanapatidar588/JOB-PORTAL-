# 03 — FRONTEND ARCHITECTURE & REACT COMPONENT DEEP DIVE

---

## 1. Frontend Entry Point & Application Setup

### `main.jsx`
- Initializes the React root element using `createRoot(document.getElementById('root'))`.
- Wraps the application inside `StrictMode` for early warning detection.
- Wraps the app in `<Provider store={store}>` to provide Redux state across all component trees.
- Wraps the app in `<PersistGate loading={null} persistor={persistor}>` to delay rendering until persisted state in `localStorage` has been rehydrated.
- Renders `<Toaster />` from Sonner for toast alert popups.

### `App.jsx`
- Defines client-side routes using `createBrowserRouter`:
  - `/` $\rightarrow$ `<Home />` (Public homepage)
  - `/login` $\rightarrow$ `<Login />`
  - `/signup` $\rightarrow$ `<Signup />`
  - `/jobs` $\rightarrow$ `<Jobs />` (Candidate job search page)
  - `/saved-jobs` $\rightarrow$ `<ProtectedRoute allowedRoles={['candidate', 'student']}><SavedJobs /></ProtectedRoute>`
  - `/description/:id` $\rightarrow$ `<JobDescription />`
  - `/browse` $\rightarrow$ `<Browse />`
  - `/profile` $\rightarrow$ `<ProtectedRoute allowedRoles={['candidate', 'student', 'recruiter']}><Profile /></ProtectedRoute>`
  - `/admin/dashboard` $\rightarrow$ `<ProtectedRoute allowedRoles={['recruiter']}><RecruiterDashboard /></ProtectedRoute>`
  - `/admin/companies` $\rightarrow$ `<ProtectedRoute allowedRoles={['recruiter']}><Companies /></ProtectedRoute>`
  - `/admin/companies/create` $\rightarrow$ `<ProtectedRoute allowedRoles={['recruiter']}><CompanyCreate /></ProtectedRoute>`
  - `/admin/companies/:id` $\rightarrow$ `<ProtectedRoute allowedRoles={['recruiter']}><CompanySetup /></ProtectedRoute>`
  - `/admin/jobs` $\rightarrow$ `<ProtectedRoute allowedRoles={['recruiter']}><AdminJobs /></ProtectedRoute>`
  - `/admin/jobs/create` $\rightarrow$ `<ProtectedRoute allowedRoles={['recruiter']}><PostJob /></ProtectedRoute>`
  - `/admin/jobs/:id/applicants` $\rightarrow$ `<ProtectedRoute allowedRoles={['recruiter']}><Applicants /></ProtectedRoute>`

---

## 2. Redux State Management Architecture

The project uses Redux Toolkit (`@reduxjs/toolkit`) with 5 feature slices.

```
                                  +-------------------+
                                  |    Redux Store    |
                                  +-------------------+
                                            |
         +------------------+---------------+---------------+------------------+
         |                  |               |               |                  |
         v                  v               v               v                  v
    [authSlice]        [jobSlice]    [companySlice] [applicationSlice] [notificationSlice]
    - user             - allJobs     - companies    - applicants       - notifications
    - loading          - singleJob   - singleCompany                   - unreadCount
                       - filters
                       - savedJobs
```

### 1. `authSlice.js`
- **State**: `{ loading: false, user: null }`
- **Actions**: `setLoading(boolean)`, `setUser(userObj)`

### 2. `jobSlice.js`
- **State**:
  - `allJobs`: Array of all available job listings.
  - `allAdminJobs`: Array of recruiter-posted jobs.
  - `singleJob`: Currently viewed job object.
  - `allAppliedJobs`: Candidate's applied applications array.
  - `allSavedJobs`: Bookmarked jobs array.
  - `filterParams`: `{ keyword: "", location: "", jobtype: "", minSalary: "", maxSalary: "" }`
- **Actions**: `setAllJobs`, `setSingleJobs`, `setAllAdminJobs`, `setFilterParams`, `clearFilterParams`, `setAllSavedJobs`, `setAllAppliedJobs`.

### 3. `companySlice.js`
- **State**: `{ companies: [], singleCompany: null, searchCompanyByText: "" }`
- **Actions**: `setCompanies`, `setSingleCompany`, `setSearchCompanyByText`.

### 4. `applicationSlice.js`
- **State**: `{ applicants: null }`
- **Actions**: `setAllApplicants`.

### 5. `notificationSlice.js`
- **State**: `{ notifications: [], unreadCount: 0 }`
- **Actions**: `setNotifications`, `addNotification`, `markAllAsRead`, `clearNotifications`.

---

## 3. Custom React Hooks Explained

| Custom Hook | File | Purpose |
| :--- | :--- | :--- |
| `useSocket()` | `src/hooks/useSocket.js` | Fetches persistent notifications from `/api/v1/notification/get`, connects Socket.io client to backend, listens for `notification:get` events, updates Redux, and displays toasts. |
| `useGetAllJobs()` | `src/hooks/useGetAllJobs.jsx` | Subscribes to `filterParams` in Redux and automatically fetches filtered jobs from GET `/api/v1/job/get` using query params. |
| `useGetAppliedJobs()` | `src/hooks/useGetAppliedJobs.jsx` | Fetches applied jobs for the candidate from GET `/api/v1/application/get` and dispatches `setAllAppliedJobs`. |
| `useGetAllAdminJob()` | `src/hooks/useGetAllAdminJob.jsx` | Fetches recruiter's posted jobs from GET `/api/v1/job/getadminjob` and updates `allAdminJobs`. |
| `useGetAllCompanies()` | `src/hooks/useGetAllCompanies.jsx` | Fetches recruiter's registered companies from GET `/api/v1/company/get`. |
| `useGetCompanyById()` | `src/hooks/useGetCompanyById.jsx` | Fetches company details by ID from GET `/api/v1/company/get/:id`. |
| `getSingleJob()` | `src/hooks/getSingleJob.jsx` | Fetches job details by ID from GET `/api/v1/job/get/:id`. |

---

## 4. Key Component Deep Dive

### 1. `Navbar.jsx` (`components/shared/Navbar.jsx`)
- **Purpose**: Global sticky navigation header.
- **Features**:
  - Dynamically renders links based on user role (`isRecruiter = user?.role === 'recruiter'`).
  - Displays Real-Time Notification Bell icon with active unread count badge.
  - Clicking the Notification Bell opens a Popover listing incoming notifications with interactive direct links (e.g. `/admin/jobs/:id/applicants`).
  - Contains User Avatar Popover with Profile, Saved Jobs, Recruiter Dashboard links, and Logout button.

### 2. `SkillMatchCard.jsx` (`components/SkillMatchCard.jsx`)
- **Purpose**: Displays an AI-driven skill compatibility match score for candidates viewing a job.
- **Props**: `{ user, job }`
- **Internal Calculations**: Executes `calculateSkillMatch(user?.profile?.skills, job?.requirments, user?.profile?.bio)`.
- **UI Elements**:
  - SVG Circular progress ring showing compatibility percentage (e.g. `85% Match`).
  - Matched skills badges (emerald).
  - Missing/recommended skills badges (amber/rose).
  - AI recommendation banner with an "Update Skills" button pointing to `/profile`.

### 3. `ApplicationTracker.jsx` (`components/ApplicationTracker.jsx`)
- **Purpose**: Visualizes application progress through a 6-Stage journey pipeline.
- **Stages**:
  1. `applied` (Application submitted)
  2. `application viewed` (Recruiter reviewed profile)
  3. `shortlisted` (Selected for interview)
  4. `interview scheduled` (Interview arranged)
  5. `interview completed` (Interview finished)
  6. `outcome` (`selected` or `rejected`)
- **Components**:
  - `CompactPipelineStepper`: Inline mini stepper for row view inside `AppliedJobTable`.
  - `DetailedTimeline`: Full vertical progress timeline showing timestamp history (`statusHistory`).
  - `ApplicationTrackerModal`: Modal wrapper opening timeline details on click.

### 4. `RecruiterDashboard.jsx` (`components/admin/RecruiterDashboard.jsx`)
- **Purpose**: Recruiter control center with analytics.
- **Features**:
  - Invokes GET `/api/v1/application/stats` on mount.
  - Renders metric cards: Total Posted Jobs, Total Applications, Shortlisted Applicants, Interviews Scheduled, Selected/Hired, Rejected.
  - Displays Quick Action navigation buttons and recent candidate submissions table.

### 5. `ApplicantsTable.jsx` (`components/admin/ApplicantsTable.jsx`)
- **Purpose**: Recruiter applicant review and pipeline status management table.
- **Features**:
  - Displays applicant name, email, contact, bio, skill compatibility score against job, and Cloudinary resume link.
  - Includes a status change dropdown offering 8 stage choices: `Applied`, `Application Viewed`, `Shortlisted`, `Interview Scheduled`, `Interview Completed`, `Selected`, `Accepted`, `Rejected`.
  - Selecting a stage triggers POST `/api/v1/application/status/:id/update`, sending an instant real-time notification to the candidate.
