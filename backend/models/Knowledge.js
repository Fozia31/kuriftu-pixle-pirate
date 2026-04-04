import mongoose from 'mongoose';

const KnowledgeSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document'
    },
    content: {
        type: String, // Individual chunk content
        required: true
    },
    chunkIndex: {
        type: Number,
        required: true
    },
    embedding: {
        type: [Number], // 1024-dim vector
        required: true
    },
    topic: {
        type: String,
        default: 'Resort Manual'
    },
    metadata: {
        type: Map,
        of: String,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Knowledge', KnowledgeSchema);
