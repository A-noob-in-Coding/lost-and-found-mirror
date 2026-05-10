import crypto from "crypto"
import { sendOTPEmail, storeOTP, verifyOTPService } from "../service/otpService.js";

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString(); 
};

const recentOtpRequests = new Map();
const OTP_COOLDOWN = 120000; // 120 seconds cooldown

export const sendOTPController = async (req, res) => {
  const { email, isResend } = req.body;
  
  const now = Date.now();
  
  // Only apply rate limiting for resend requests (not initial OTP send)
  if (isResend) {
    const lastRequestTime = recentOtpRequests.get(email);
    
    if (lastRequestTime && (now - lastRequestTime) < OTP_COOLDOWN) {
      const remainingTime = Math.ceil((OTP_COOLDOWN - (now - lastRequestTime)) / 1000);
      return res.status(429).json({ 
        message: `Please wait ${remainingTime} seconds before requesting another OTP` 
      });
    }
  }
  
  const otp = generateOTP();

  try {
    await sendOTPEmail(email, otp);
    await storeOTP(email, otp);
    
    // Only start cooldown timer for resend requests
    if (isResend) {
      recentOtpRequests.set(email, now);
      
      setTimeout(() => {
        recentOtpRequests.delete(email);
      }, OTP_COOLDOWN);
    }
    
    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP' });
  }
};

export const verifyOTPController = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const result = await verifyOTPService(email, otp);

    if (!result.success) {
      return res.status(400).json({  message: 'Error in verfying OTP'  });
    }

    recentOtpRequests.delete(email);

    res.status(200).json({  message: 'OTP has Verfied'  });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying OTP' });
  }
};