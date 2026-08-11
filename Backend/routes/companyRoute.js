import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import authorizeRoles from '../middlewares/authorizeRoles.js';
import { 
  getCompany, 
  getCompanyById, 
  registerCompany, 
  updateCompany 
} from '../controllers/company.controller.js';
import { singleUpload } from '../middlewares/multer.js'; 

const router = express.Router();

router.post('/register', isAuthenticated, authorizeRoles('recruiter'), singleUpload, registerCompany);
router.get('/get', isAuthenticated, authorizeRoles('recruiter'), getCompany);
router.get('/get/:id', isAuthenticated, getCompanyById);

router.put(
  "/update/:id",
  isAuthenticated,
  authorizeRoles('recruiter'),
  singleUpload,   
  updateCompany
);

export default router;