import { Server } from 'socket.io';
import { Notification } from '../models/notification.model.js';

let io;
const userSocketMap = {}; // { userId: socketId }

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId && userId !== "undefined") {
            userSocketMap[userId] = socket.id;
            console.log(`⚡ Socket connected: User ${userId} with socket ID ${socket.id}`);
        }

        socket.on("disconnect", () => {
            if (userId) {
                delete userSocketMap[userId];
                console.log(`🔌 Socket disconnected: User ${userId}`);
            }
        });
    });

    return io;
};

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

export const sendNotification = (receiverId, notificationData) => {
    const receiverSocketId = getReceiverSocketId(receiverId?.toString());
    if (receiverSocketId && io) {
        io.to(receiverSocketId).emit("notification:get", notificationData);
        console.log(`🔔 Notification emitted to user ${receiverId}:`, notificationData.message);
    }
};

/**
 * Persists notification to MongoDB and emits real-time socket event if user is connected
 */
export const createAndSendNotification = async (receiverId, { message, type = 'GENERAL', link = '' }) => {
    try {
        if (!receiverId) return null;

        // 1. Persist notification to Database
        const notification = await Notification.create({
            user: receiverId,
            message,
            type,
            link,
            isRead: false
        });

        // 2. Emit real-time notification over socket if receiver is connected online
        sendNotification(receiverId, notification);

        return notification;
    } catch (error) {
        console.log("CREATE NOTIFICATION ERROR:", error);
        return null;
    }
};

export { io };
