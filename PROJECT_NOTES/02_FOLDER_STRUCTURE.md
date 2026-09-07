# 02 — DETAILED FOLDER STRUCTURE & DIRECTORY WALKTHROUGH

---

## 1. Top-Level Directory Overview

```
JOB PORTAL/
├── Backend/                 # Express.js REST API & Socket.io Backend Application
├── frontend/                # React 18 + Vite Frontend Application
├── svgs/                    # Project design SVG vector assets
├── README.md                # Project README file
└── PROJECT_NOTES/           # Complete Learning & Interview Preparation Documentation
```

---

## 2. Backend Folder Breakdown (`Backend/`)

```
Backend/
├── controllers/             # Express Request Controllers (Business Logic)
│   ├── application.controller.js  # Apply job, status update, analytics stats, applicant list
│   ├── company.controller.js      # Register company, update info, fetch company by ID
│   ├── job.controller.js          # Post job, fetch all jobs with filters, bookmark jobs
│   ├── notification.controller.js # Fetch notifications, mark read, clear notifications
│   └── user.controller.js         # Register, login, logout, profile update (resume/photo)
├── middlewares/             # Custom Express Request Middlewares
│   ├── authorizeRoles.js    # Role-Based Access Control (RBAC) middleware
│   ├── isAuthenticated.js   # JWT Cookie verification middleware
│   └── multer.js            # Multipart file upload storage config (MemoryStorage)
├── models/                  # Mongoose Database Schemas & ODM Models
│   ├── application.model.js # Application schema & statusHistory sub-schema
│   ├── company.model.js     # Company schema (name, logo, website, location)
│   ├── job.model.js         # Job schema (title, salary, requirements, experience, positions)
│   ├── notification.model.js# Notification schema (message, type, link, isRead)
│   └── user.model.js        # User schema (fullname, email, password, role, profile, savedJobs)
├── routes/                  # Express Router Endpoints
│   ├── applicatonRoute.js   # /api/v1/application endpoints
│   ├── companyRoute.js      # /api/v1/company endpoints
│   ├── jobRoute.js          # /api/v1/job endpoints
│   ├── notificationRoute.js # /api/v1/notification endpoints
│   └── userRoute.js         # /api/v1/user endpoints
├── utils/                   # Server Helper Utilities & External Services Integrations
│   ├── cloudinary.js        # Cloudinary SDK v2 config setup
│   ├── datauri.js           # DataURI parser helper (Buffer -> Base64 DataURI)
│   ├── db.js                # MongoDB connection helper via Mongoose
│   ├── skillMatcher.js      # Server-side TF-IDF / Synonym skill compatibility analyzer
│   └── socket.js            # Socket.io instance initialization & notification emission
├── .env                     # Server environment variables (MONGO_URI, SECRET_KEY, CLOUDINARY_*)
├── package.json             # Node dependencies and npm dev script definition
└── server.js                # Server entry point (HTTP server, Socket.io, middleware, routes)
```

---

## 3. Frontend Folder Breakdown (`frontend/`)

```
frontend/
├── public/                  # Static assets (favicons, static images)
├── src/                     # React source code root
│   ├── assets/              # Component images & brand assets (hireflow-logo.png)
│   ├── components/          # React Components organized by domain
│   │   ├── admin/           # Recruiter & Admin management components
│   │   │   ├── AdminJobs.jsx        # Table of recruiter posted jobs
│   │   │   ├── AdminJobsTable.jsx   # Data table with actions for posted jobs
│   │   │   ├── Applicants.jsx       # Applicants page wrapper for a job
│   │   │   ├── ApplicantsTable.jsx  # Detailed applicant management & status dropdowns
│   │   │   ├── Companies.jsx        # Company list view for recruiters
│   │   │   ├── CompaniesTable.jsx   # Table listing recruiter companies
│   │   │   ├── CompanyCreate.jsx    # Register new company form
│   │   │   ├── CompanySetup.jsx     # Edit company details & logo upload
│   │   │   ├── PostJob.jsx          # Post new job form
│   │   │   ├── ProtectedRoute.jsx   # Client-side role route guard
│   │   │   └── RecruiterDashboard.jsx # Recruiter analytics stats dashboard
│   │   ├── auth/            # Authentication UI components
│   │   │   ├── Login.jsx            # Login form page
│   │   │   └── Signup.jsx           # Signup form page with avatar file upload
│   │   ├── shared/          # Shared layout components across pages
│   │   │   ├── Footer.jsx           # Footer layout component
│   │   │   └── Navbar.jsx           # Top navbar with Socket notifications & User popover
│   │   ├── ui/              # Reusable Radix / Shadcn UI components
│   │   │   ├── avatar.jsx, badge.jsx, button.jsx, dialog.jsx, input.jsx,
│   │   │   ├── label.jsx, popover.jsx, select.jsx, sonner.jsx, table.jsx
│   │   ├── ApplicationTracker.jsx # 6-Stage visual timeline & modal tracker
│   │   ├── AppliedJobTable.jsx    # Table of jobs candidate applied for
│   │   ├── Browse.jsx             # Search results page for browsed jobs
│   │   ├── CategoryCarousal.jsx   # Job category carousel on homepage
│   │   ├── FilterCard.jsx         # Sidebar filter card (location, jobtype, salary range)
│   │   ├── HeroSection.jsx        # Homepage hero section with search bar
│   │   ├── Home.jsx               # Home page view wrapper
│   │   ├── Job.jsx                # Single job preview card component
│   │   ├── JobDescription.jsx     # Full job details view page with skill matcher
│   │   ├── Jobs.jsx               # Main jobs search & listing page
│   │   ├── LatestJobCards.jsx     # Homepage job recommendation card
│   │   ├── LatestJobs.jsx         # Homepage latest jobs list wrapper
│   │   ├── Profile.jsx            # User candidate profile page (resume link, skills)
│   │   ├── SavedJobs.jsx          # Bookmarked jobs page
│   │   ├── SkillMatchCard.jsx     # AI Skill compatibility match card component
│   │   └── UpdateProfileDialog.jsx# Modal dialog for updating profile, skills & resume PDF
│   ├── hooks/               # Custom React Hooks
│   │   ├── getSingleJob.jsx       # Fetch job by ID hook
│   │   ├── useGetAllAdminJob.jsx  # Fetch jobs created by recruiter hook
│   │   ├── useGetAllCompanies.jsx # Fetch recruiter companies hook
│   │   ├── useGetAllJobs.jsx      # Fetch filtered student jobs hook
│   │   ├── useGetAppliedJobs.jsx  # Fetch candidate applied jobs hook
│   │   ├── useGetCompanyById.jsx  # Fetch company details by ID hook
│   │   └── useSocket.js           # Socket.io connection & notification listener hook
│   ├── lib/                 # Utility helpers (cn class merge helper)
│   ├── redux/               # Redux Toolkit store & slice state reducers
│   │   ├── applicationSlice.js    # Applied jobs state slice
│   │   ├── authSlice.js           # Auth user state slice
│   │   ├── companySlice.js        # Company management state slice
│   │   ├── jobSlice.js            # Jobs list, single job, filter params state slice
│   │   ├── notificationSlice.js   # Notification unread counts & notification list slice
│   │   └── store.js               # Redux store config with `redux-persist`
│   ├── utils/               # Client constants & utility functions
│   │   ├── constant.js            # API base endpoint URLs
│   │   └── skillMatcher.js        # Client-side AI Skill Match calculation logic
│   ├── App.css / index.css  # Global styles & Tailwind CSS configuration
│   ├── App.jsx              # Main React Router router configuration (`createBrowserRouter`)
│   └── main.jsx             # React DOM root render entry point with Redux Provider
├── components.json          # Shadcn UI configuration file
├── index.html               # Main HTML document template
├── package.json             # Frontend npm package dependencies & scripts
├── tailwind.config.js       # Tailwind CSS design token setup
└── vite.config.js           # Vite development server & path alias (`@`) config
```
