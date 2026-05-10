import express from 'express';
import { loginWithSupabase, logoutFromSupabase, getSupabaseSession } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const authRouter = express.Router();

authRouter.post('/login', loginWithSupabase);
authRouter.post('/logout', requireAuth, logoutFromSupabase);
authRouter.get('/session', requireAuth, getSupabaseSession);

export default authRouter;
