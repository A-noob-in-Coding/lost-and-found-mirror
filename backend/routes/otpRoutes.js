import { sendOTPController,verifyOTPController } from "../controllers/otpController.js";
import express from "express";

const otpRouter = express.Router();

otpRouter.post('/send-otp', sendOTPController);
otpRouter.post('/verify-otp', verifyOTPController);

export default otpRouter