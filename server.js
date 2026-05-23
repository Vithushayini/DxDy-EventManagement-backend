// import dotenv from 'dotenv';
// import connectDB from './config/db.js';
// import { createApp } from './app.js';

// dotenv.config();

// const port = process.env.PORT || 8080;
// const app = createApp();

// await connectDB();

// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });


import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import apiRoutes from './routes/index.routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// MongoDB Connection
connectDB();

// Essential Middleware only
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Simple health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Server is running' });
});

// API Routes
app.use('/api', apiRoutes);

// Global error handler MUST be last
app.use(errorHandler);



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
