# 13 — TROUBLESHOOTING & DEBUGS BASED ON CODEBASE

---

## 1. CORS & Origin Mismatch Errors

### Problem
Browser console displays: `Access to XMLHttpRequest at 'http://localhost:8000/api/v1/user/login' from origin 'http://localhost:5173' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present`.

### Cause
CORS configuration in `Backend/server.js` does not match the frontend origin URL or does not permit credentials.

### Where to Check
- `Backend/server.js`:
  ```javascript
  const corsOption = {
    origin: "http://localhost:5173",
    credentials: true,
  };
  app.use(cors(corsOption));
  ```
- Ensure `axios` calls on the frontend include `{ withCredentials: true }`.

---

## 2. API Port Mismatch (Port 3000 vs Port 8000)

### Problem
Frontend Axios API calls fail with `ERR_CONNECTION_REFUSED` or HTTP 404 errors.

### Cause
In `frontend/src/utils/constant.js`, endpoint URLs are defined as `http://localhost:3000/api/v1/...`, while `Backend/server.js` defaults to `PORT = process.env.PORT || 8000`.

### Where to Check & Fix
- If running backend without a `.env` file setting `PORT=3000`, the server listens on port `8000`.
- **Fix Options**:
  1. Add `PORT=3000` inside `Backend/.env`.
  2. Or update `frontend/src/utils/constant.js` and `useSocket.js` to point to `http://localhost:8000`.

---

## 3. JWT Cookie Not Being Saved in Browser

### Problem
User logs in successfully, but subsequent protected requests return `401 User not authenticated`.

### Cause
1. Frontend Axios calls missing `withCredentials: true`.
2. Cookie `sameSite` or `secure` flags configured incorrectly for local HTTP development.

### Where to Check & Fix
- In `Backend/controllers/user.controller.js`:
  ```javascript
  res.cookie("token", token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",   // Correct for localhost development
    secure: false,     // Must be false for HTTP localhost
  });
  ```

---

## 4. Cloudinary Resume Upload Failures

### Problem
Uploading avatar photo works fine, but uploading PDF resume fails or produces corrupt files.

### Cause
Cloudinary defaults to treating uploads as images (`resource_type: "image"`). PDF or DOCX files require specifying `resource_type: "raw"`.

### Where to Check
- `Backend/controllers/user.controller.js -> updateProfile`:
  ```javascript
  const cloudResponse = await cloudinary.uploader.upload(
    fileUri.content,
    { resource_type: "raw" }
  );
  ```

---

## 5. Socket.io Connection Failures

### Problem
Browser console shows repeating Socket connection retries or `WebSocket connection to 'ws://localhost:3000/socket.io/' failed`.

### Cause
1. Backend server is not running or running on port 8000 while frontend connects to port 3000.
2. User is not logged in (`user?._id` is undefined), preventing socket initialization in `useSocket.js`.

### Where to Check
- `frontend/src/hooks/useSocket.js`: Ensure backend URL matches `http://localhost:3000` (or `8000`) and server has `initSocket(server)` mounted in `Backend/server.js`.
