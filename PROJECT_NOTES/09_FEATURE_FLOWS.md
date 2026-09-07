# 09 — END-TO-END FEATURE WORKFLOWS & DATA FLOW TRACES

---

## Workflow 1: Candidate Registration & Profile Setup

```
[ User UI: Signup Page ]
         |
         |---> Fills Name, Email, Phone, Password, Selects 'Candidate', Uploads Avatar Image
         |
[ Axios POST multipart/form-data ] ---> /api/v1/user/register
                                                |
                                    [ Multer Memory Storage ]
                                                |
                                    [ DataURI Parser ]
                                                |
                                    [ Cloudinary Upload ] (Returns secure_url)
                                                |
                                    [ Bcrypt Salt & Hash ] (10 rounds)
                                                |
                                    [ Mongoose User.create() ]
                                                |
                                    [ MongoDB Insert ]
                                                |
[ Success Toast ] <--- HTTP 201 Response <-------|
```

---

## Workflow 2: Job Application & Real-Time Notification Trigger

```
[ Candidate UI: JobDescription.jsx ]
         |
         |---> Clicks "Apply Now" button
         |
[ Axios POST ] ---> /api/v1/application/apply/:jobId
                            |
               [ isAuthenticated ] (Validates JWT cookie)
                            |
               [ authorizeRoles ] (Verifies role = candidate/student)
                            |
               [ application.controller -> applyJob ]
                            |
               1. Checks existing application (Application.findOne)
               2. Application.create({ job: jobId, applicant: userId, status: 'applied', statusHistory: [{ status: 'applied', updatedAt: now }] })
               3. Pushes application ID to job.applications array
               4. Calls createAndSendNotification(job.created_by, notificationObj)
                       |
                       |---> 4a. Persists Notification document in MongoDB
                       |---> 4b. Checks userSocketMap[recruiterId]
                       |---> 4c. Socket.io emits 'notification:get'
                       |
[ Recruiter UI Browser ] <--- WebSocket pushes notification
     |
     |---> Toast appears instantly: "A new candidate applied for your job..."
     |---> Notification bell badge increments unread count!
```

---

## Workflow 3: Recruiter Pipeline Status Update

```
[ Recruiter UI: ApplicantsTable.jsx ]
         |
         |---> Selects new status from dropdown (e.g. "Shortlisted")
         |
[ Axios POST ] ---> /api/v1/application/status/:appId/update
                            |
               [ isAuthenticated ] & [ authorizeRoles('recruiter') ]
                            |
               [ application.controller -> updateStatus ]
                            |
               1. Finds Application document
               2. Sets application.status = 'shortlisted'
               3. Appends timestamped record to statusHistory array:
                  statusHistory.push({ status: 'shortlisted', updatedAt: new Date() })
               4. Saves to MongoDB: await application.save()
               5. Calls createAndSendNotification(applicantId, { type: 'STATUS_UPDATE', message: 'Your application has been shortlisted.' })
                       |
                       |---> 5a. Persists Notification in DB
                       |---> 5b. Emits WebSocket 'notification:get' to Candidate
                       |
[ Candidate UI Browser ] <--- Real-time notification received!
     |
     |---> Pipeline Stepper updates to "Shortlisted" on Candidate Profile Application Tracker timeline!
```

---

## Workflow 4: Candidate Search & Multi-Filter Query Flow

```
[ Candidate UI: FilterCard.jsx / Jobs.jsx ]
         |
         |---> User checks "Frontend Developer", selects "Bangalore", sets Min Salary "10 LPA"
         |
[ Redux Action ] ---> dispatch(setFilterParams({ keyword: "Frontend", location: "Bangalore", minSalary: "10" }))
                            |
[ Custom Hook: useGetAllJobs ] ---> Triggers on filterParams change
                            |
[ Axios GET ] ---> /api/v1/job/get?keyword=Frontend&location=Bangalore&minSalary=10
                            |
               [ job.controller -> getAllJobs ]
                            |
               Constructs Mongoose Query:
               {
                 $or: [
                   { title: /Frontend/i },
                   { description: /Frontend/i },
                   { requirments: /Frontend/i }
                 ],
                 location: /Bangalore/i,
                 salary: { $gte: 10 }
               }
                            |
               MongoDB Executes Query & Populates Company Details
                            |
[ Redux Action ] <--- HTTP 200 OK Response <---|
       |
dispatch(setAllJobs(response.jobs))
       |
[ Jobs.jsx UI Updates ] ---> Renders filtered job cards reactively!
```
