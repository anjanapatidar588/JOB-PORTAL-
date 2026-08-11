import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import authorizeRoles from '../middlewares/authorizeRoles.js';
import { applyJob, getApplicants, getAppliedJobs, updateStatus, getRecruiterStats, getApplicationDetail } from '../controllers/application.controller.js';

const router = express.Router();

router.post('/apply/:id', isAuthenticated, authorizeRoles('candidate', 'student', 'employee'), applyJob);
router.get('/get', isAuthenticated, authorizeRoles('candidate', 'student', 'employee'), getAppliedJobs);
router.get('/detail/:id', isAuthenticated, getApplicationDetail);
router.get('/stats', isAuthenticated, authorizeRoles('coordinator', 'recruiter', 'admin'), getRecruiterStats);
router.get('/:id/applicants', isAuthenticated, authorizeRoles('coordinator', 'recruiter', 'admin'), getApplicants);
router.post('/status/:id/update', isAuthenticated, authorizeRoles('coordinator', 'recruiter', 'admin'), updateStatus);
router.put('/status/:id/update', isAuthenticated, authorizeRoles('coordinator', 'recruiter', 'admin'), updateStatus);

export default router;