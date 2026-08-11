import { Notification } from "../models/notification.model.js";

// Fetch all notifications for logged-in user
export const getNotifications = async (req, res) => {
    try {
        const userId = req.id;

        const notifications = await Notification.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(50);

        const unreadCount = await Notification.countDocuments({ user: userId, isRead: false });

        return res.status(200).json({
            notifications,
            unreadCount,
            success: true
        });
    } catch (error) {
        console.log("GET NOTIFICATIONS ERROR:", error);
        return res.status(500).json({
            message: "Failed to fetch notifications",
            success: false
        });
    }
};

// Mark all notifications as read for logged-in user
export const markNotificationsAsRead = async (req, res) => {
    try {
        const userId = req.id;

        await Notification.updateMany(
            { user: userId, isRead: false },
            { $set: { isRead: true } }
        );

        return res.status(200).json({
            message: "Notifications marked as read",
            success: true
        });
    } catch (error) {
        console.log("MARK NOTIFICATIONS READ ERROR:", error);
        return res.status(500).json({
            message: "Failed to update notifications",
            success: false
        });
    }
};

// Clear all notifications for logged-in user
export const clearNotifications = async (req, res) => {
    try {
        const userId = req.id;

        await Notification.deleteMany({ user: userId });

        return res.status(200).json({
            message: "All notifications cleared",
            success: true
        });
    } catch (error) {
        console.log("CLEAR NOTIFICATIONS ERROR:", error);
        return res.status(500).json({
            message: "Failed to clear notifications",
            success: false
        });
    }
};
