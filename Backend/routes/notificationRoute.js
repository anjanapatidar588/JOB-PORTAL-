import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { getNotifications, markNotificationsAsRead, clearNotifications } from '../controllers/notification.controller.js';

const router = express.Router();

router.get('/get', isAuthenticated, getNotifications);
router.post('/read', isAuthenticated, markNotificationsAsRead);
router.delete('/clear', isAuthenticated, clearNotifications);

export default router;
