import mongoose from 'mongoose';

const statusHistorySchema = new mongoose.Schema({
    status: {
        type: String,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JOB",
        required: true
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: [
            'pending',
            'applied',
            'application viewed',
            'shortlisted',
            'interview scheduled',
            'interviewing',
            'interview completed',
            'selected',
            'accepted',
            'rejected'
        ],
        default: 'applied'
    },
    statusHistory: [statusHistorySchema]
}, { timestamps: true });

export const Application = mongoose.model("Application", applicationSchema);

