import mongoose from 'mongoose';

const AnnouncementSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        default: 'Marketing'
    },
    active: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600 // Announcements expire after 1 hour automatically
    }
});

export default mongoose.model('Announcement', AnnouncementSchema);
