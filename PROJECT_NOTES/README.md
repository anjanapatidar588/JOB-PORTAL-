# HIREFLOW (JOB PORTAL) — MASTER INTERVIEW & LEARNING DOCUMENTATION

Welcome to the comprehensive, codebase-accurate learning and interview preparation documentation suite for your **HireFlow Job Portal** project.

This documentation is designed to help you deeply understand your codebase so you can confidently present and explain your project in technical software engineering interviews.

---

## 📚 TABLE OF CONTENTS & RECOMMENDED LEARNING ROADMAP

Follow this sequential reading order for maximum conceptual clarity and interview readiness:

1. [00 — Project Overview](file:///c:/Users/admin/OneDrive/Desktop/JOB%20PORTAL/PROJECT_NOTES/00_PROJECT_OVERVIEW.md)
   *Problem solved, target user personas, tech stack rationale, beginner's MERN guide.*
2. [01 — Project Architecture](file:///c:/Users/admin/OneDrive/Desktop/JOB%20PORTAL/PROJECT_NOTES/01_PROJECT_ARCHITECTURE.md)
   *Decoupled client-server design, complete request-response flow, Socket.io push architecture.*
3. [02 — Folder Structure](file:///c:/Users/admin/OneDrive/Desktop/JOB%20PORTAL/PROJECT_NOTES/02_FOLDER_STRUCTURE.md)
   *Exhaustive directory and file walkthrough for both Backend and Frontend.*
4. [03 — Frontend Architecture](file:///c:/Users/admin/OneDrive/Desktop/JOB%20PORTAL/PROJECT_NOTES/03_FRONTEND.md)
   *React 18 setup, Redux store & 5 slices, custom hooks, React Router, components deep-dive.*
5. [04 — Backend Architecture](file:///c:/Users/admin/OneDrive/Desktop/JOB%20PORTAL/PROJECT_NOTES/04_BACKEND.md)
   *Express server setup, routes, controllers, custom middlewares (`isAuthenticated`, `authorizeRoles`, `multer`).*
6. [05 — Database Architecture](file:///c:/Users/admin/OneDrive/Desktop/JOB%20PORTAL/PROJECT_NOTES/05_DATABASE.md)
   *Mongoose schemas (`User`, `Company`, `JOB`, `Application`, `Notification`), relationships, `populate()`, object references.*
7. [06 — Authentication System](file:///c:/Users/admin/OneDrive/Desktop/JOB%20PORTAL/PROJECT_NOTES/06_AUTHENTICATION.md)
   *Stateless Cookie-based JWT authentication, Bcrypt password hashing, session lifecycle.*
8. [07 — Authorization System](file:///c:/Users/admin/OneDrive/Desktop/JOB%20PORTAL/PROJECT_NOTES/07_AUTHORIZATION.md)
   *Role-Based Access Control (RBAC), role normalization (`candidate`, `recruiter`, `admin`), route protection.*
9. [08 — Complete API Reference](file:///c:/Users/admin/OneDrive/Desktop/JOB%20PORTAL/PROJECT_NOTES/08_API_REFERENCE.md)
   *Exhaustive catalogue of all 18+ REST API endpoints with request/response payload examples.*
10. [09 — End-to-End Feature Flows](file:///c:/Users/admin/OneDrive/Desktop/JOB%20PORTAL/PROJECT_NOTES/09_FEATURE_FLOWS.md)
    *ASCII sequence diagrams and step-by-step traces for 4 major end-to-end workflows.*
11. [10 — File-by-File Learning Guide](file:///c:/Users/admin/OneDrive/Desktop/JOB%20PORTAL/PROJECT_NOTES/10_FILE_BY_FILE_EXPLANATION.md)
    *Line-by-line teaching explanations for all critical frontend and backend files.*
12. [11 — Interview Questions & Answers](file:///c:/Users/admin/OneDrive/Desktop/JOB%20PORTAL/PROJECT_NOTES/11_INTERVIEW_QUESTIONS.md)
    *Basic, Intermediate, and Advanced interview questions with project-tailored model answers.*
13. [12 — Quick Revision Cheat Sheet](file:///c:/Users/admin/OneDrive/Desktop/JOB%20PORTAL/PROJECT_NOTES/12_QUICK_REVISION.md)
    *High-yield cheat sheet for 10-minute pre-interview revision.*
14. [13 — Troubleshooting & Debugs](file:///c:/Users/admin/OneDrive/Desktop/JOB%20PORTAL/PROJECT_NOTES/13_TROUBLESHOOTING.md)
    *Common bug fixes: CORS, port mismatch (3000 vs 8000), HTTP-only cookies, Cloudinary raw uploads.*

---

## ⚡ EXECUTIVE SUMMARY FOR INTERVIEWS

- **What the Project Does**: HireFlow is a full-stack applicant tracking system and recruitment marketplace connecting job seekers with recruiters, offering real-time application journey tracking, AI skill compatibility matching, and recruiter analytics.
- **Main Technologies**: React 18, Vite, Redux Toolkit + Persist, Express 5, Node.js, Mongoose 9, MongoDB, Socket.io, JWT, Bcryptjs, Multer, Cloudinary.
- **Main Architecture**: Decoupled Client-Server MERN stack with Cookie-based JWT stateless auth, role-based middleware guards, and full-duplex WebSocket real-time notification push.
- **Most Important Features**:
  1. 6-Stage Visual Journey Pipeline (`applied` $\rightarrow$ `application viewed` $\rightarrow$ `shortlisted` $\rightarrow$ `interview scheduled` $\rightarrow$ `interview completed` $\rightarrow$ `selected`/`rejected`).
  2. Real-Time Socket.io Push Notifications for status updates & candidate submissions.
  3. AI Skill Compatibility Matcher calculating fit score percentages against job requirements.
  4. Advanced Multi-Attribute Job Filter Query (Regex search, location, job type, salary range).
  5. Cloudinary Resume PDF & Company Logo Upload Integration.
- **Most Important Files**:
  - Backend: `server.js`, `user.controller.js`, `application.controller.js`, `isAuthenticated.js`, `authorizeRoles.js`, `socket.js`.
  - Frontend: `App.jsx`, `Navbar.jsx`, `RecruiterDashboard.jsx`, `ApplicantsTable.jsx`, `ApplicationTracker.jsx`, `SkillMatchCard.jsx`, `useSocket.js`, `store.js`.
- **Current Limitations**:
  - `constant.js` defaults API base URL to port `3000`, whereas `server.js` defaults fallback port to `8000` (requires setting `PORT=3000` in `.env`).
- **What You Should Study First**:
  1. Start with [00 — Project Overview](file:///c:/Users/admin/OneDrive/Desktop/JOB%20PORTAL/PROJECT_NOTES/00_PROJECT_OVERVIEW.md) & [01 — Project Architecture](file:///c:/Users/admin/OneDrive/Desktop/JOB%20PORTAL/PROJECT_NOTES/01_PROJECT_ARCHITECTURE.md).
  2. Master the authentication and application status flows in [06 — Authentication](file:///c:/Users/admin/OneDrive/Desktop/JOB%20PORTAL/PROJECT_NOTES/06_AUTHENTICATION.md) & [09 — Feature Flows](file:///c:/Users/admin/OneDrive/Desktop/JOB%20PORTAL/PROJECT_NOTES/09_FEATURE_FLOWS.md).
  3. Practice your answers in [11 — Interview Questions](file:///c:/Users/admin/OneDrive/Desktop/JOB%20PORTAL/PROJECT_NOTES/11_INTERVIEW_QUESTIONS.md).
