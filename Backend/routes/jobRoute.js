import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import authorizeRoles from '../middlewares/authorizeRoles.js';
import { bookmarkJob, getAdminJobs, getAllJobs, getJobById, getSavedJobs, postJob } from '../controllers/job.controller.js';

const router = express.Router();

router.post('/post', isAuthenticated, authorizeRoles('recruiter', 'coordinator', 'admin'), postJob);
router.get('/get', getAllJobs);
router.get('/getadminjob', isAuthenticated, authorizeRoles('recruiter', 'coordinator', 'admin'), getAdminJobs);
router.get('/saved', isAuthenticated, authorizeRoles('candidate', 'student', 'employee'), getSavedJobs);
router.get('/get/:id', isAuthenticated, getJobById);
router.post('/bookmark/:id', isAuthenticated, authorizeRoles('candidate', 'student', 'employee'), bookmarkJob);

export default router;