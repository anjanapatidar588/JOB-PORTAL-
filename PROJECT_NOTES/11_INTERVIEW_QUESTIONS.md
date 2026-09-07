# 11 — PROJECT-SPECIFIC INTERVIEW QUESTIONS & MODEL ANSWERS

---

## LEVEL 1 — BASIC QUESTIONS

### Q1: Can you give a 2-minute elevator pitch of your Job Portal project?
- **What interviewer is testing**: Clear communication, project understanding, domain awareness.
- **Simple Answer**: HireFlow is a full-stack MERN applicant tracking system and job marketplace that connects job seekers with recruiters.
- **Detailed Codebase Answer**:
  "HireFlow is a decoupled MERN stack application designed to make job recruitment transparent and efficient. For candidates, it features interactive job filtering, an AI-driven skill compatibility calculator, saved jobs, and a 6-stage application journey timeline. For recruiters, it offers company registration, job posting, applicant management, stage status updates, and dashboard analytics. It uses React 18, Redux Toolkit with `redux-persist`, Node.js, Express 5, Mongoose, and Socket.io for real-time notifications."

---

### Q2: How is state managed in your React application?
- **What interviewer is testing**: Redux state vs local state, state persistence knowledge.
- **Detailed Codebase Answer**:
  "I use Redux Toolkit (`@reduxjs/toolkit`) for global state management split into 5 feature slices: `authSlice`, `jobSlice`, `companySlice`, `applicationSlice`, and `notificationSlice`. To ensure global user state persists across page refreshes, I integrated `redux-persist`, which synchronizes state with browser `localStorage`. Local UI states, such as form inputs and modal visibility, are managed locally via React's `useState` hook."

---

### Q3: How do you store user passwords securely in MongoDB?
- **What interviewer is testing**: Security best practices, password hashing concepts.
- **Detailed Codebase Answer**:
  "I never store plain text passwords in MongoDB. In `user.controller.js`, during registration, the raw password string is hashed using `bcrypt.hash(password, 10)` with a salt factor of 10 rounds. During login, `bcrypt.compare()` compares the incoming plain text password against the hashed string stored in MongoDB without ever decrypting it."

---

## LEVEL 2 — INTERMEDIATE QUESTIONS

### Q4: How is authentication implemented in your project? Why choose HTTP-only cookies over localStorage for JWTs?
- **What interviewer is testing**: Authentication protocols, security against XSS attacks.
- **Detailed Codebase Answer**:
  "I implemented a stateless JWT authentication system using HTTP-only cookies. When a user logs in, `user.controller.js` generates a JWT token signed with a secret key containing `userId`. The server attaches this token in an HTTP response cookie configured with `httpOnly: true`, `sameSite: 'lax'`, and `maxAge: 1 day`. Storing tokens in HTTP-only cookies prevents client-side JavaScript (`document.cookie`) from accessing the token, completely shielding the application against Cross-Site Scripting (XSS) token theft."

---

### Q5: Explain how file uploads (profile avatars, logos, resumes) are handled.
- **What interviewer is testing**: Multipart form data handling, cloud integration.
- **Detailed Codebase Answer**:
  "File uploads are handled using a combination of **Multer**, **DataURI**, and **Cloudinary**.
  1. Frontend submits a `multipart/form-data` request containing the file.
  2. Multer middleware (`multer.memoryStorage()`) intercepts the upload and holds the file buffer in `req.file.buffer`.
  3. Utility `getDataUri(file)` formats the buffer into a Base64 Data URI string.
  4. The controller uploads the data URI to Cloudinary using `cloudinary.uploader.upload()`. For resumes, `resource_type: 'raw'` is specified to preserve PDF formats.
  5. Cloudinary returns a secure HTTPS URL which is saved in MongoDB (`user.profile.resume` or `company.logo`)."

---

### Q6: How does Role-Based Access Control (RBAC) work in your backend and frontend?
- **What interviewer is testing**: Authorization design, middleware chaining, route guards.
- **Detailed Codebase Answer**:
  "On the backend, authorization is enforced by a custom middleware factory called `authorizeRoles(...allowedRoles)`. After `isAuthenticated` verifies the JWT token and attaches `req.user`, `authorizeRoles` checks if `req.user.role` matches the permitted roles (with role aliases like `candidate`/`student` normalized). If unauthorized, it returns HTTP 403 Forbidden. Admin users override checks. On the frontend, `<ProtectedRoute allowedRoles={[...]} />` checks Redux state user role and redirects unauthorized clients."

---

## LEVEL 3 — ADVANCED QUESTIONS

### Q7: How does real-time notification delivery work using Socket.io?
- **What interviewer is testing**: WebSockets, full-duplex client-server state sync.
- **Detailed Codebase Answer**:
  "Real-time notifications are powered by Socket.io. When a user logs in, the custom hook `useSocket.js` initializes a WebSocket connection passing `{ query: { userId: user._id } }`. On the server in `socket.js`, `initSocket` maps `userId` to `socket.id` in a hash map `userSocketMap`. When a recruiter updates an application status, `createAndSendNotification()` performs two actions:
  1. Persists a new notification document into MongoDB.
  2. Checks if the candidate is online in `userSocketMap`. If online, it emits `io.to(socketId).emit('notification:get', data)`.
  The client socket listener dispatches `addNotification` to Redux and triggers a Sonner toast immediately without requiring page refresh or HTTP polling."

---

### Q8: Explain how the job search filter query works in MongoDB via Mongoose.
- **What interviewer is testing**: MongoDB query optimization, regex search, field operators.
- **Detailed Codebase Answer**:
  "In `job.controller.js -> getAllJobs`, I construct a dynamic Mongoose query object based on URL query parameters (`keyword`, `location`, `jobtype`, `minSalary`, `maxSalary`):
  ```javascript
  const query = {};
  if (keyword) {
    const keywordRegex = new RegExp(keyword.trim(), "i");
    query.$or = [
      { title: { $regex: keywordRegex } },
      { description: { $regex: keywordRegex } },
      { requirments: { $regex: keywordRegex } }
    ];
  }
  if (location) query.location = { $regex: new RegExp(location.trim(), "i") };
  if (jobtype) query.jobtype = { $in: types.map(t => new RegExp(t, "i")) };
  if (minSalary || maxSalary) {
    query.salary = {};
    if (minSalary) query.salary.$gte = Number(minSalary);
    if (maxSalary) query.salary.$lte = Number(maxSalary);
  }
  const jobs = await JOB.find(query).populate("company").sort({ createdAt: -1 });
  ```
  This enables multi-attribute case-insensitive search and range filtering efficiently."
