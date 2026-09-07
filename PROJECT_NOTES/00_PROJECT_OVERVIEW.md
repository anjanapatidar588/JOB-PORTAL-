# 00 — PROJECT OVERVIEW: HIREFLOW (JOB PORTAL)

---

## 1. Project Information

- **Project Name**: HireFlow / Job Portal
- **Architecture Type**: Decoupled Client-Server Full-Stack Web Application (MERN Stack)
- **Primary Domain**: E-Recruitment, Applicant Tracking System (ATS), and Job Marketplace

---

## 2. Project Purpose & Problem Statement

Finding and applying for jobs can be fragmented, opaque, and inefficient for job seekers. At the same time, recruiters struggle with managing applicant data, updating candidate statuses, and tracking hiring pipelines effectively.

### Problems Solved:
1. **Lack of Status Visibility**: Candidates often apply for jobs and never receive feedback on whether their application was viewed, shortlisted, or rejected. HireFlow solves this with a **6-Stage Visual Journey Pipeline** and real-time status notifications.
2. **Skill Misalignment**: Job seekers waste time applying for jobs without knowing if their profile matches the job requirements. HireFlow includes an **AI Skill Matcher** that compares user skills against job requirement strings and returns a percentage compatibility score.
3. **Manual Applicant Tracking for Recruiters**: Recruiters need a centralized platform to post jobs, manage registered companies, review candidates, track pipeline analytics, and transition applicants through status lifecycle stages.

---

## 3. Target User Personas

The application serves two primary user categories:

### A. Candidate / Job Seeker / Student / Employee
- Can browse and search for published jobs with keyword, location, job type, and salary range filters.
- Can view job details, company details, and run AI skill compatibility analysis against their profile.
- Can apply for open positions (attaching profile bio, skills, and Cloudinary-stored resume PDF).
- Can track application status transitions in real time via a detailed interactive timeline.
- Can save/bookmark jobs for later review.

### B. Recruiter / Coordinator / Admin
- Can register companies (with company name, description, website, location, and Cloudinary logo).
- Can post jobs associated with their registered companies.
- Can view recruiter-specific dashboards with total job counts, total applications, and status distribution metrics.
- Can inspect applicants per job, view candidate resumes, and update applicant stage status (`applied` $\to$ `application viewed` $\to$ `shortlisted` $\to$ `interview scheduled` $\to$ `interview completed` $\to$ `selected` / `rejected`).
- Automatic real-time notifications are dispatched to candidates when their status changes.

---

## 4. Technology Stack Breakdown & Technical Rationale

```
+-----------------------------------------------------------------------+
|                             FRONTEND                                  |
|  React 18  |  Vite  |  Redux Toolkit + Persist  |  Tailwind CSS     |
|  React Router DOM v6  |  Axios  |  Socket.io-Client  |  Sonner Toasts  |
+-----------------------------------------------------------------------+
                                   |
                          HTTP / WebSockets
                                   v
+-----------------------------------------------------------------------+
|                             BACKEND                                   |
|  Node.js  |  Express.js 5  |  JWT (Cookies)  |  Bcryptjs              |
|  Multer + DataURI  |  Cloudinary API  |  Socket.io Server         |
+-----------------------------------------------------------------------+
                                   |
                             Mongoose ODM
                                   v
+-----------------------------------------------------------------------+
|                             DATABASE                                  |
|                            MongoDB                                    |
+-----------------------------------------------------------------------+
```

### Beginners Guide: What is MERN?

- **M (MongoDB)**: A NoSQL database that stores data in flexible, JSON-like documents. Unlike traditional SQL databases with fixed tables and rows, MongoDB stores collections of documents (e.g., `users`, `jobs`, `applications`).
- **E (Express.js)**: A lightweight, fast web application framework for Node.js. It provides routing, request/response handling, and middleware support to construct REST APIs.
- **R (React.js)**: A frontend JavaScript library built by Meta for constructing interactive single-page user interfaces (SPAs) using declarative, reusable components and dynamic state management.
- **N (Node.js)**: A JavaScript runtime environment built on Chrome's V8 engine that allows running JavaScript code on the server side (outside the browser).

---

## 5. Technology Rationale: Why Each Library Was Used

| Technology | Purpose in This Project | Why It Is Used |
| :--- | :--- | :--- |
| **React 18 + Vite** | Single Page Frontend UI | Vite provides near-instant Hot Module Replacement (HMR) and fast build performance compared to legacy CRA (Create React App). |
| **Redux Toolkit (`@reduxjs/toolkit`)** | Global State Management | Centralizes shared application state (user profile, job listings, applied jobs, saved jobs, notifications) so child components don't suffer from prop drilling. |
| **`redux-persist`** | State Persistence | Saves the Redux state (such as logged-in user details) in browser `localStorage` so user session state persists across page refreshes. |
| **React Router DOM v6** | Frontend Routing | Handles client-side navigation between pages (`/`, `/login`, `/jobs`, `/profile`, `/admin/dashboard`) without reloading the entire webpage. |
| **Axios** | HTTP Client | Simplifies sending AJAX requests to the backend server with automatic JSON transformation and support for `withCredentials: true` (cookie transmission). |
| **Socket.io & Socket.io-client** | Real-time Communication | Establishes persistent full-duplex WebSocket connections between server and client for instantaneous real-time notification push (e.g., status updates and new applications). |
| **Express.js v5** | Backend REST API Framework | Manages HTTP routes (`/api/v1/user`, `/api/v1/job`, etc.), executes request pipeline middlewares, and returns JSON formatted responses. |
| **Mongoose v9** | MongoDB ODM (Object Data Modeling) | Enforces schema validation, data types, default values, and relational references (`ref`, `populate()`) over raw MongoDB collections. |
| **JSONWebToken (`jsonwebtoken`)** | Stateless Authentication | Encodes user identity into a signed cryptographic token set inside HTTP-only cookies for tamper-proof session verification. |
| **Bcryptjs** | Password Hashing | Hashes plain text user passwords with a salt factor (10 rounds) before persisting to MongoDB, preventing raw password leaks. |
| **Multer + DataURI** | File Upload Pre-processing | Multer parses `multipart/form-data` uploads into memory buffers (`req.file`), which `datauri` converts into base64 strings ready for Cloudinary upload. |
| **Cloudinary SDK** | Cloud Storage | Stores uploaded profile photos, company logos, and candidate resume raw files in the cloud and returns persistent HTTPS URLs. |

---

## 6. High-Level Architectural Responsibilities

### 1. Frontend Responsibility
- Render responsive, reactive user interfaces using React components.
- Maintain persistent global UI state using Redux Toolkit and `redux-persist`.
- Send asynchronous AJAX requests using Axios to backend endpoints with HTTP cookies.
- Execute client-side route authorization via `ProtectedRoute.jsx`.
- Listen for real-time WebSocket events (`notification:get`) and trigger toast notifications.

### 2. Backend Responsibility
- Expose RESTful API endpoints organized modularly into Express routers (`userRoute`, `companyRoute`, `jobRoute`, `applicationRoute`, `notificationRoute`).
- Parse and validate incoming client payloads (`req.body`, `req.params`, `req.query`, `req.file`).
- Enforce authentication via JWT cookie inspection (`isAuthenticated.js`) and role-based access control (`authorizeRoles.js`).
- Upload incoming media files (resumes, avatars, logos) to Cloudinary.
- Perform MongoDB database CRUD operations using Mongoose models.
- Emit socket events and persist notification documents via `socket.js`.

### 3. Database Responsibility
- Store document collections: `users`, `companies`, `jobs`, `applications`, `notifications`.
- Maintain data integrity through schema rules, default timestamps (`createdAt`, `updatedAt`), unique indexes, and schema enums.
- Process relational document queries through Mongoose ObjectId references (`ref: 'User'`, `ref: 'Company'`, `ref: 'JOB'`).
