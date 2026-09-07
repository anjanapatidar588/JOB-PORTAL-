# 10 — CRITICAL FILE-BY-FILE LEARNING GUIDE

---

## 1. Backend Core Files

### 1. `Backend/server.js`
- **What is it?**: The master entry point of the Node.js/Express backend.
- **Why does it exist?**: Bootstraps the HTTP server, connects to MongoDB, mounts middlewares, attaches REST routes, and initializes the Socket.io WebSocket server.
- **Imports**: `express`, `cookie-parser`, `cors`, `dotenv`, `http`, `initSocket`, router modules (`userRoute`, `companyRoute`, `jobRoute`, `applicatonRoute`, `notificationRoute`), `connectDB`.
- **Exports**: `app` (default export).
- **Key Lines**:
  - `const server = http.createServer(app);`: Wraps Express inside a native HTTP server required by Socket.io.
  - `initSocket(server);`: Attaches WebSockets to the HTTP server instance.
  - `connectDB();`: Establishes MongoDB database connection upon server startup.

### 2. `Backend/middlewares/isAuthenticated.js`
- **What is it?**: Authentication verification middleware.
- **Why does it exist?**: Protects private backend endpoints by ensuring requests contain a valid signed JWT cookie.
- **Imports**: `jsonwebtoken`, `User` model.
- **Key Function**: `isAuthenticated(req, res, next)`
  - Reads `req.cookies.token`.
  - Verifies token signature with `jwt.verify(token, process.env.SECRET_KEY)`.
  - Attaches `req.id` and `req.user` to the request object for downstream controllers.

### 3. `Backend/middlewares/authorizeRoles.js`
- **What is it?**: Role-based access control (RBAC) middleware factory.
- **Why does it exist?**: Restricts route access to specified user roles (e.g. preventing candidates from posting jobs or accessing recruiter dashboards).
- **Imports**: `User` model.
- **Key Logic**: Normalizes role strings to lowercase. Admin users bypass restrictions. Accepts role parameter lists (e.g. `authorizeRoles('recruiter', 'admin')`).

### 4. `Backend/utils/socket.js`
- **What is it?**: Socket.io real-time server utility module.
- **Why does it exist?**: Manages active client socket connections (`userSocketMap`), emits real-time notifications, and persists notification documents to MongoDB.
- **Key Functions**:
  - `initSocket(server)`: Initializes Socket.io instance with CORS config and maps `userId` to `socket.id`.
  - `createAndSendNotification(receiverId, { message, type, link })`: Persists notification to MongoDB and emits `notification:get` event to online receivers.

### 5. `Backend/utils/skillMatcher.js`
- **What is it?**: Algorithmic skill comparison engine.
- **Why does it exist?**: Calculates compatibility match scores between candidate skills and job requirements.
- **Key Functions**:
  - `normalizeSkill(skill)`: Strips special characters and resolves tech synonyms (e.g., `'reactjs'` $\rightarrow$ `'react'`).
  - `calculateSkillMatch(userSkills, jobRequirements, userBio)`: Matches normalized user skills against job requirement strings, returning compatibility score percentage and lists of matched/missing skills.

---

## 2. Frontend Core Files

### 1. `frontend/src/redux/store.js`
- **What is it?**: Centralized Redux store configuration.
- **Why does it exist?**: Combines feature slices (`auth`, `job`, `company`, `application`, `notification`) and applies `redux-persist` to store state in browser `localStorage`.
- **Imports**: `@reduxjs/toolkit`, `redux-persist`, slice reducers.
- **Exports**: `store` (default), `persistor`.

### 2. `frontend/src/hooks/useSocket.js`
- **What is it?**: Custom React hook for real-time notifications.
- **Why does it exist?**: Connects the React client to the backend Socket.io server upon user login, fetches historical notifications, listens for incoming `notification:get` events, updates Redux, and displays Sonner toast alerts.

### 3. `frontend/src/components/admin/ProtectedRoute.jsx`
- **What is it?**: React Router client-side route protection component.
- **Why does it exist?**: Prevents unauthorized users from navigating to restricted URLs (e.g. redirecting unauthenticated users to `/login` or unauthorized candidates trying to access `/admin/dashboard` back to `/`).

### 4. `frontend/src/components/ApplicationTracker.jsx`
- **What is it?**: Application tracking timeline and modal component.
- **Why does it exist?**: Visualizes candidate status transitions across 6 defined lifecycle stages and displays timestamp history (`statusHistory`).

### 5. `frontend/src/components/SkillMatchCard.jsx`
- **What is it?**: Visual AI compatibility score card.
- **Why does it exist?**: Renders a circular SVG fit score gauge, matched skills badges, missing skills badges, and profile skill update recommendations.
