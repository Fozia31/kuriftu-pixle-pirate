import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import pricingRouter from './routers/pricing.route.js';
import demandRouter from './routers/demand.route.js';
import analysisRouter from './routers/analysis.route.js';
import simulationRouter from './routers/simulation.route.js';
import ecosystemRouter from './routers/ecosystem.route.js';
import authRouter from './routers/auth.route.js';
import chatRouter from './routers/chat.route.js';
import { protect } from './middlewares/auth.middleware.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Public Routes
app.use('/api/auth', authRouter);

// Protected Routes
app.use('/api/pricing', protect, pricingRouter);
app.use('/api/demand', protect, demandRouter);
app.use('/api/analysis', protect, analysisRouter);
app.use('/api/simulation', protect, simulationRouter);
app.use('/api/revenue', protect, ecosystemRouter);
app.use('/api/chat', chatRouter);


app.get('/', (req, res) => {
    res.send('🚀 Server is running! Hello from Kuriftu Resort backend.')
})

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
})