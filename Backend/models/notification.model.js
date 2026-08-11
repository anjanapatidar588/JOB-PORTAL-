import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['NEW_APPLICATION', 'STATUS_UPDATE', 'JOB_ALERT', 'GENERAL'],
        default: 'GENERAL'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    link: {
        type: String,
        default: ''
    }
}, { timestamps: true });

export const Notification = mongoose.model('Notification', notificationSchema);
