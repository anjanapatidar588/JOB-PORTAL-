# 06 — AUTHENTICATION SYSTEM & SESSION FLOW

---

## 1. Authentication Architecture Overview

HireFlow implements a **Cookie-Based Stateless JWT Authentication** system.

```
+-------------------+                      +-------------------+
|  React Client UI  |                      | Express Server API|
+-------------------+                      +-------------------+
          |                                          |
          |--- 1. POST /login { email, password } --->|
          |                                          | Verifies password via bcrypt.compare()
          |                                          | Generates JWT signed token (1 day expiry)
          |<-- 2. HTTP 200 OK + Set-Cookie (token) --| Sets Cookie: token=eyJhbG... (HttpOnly)
          |                                          |
          |                                          |
          |--- 3. GET /profile/update -------------->|
          |    (Cookie automatically attached)       | Middleware `isAuthenticated` verifies token
          |<-- 4. HTTP 200 OK Response --------------| Attaches `req.user` & proceeds to controller
          |                                          |
          |                                          |
          |--- 5. GET /logout ---------------------->|
          |<-- 6. HTTP 200 OK (Set-Cookie token="") -| Clears `token` cookie (maxAge: 0)
```

---

## 2. Step-by-Step Flow Implementations

### 1. User Registration Flow (`user.controller.js -> register`)
1. Frontend sends POST request to `/api/v1/user/register` as `multipart/form-data`.
2. Controller parses `fullname`, `email`, `phoneNumber`, `password`, `role`.
3. Validates required fields and validates `role` against `['candidate', 'employee', 'coordinator', 'recruiter', 'admin', 'student']`.
4. Checks if user already exists (`User.findOne({ email })`).
5. Hashes plain text password:
   `const hashedPassword = await bcrypt.hash(password, 10);`
6. If an avatar file is attached in `req.file`, parses via `getDataUri(file)` and uploads to Cloudinary.
7. Saves user document to MongoDB with `role` and `profile.profilePhoto`.

### 2. User Login Flow (`user.controller.js -> login`)
1. Frontend sends POST request to `/api/v1/user/login` with JSON payload `{ email, password, role }`.
2. Controller finds user by email: `User.findOne({ email })`.
3. Compares incoming password with hashed password stored in database:
   `const isPasswordMatch = await bcrypt.compare(password, user.password);`
4. Role validation: Compares requested `role` against user's actual database `role` (allowing candidate/student alias matching).
5. Generates JWT token signed with `SECRET_KEY`:
   ```javascript
   const token = jwt.sign(
     { userId: user._id },
     process.env.SECRET_KEY,
     { expiresIn: "1d" }
   );
   ```
6. Sends HTTP response setting `token` cookie:
   ```javascript
   res.status(200).cookie("token", token, {
     maxAge: 24 * 60 * 60 * 1000, // 1 day
     httpOnly: true,
     sameSite: "lax",
     secure: false
   }).json({ message: `Welcome back ${user.fullname}`, user, success: true });
   ```

### 3. Authenticated Request Flow (`middlewares/isAuthenticated.js`)
1. Intercepts incoming requests on protected endpoints.
2. Extracts token from `req.cookies.token`.
3. If no token exists, rejects request with HTTP 401: `User not authenticated`.
4. Verifies token using `jwt.verify(token, process.env.SECRET_KEY)`.
5. Attaches `req.id = decode.userId` and fetches user from DB (`User.findById(decode.userId).select("-password")`).
6. Attaches `req.user = user` and calls `next()`.

### 4. Logout Flow (`user.controller.js -> logout`)
1. Frontend calls GET `/api/v1/user/logout` with `withCredentials: true`.
2. Server overwrites `token` cookie with an empty string and sets `maxAge: 0`.
3. Redux dispatches `setUser(null)`, clearing client user state.

---

## 3. Key Security Concepts

### A. Password Hashing vs Encryption
- **Encryption**: Two-way cipher (can be decrypted back to plaintext with a key).
- **Hashing**: One-way mathematical transformation (cannot be decrypted back to plaintext). Bcrypt uses salt rounds to generate a unique hash string.

### B. HTTP-Only Cookies
- Setting `httpOnly: true` prevents client-side JavaScript (`document.cookie`) from accessing the JWT token. This completely mitigates Cross-Site Scripting (XSS) token theft attacks compared to storing JWTs in `localStorage`.
