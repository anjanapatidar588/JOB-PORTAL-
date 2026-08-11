import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        notifications: [],
        unreadCount: 0
    },
    reducers: {
        setNotifications: (state, action) => {
            state.notifications = action.payload.notifications || [];
            state.unreadCount = action.payload.unreadCount !== undefined 
                ? action.payload.unreadCount 
                : (action.payload.notifications || []).filter(n => !n.isRead).length;
        },
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
            state.unreadCount += 1;
        },
        markAllAsRead: (state) => {
            state.unreadCount = 0;
            state.notifications = state.notifications.map(n => ({ ...n, isRead: true }));
        },
        clearNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
        }
    }
});

export const { setNotifications, addNotification, markAllAsRead, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
