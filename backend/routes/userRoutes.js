import express from 'express';
import {
  authenticateUser,
  changePassword,
  checkUserByEmail,
  getUserByRollNo,
  getUserImage,
  registerUser,
  updateUserName,
  updateUserImage,
  getUserByEmail,
  authenticateAdmin,
  updatUserCampus,
  updateUserPrivacy,
  getUserCount
} from '../controllers/userController.js';
import { requireAuth } from '../middleware/auth.js';

const userRouter = express.Router();

// Public routes - authentication only
userRouter.post('/register', registerUser);
userRouter.post('/login', authenticateUser);
userRouter.post('/loginAdmin', authenticateAdmin);

// Protected routes - require authentication
userRouter.get('/check-email', checkUserByEmail);
userRouter.get('/email/get-user', requireAuth, getUserByEmail);
userRouter.get('/:rollNo/:option', getUserByRollNo);
userRouter.post('/changePassword', changePassword);
userRouter.get('/image/:rollNo', requireAuth, getUserImage);
userRouter.put('/updateusername', requireAuth, updateUserName);
userRouter.post('/update-image', requireAuth, updateUserImage);
userRouter.post('/update/campus', requireAuth, updatUserCampus);
userRouter.put('/update/privacy', requireAuth, updateUserPrivacy);
userRouter.get('/count', requireAuth, getUserCount);

export default userRouter;
