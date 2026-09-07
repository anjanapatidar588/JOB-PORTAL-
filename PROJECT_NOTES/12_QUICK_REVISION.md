# 12 — QUICK REVISION CHEAT SHEET

---

## 1. Project At-A-Glance Metric Sheet

- **Project Name**: HireFlow (Job Portal)
- **Frontend Stack**: React 18, Vite, Redux Toolkit, `redux-persist`, React Router DOM v6, Tailwind CSS, Lucide Icons, Sonner, Socket.io-client.
- **Backend Stack**: Node.js, Express.js v5, Mongoose v9, JWT, Bcryptjs, Multer, DataURI, Cloudinary SDK v2, Socket.io.
- **Database Collections**: `users`, `companies`, `jobs`, `applications`, `notifications`.
- **Authentication**: JWT stored in HTTP-Only Lax Cookies (`token`).
- **Authorization**: Custom `authorizeRoles` middleware with normalized roles (`candidate`, `recruiter`, `admin`, `coordinator`).
- **Real-Time Push**: Socket.io WebSocket connections mapped by `userId`.
- **File Storage**: Cloudinary (Memory storage buffer $\rightarrow$ DataURI $\rightarrow$ Cloudinary HTTPS URL).

---

## 2. Important Folder Locations Cheat Sheet

- Frontend Router: `frontend/src/App.jsx`
- Frontend Redux Store: `frontend/src/redux/store.js`
- API Endpoints Config: `frontend/src/utils/constant.js`
- Custom Socket Hook: `frontend/src/hooks/useSocket.js`
- Backend Server Entry: `Backend/server.js`
- Auth Middleware: `Backend/middlewares/isAuthenticated.js`
- Role Guard Middleware: `Backend/middlewares/authorizeRoles.js`
- Socket Helper: `Backend/utils/socket.js`
- Skill Matcher Utility: `Backend/utils/skillMatcher.js` & `frontend/src/utils/skillMatcher.js`

---

## 3. Top 5 Concepts to Recite in Interview

1. **Decoupled Architecture**: Frontend and Backend run independently and communicate via HTTP REST endpoints and Socket.io WebSockets.
2. **Security First**: Passwords are hashed using Bcrypt (10 salt rounds). Sessions use JWTs stored in HTTP-Only cookies to eliminate XSS token theft risks.
3. **Applicant Journey Tracker**: Applications transition across 6 visual lifecycle stages (`applied` $\rightarrow$ `application viewed` $\rightarrow$ `shortlisted` $\rightarrow$ `interview scheduled` $\rightarrow$ `interview completed` $\rightarrow$ `selected`/`rejected`), tracking timestamped history in MongoDB.
4. **Real-time Push Notifications**: Instant Socket.io notifications dispatch whenever a candidate applies or a recruiter updates an application stage.
5. **AI Skill Compatibility Calculator**: Analyzes candidate skill sets against job requirements string using TF-IDF synonym matching and returns a percentage fit score.
