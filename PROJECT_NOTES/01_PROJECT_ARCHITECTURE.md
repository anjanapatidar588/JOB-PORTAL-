# 01 — PROJECT ARCHITECTURE & REQUEST-RESPONSE FLOW

---

## 1. System Overview Architecture

HireFlow is constructed using a decoupled client-server architecture. The frontend React application runs independently on the browser and communicates with the Node.js/Express backend via HTTP REST endpoints and WebSocket protocols.

```
+-----------------------------------------------------------------------------------+
|                                  BROWSER (REACT UI)                               |
|                                                                                   |
|  [ React Components ] ---> [ Redux Store ] ---> [ Axios / Socket.io Client ]       |
+-----------------------------------------------------------------------------------+
                                  |                 ^
                   HTTP REST (Cookie)               | WebSocket (notification:get)
                                  v                 |
+-----------------------------------------------------------------------------------+
|                               EXPRESS BACKEND SERVER                              |
|                                                                                   |
|  [ server.js ] ---> [ Routes ] ---> [ Middlewares ] ---> [ Controllers ]          |
|                                                                |                  |
|                                                                v                  |
|                                                       [ Socket.io Server ]        |
+-----------------------------------------------------------------------------------+
                                                                 |
                                                           Mongoose ODM
                                                                 v
+-----------------------------------------------------------------------------------+
|                                 MONGODB DATABASE                                  |
|   Collections: users | companies | jobs | applications | notifications            |
+-----------------------------------------------------------------------------------+
```

---

## 2. Complete End-to-End Request-Response Flow

Below is the step-by-step technical lifecycle for a standard API request in HireFlow (e.g. updating an application status):

### Step 1: User Action in React Component
- A recruiter clicks the "Shortlist" status button inside `ApplicantsTable.jsx`.
- An event handler triggers an asynchronous `axios.post()` call to:
  `http://localhost:3000/api/v1/application/status/:id/update` with body payload `{ status: 'shortlisted' }` and `{ withCredentials: true }`.

### Step 2: HTTP Transport & Cookie Handshake
- The browser attaches the HTTP-only cookie named `token` (containing the encrypted JWT signed during login) to the outgoing HTTP headers.

### Step 3: Express Server Entry & Middleware Pipeline
- The Express app in `server.js` receives the incoming HTTP request.
- Middlewares execute in sequence:
  1. `cors(corsOption)`: Validates that the request origin (`http://localhost:5173`) is permitted and allows credentials.
  2. `express.json()`: Parses incoming JSON payload into `req.body`.
  3. `cookieParser()`: Parses the raw `Cookie` HTTP header into `req.cookies.token`.

### Step 4: Route Matching
- The request URL `/api/v1/application/status/:id/update` matches the mounting prefix `/api/v1/application` in `server.js` and maps to `applicatonRoute.js`.

### Step 5: Middleware Execution

#### A. Authentication (`isAuthenticated.js`)
- Reads `req.cookies.token`.
- Verifies token signature using `jwt.verify(token, process.env.SECRET_KEY)`.
- Extracts `decode.userId` and attaches `req.id = decode.userId`.
- Fetches user document from MongoDB via `User.findById(decode.userId).select("-password")` and attaches `req.user = user`.

#### B. Authorization (`authorizeRoles.js`)
- Executes `authorizeRoles('coordinator', 'recruiter', 'admin')`.
- Checks `req.user.role`. If authorized, calls `next()`. If unauthorized, returns HTTP `403 Forbidden`.

### Step 6: Controller Processing (`application.controller.js -> updateStatus`)
- The controller extracts `applicationId` from `req.params.id` and `status` from `req.body`.
- Finds the application document using `Application.findById(applicationId)`.
- Updates `application.status = 'shortlisted'`.
- Pushes a new stage timestamp object into the history array:
  `application.statusHistory.push({ status: 'shortlisted', updatedAt: new Date() })`.
- Saves changes to MongoDB via `await application.save()`.

### Step 7: Real-Time Notification & Persistence (`socket.js -> createAndSendNotification`)
- The controller invokes `createAndSendNotification(applicantId, notificationObj)`:
  1. Inserts a new notification document into MongoDB `notifications` collection.
  2. Checks `userSocketMap[applicantId]` for an active WebSocket socket ID.
  3. If online, emits `io.to(socketId).emit("notification:get", notificationData)`.

### Step 8: Backend Response & Frontend UI Update
- The controller returns HTTP `200 OK` JSON response:
  ```json
  {
    "message": "Status updated to shortlisted successfully.",
    "success": true,
    "application": { ... }
  }
  ```
- Axios receives the JSON response.
- React triggers a state refresh, updating the UI badge to `Shortlisted` and showing a success toast via `sonner`.
- If online, the candidate's browser receives `notification:get` over WebSocket, dispatches `addNotification` to Redux, and displays a toast notification instantly!

---

## 3. Real-Time Socket.io Architecture

HireFlow incorporates real-time WebSockets alongside REST endpoints to achieve instant notification delivery without client polling.

```
Candidate Logged In                            Backend Socket Server
       |                                                 |
       |----- Connect WebSocket (query: userId) --------->|
       |                                                 | Stores userSocketMap[userId] = socket.id
       |                                                 |
Recruiter Updates Status (REST API)                      |
       |------------------- POST /status/update -------->| Controller calls createAndSendNotification()
                                                         | 1. Persists Notification to MongoDB
                                                         | 2. Looks up userSocketMap[candidateId]
                                                         | 3. Emits 'notification:get'
       |<---- Socket Event ('notification:get') ---------|
       |
Redux State Updated (`addNotification`)
Toast Displayed via Sonner
```
