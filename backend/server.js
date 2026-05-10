import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import otpRouter from './routes/otpRoutes.js';
import { cleanupExpiredOTPs } from './service/otpService.js';
import userPostRouter from './routes/userPostRoutes.js';
import adminPostRouter from './routes/adminPostRoutes.js';
import userRouter from './routes/userRoutes.js';
import utilrouter from './routes/utilityRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import notificationRouter from './routes/notificationRoutes.js';
import categoryRouter from './routes/categoryRoutes.js';
import authRouter from './routes/authRoutes.js';

import { extractAuthToken } from './middleware/auth.js';
import tokenRouter from './routes/tokenRoutes.js';

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL?.trim().replace(/\/$/, ""),
  "http://localhost:5173"
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // console.log("Incoming origin:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200,
  maxAge: 86400
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(extractAuthToken);

// Routes
app.use('/auth', tokenRouter);
app.use('/api/auth', authRouter);
app.use('/comment', commentRoutes);
app.use('/api/users', userRouter);
app.use('/api/otp', otpRouter);
app.use('/api/user/posts', userPostRouter);
app.use('/api/admin/posts', adminPostRouter);
app.use('/utility', utilrouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/categories', categoryRouter);

// Error handling middleware for multer errors (ensures CORS headers on errors)
app.use((err, req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 1MB.' });
    }
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  } else if (err) {
    console.error('Server Error:', err);
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
  next();
});

app.get('/', (req, res) => {
  res.status(200).send({ status: 'running!' });
});

const PORT = process.env.PORT || 5000;

// Cleanup expired OTPs every 5 minutes
const OTP_CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

const startOtpCleanupScheduler = () => {
  cleanupExpiredOTPs()
    .then(count => console.log(`Initial OTP cleanup: ${count} expired OTPs removed`))
    .catch(err => console.error('Initial OTP cleanup error:', err));

  setInterval(async () => {
    try {
      const deletedCount = await cleanupExpiredOTPs();
      if (deletedCount > 0) {
        console.log(`Scheduled OTP cleanup: ${deletedCount} expired OTPs removed`);
      }
    } catch (error) {
      console.error('Scheduled OTP cleanup error:', error);
    }
  }, OTP_CLEANUP_INTERVAL);
};

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on IPv4 at http://0.0.0.0:${PORT}`);
  startOtpCleanupScheduler();
});