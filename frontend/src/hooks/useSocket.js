import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { addNotification, setNotifications } from '@/redux/notificationSlice';
import { NOTIFICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { toast } from 'sonner';

let socket;

const useSocket = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);

    useEffect(() => {
        if (user?._id) {
            // 1. Fetch persistent notifications from MongoDB on login / app mount
            const fetchNotifications = async () => {
                try {
                    const res = await axios.get(`${NOTIFICATION_API_END_POINT}/get`, { withCredentials: true });
                    if (res.data.success) {
                        dispatch(setNotifications({
                            notifications: res.data.notifications,
                            unreadCount: res.data.unreadCount
                        }));
                    }
                } catch (error) {
                    console.log("Error fetching persistent notifications:", error);
                }
            };

            fetchNotifications();

            // 2. Initialize Socket connection for real-time notifications
            socket = io('http://localhost:3000', {
                query: {
                    userId: user._id
                },
                transports: ['websocket', 'polling']
            });

            socket.on('connect', () => {
                console.log('⚡ Connected to Notification Socket Server');
            });

            // 3. Listen for real-time notifications
            socket.on('notification:get', (notification) => {
                dispatch(addNotification(notification));
                toast.info(notification.message, {
                    description: notification.createdAt ? new Date(notification.createdAt).toLocaleTimeString() : 'Just now',
                    duration: 6000,
                });
            });

            return () => {
                socket.disconnect();
                console.log('🔌 Notification Socket disconnected');
            };
        }
    }, [user?._id, dispatch]);
};

export default useSocket;
