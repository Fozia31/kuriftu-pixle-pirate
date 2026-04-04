import mongoose from 'mongoose';

/**
 * Document Model: Original Raw File Storage.
 * Stores the full PDF binary data and metadata.
 */
const DocumentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    data: {
        type: Buffer, // The binary PDF file
        required: true
    },
    mimetype: {
        type: String,
        default: 'application/pdf'
    },
    size: {
        type: Number, // File size in bytes
        required: true
    },
    topic: {
        type: String,
        default: 'General'
    },
    uploadDate: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Document', DocumentSchema);
