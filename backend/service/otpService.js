import OtpModel from '../model/OtpModel.js';
import nodemailer from 'nodemailer';

export const sendOTPEmail = async (email, otp) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('Email credentials not configured in environment variables');
    }

    const normalizedEmail = email.toLowerCase();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: normalizedEmail,
      subject: 'Your Verification OTP for Lost and Found',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333;">Verification Code</h2>
          <p>Your OTP for account verification is:</p>
          <h1 style="font-size: 32px; background-color: #f5f5f5; padding: 10px; text-align: center; letter-spacing: 5px;">${otp}</h1>
          <p>This code will expire in 5 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
};

export const storeOTP = async (email, otp) => {
  try {
    const normalizedEmail = email.toLowerCase();
    await OtpModel.upsert(normalizedEmail, otp);
  } catch (error) {
    throw new Error('Failed to store OTP');
  }
};


export const verifyOTPService = async (email, otp) => {
  try {
    const normalizedEmail = email.toLowerCase();
    const result = await OtpModel.verify(normalizedEmail, otp);

    if (!result) {
      return { success: false, message: 'Invalid or expired OTP' };
    }

    await OtpModel.deleteById(result.otp_id);

    return { success: true, message: 'OTP verified successfully. Account activated.' };
  } catch (error) {
    throw new Error('Error verifying OTP');
  }
};

export const cleanupExpiredOTPs = async () => {
  return await OtpModel.cleanupExpired();
};

export const debugOTPTimestamps = async (email) => {
  return { message: "Debug removed for production" };
};