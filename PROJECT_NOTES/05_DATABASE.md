# 05 — DATABASE ARCHITECTURE & MONGOOSE SCHEMAS

---

## 1. Database Collections & Relationships

HireFlow utilizes MongoDB as its NoSQL document store, modeled via Mongoose schemas.

```
                  +-------------------+
                  |     User Schema   |
                  +-------------------+
                  | _id               |
                  | fullname, email   |
                  | role, savedJobs[] |
                  +-------------------+
                    /               \
        1-to-Many  /                 \ 1-to-Many
                  v                   v
      +-------------------+   +-----------------------+
      |  Company Schema   |   |  Notification Schema  |
      +-------------------+   +-----------------------+
      | _id               |   | _id, user (ref User)  |
      | name, logo        |   | message, type, isRead |
      | userId (ref User) |   +-----------------------+
      +-------------------+
                |
       1-to-Many|
                v
      +-------------------+
      |    JOB Schema     |
      +-------------------+
      | _id, title, salary|
      | company (ref Comp)|
      | created_by        |
      | applications[]    |
      +-------------------+
                |
       1-to-Many|
                v
      +-------------------+
      | Application Model |
      +-------------------+
      | _id               |
      | job (ref JOB)     |
      | applicant(User)   |
      | status, history[] |
      +-------------------+
```

---

## 2. Exhaustive Schema Field Definitions

### 1. `User` Schema (`user.model.js`)
- `fullname` (String, Required)
- `email` (String, Required, Unique)
- `phoneNumber` (Number, Required)
- `password` (String, Required - Bcrypt hashed)
- `role` (String, Enum: `['candidate', 'employee', 'coordinator', 'recruiter', 'admin', 'student']`, Default: `'candidate'`)
- `profile`:
  - `bio` (String)
  - `skills` (Array of Strings `[String]`)
  - `resume` (String - Cloudinary raw file URL)
  - `resumeOriginalName` (String - Original file name)
  - `company` (ObjectId `ref: 'Company'`)
  - `profilePhoto` (String, Default: `""` - Cloudinary avatar URL)
- `savedJobs` (Array of ObjectIds `ref: 'JOB'`)
- `timestamps`: `true` (`createdAt`, `updatedAt`)

### 2. `Company` Schema (`company.model.js`)
- `name` (String, Required, Unique)
- `description` (String)
- `website` (String)
- `location` (String)
- `logo` (String - Cloudinary logo URL)
- `userId` (ObjectId `ref: 'User'`)
- `timestamps`: `true`

### 3. `JOB` Schema (`job.model.js`)
- `title` (String, Required)
- `description` (String, Required)
- `requirments` (String, Required)
- `salary` (Number, Required)
- `experience` (String, Required)
- `location` (String, Required)
- `jobtype` (String, Required)
- `position` (Number, Required)
- `company` (ObjectId `ref: 'Company'`, Required)
- `created_by` (ObjectId `ref: 'User'`, Required)
- `applications` (Array of ObjectIds `ref: 'Application'`)
- `timestamps`: `true`

### 4. `Application` Schema (`application.model.js`)
- `job` (ObjectId `ref: 'JOB'`, Required)
- `applicant` (ObjectId `ref: 'User'`, Required)
- `status` (String, Enum: `['pending', 'applied', 'application viewed', 'shortlisted', 'interview scheduled', 'interviewing', 'interview completed', 'selected', 'accepted', 'rejected']`, Default: `'applied'`)
- `statusHistory`: Sub-document array `[{ status: String, updatedAt: Date }]`
- `timestamps`: `true`

### 5. `Notification` Schema (`notification.model.js`)
- `user` (ObjectId `ref: 'User'`, Required)
- `message` (String, Required)
- `type` (String, Enum: `['NEW_APPLICATION', 'STATUS_UPDATE', 'JOB_ALERT', 'GENERAL']`, Default: `'GENERAL'`)
- `isRead` (Boolean, Default: `false`)
- `link` (String, Default: `""`)
- `timestamps`: `true`

---

## 3. Key Mongoose Concepts Explained

### 1. `ObjectId` & `ref`
- `ObjectId`: A unique 12-byte hexadecimal string generated automatically by MongoDB as `_id`.
- `ref`: Defines a relational pointer in Mongoose schema pointing to another model (e.g. `ref: 'User'`).

### 2. `populate()`
- Mongoose method used to automatically substitute referenced ObjectIds with actual documents from other collections.
- Example from `job.controller.js`:
  ```javascript
  const jobs = await JOB.find(query)
    .populate("company")
    .sort({ createdAt: -1 });
  ```
  Instead of returning just `{ company: "64b1f..." }`, Mongoose joins the company collection and populates `{ company: { _id: "...", name: "Google", logo: "..." } }`.

### 3. Embedded Sub-documents vs Referenced Collections
- **Referenced**: Used for top-level entities (`User`, `Company`, `JOB`, `Application`, `Notification`) linked via ObjectIds.
- **Embedded**: Used for internal structured data attached directly inside parent documents, such as `user.profile` and `application.statusHistory`. Embedded documents save query joins when fetching the parent entity.
