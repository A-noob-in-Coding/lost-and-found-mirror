import NotificationModel from '../model/NotificationModel.js';
import nodemailer from 'nodemailer';
import UserModel from '../model/UserModel.js';
export const getNotificationsByReceiver = async (receiverEmail) => {
  return await NotificationModel.getByReceiver(receiverEmail);
};

export const storeNotification = async (senderEmail, receiverEmail) => {
  return await NotificationModel.create(senderEmail, receiverEmail);
};

export const getNotificationCount = async (receiverEmail) => {
  return await NotificationModel.getCount(receiverEmail);
};

export const deleteNotification = async (notificationId) => {
  return await NotificationModel.delete(notificationId);
};

export const getUserEmailByRollNo = async (rollno) => {
  const user = await UserModel.findByRollNo(rollno);
  if (!user) {
    throw new Error(`User with rollno ${rollno} not found`);
  }
  return user.email;
};

export const sendEmailNotification = async (recipientEmail, subject, htmlContent) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('Email credentials not configured in environment variables');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: subject,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending notification email:', error);
    throw new Error(`Failed to send notification email: ${error.message}`);
  }
};

export const createFoundItemEmailContent = (finderName, itemTitle) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #333;">Good News! Your Item Has Been Found</h2>
      <p>Hello,</p>
      <p>We are pleased to inform you that <strong>${finderName}</strong> has found your item: <strong>${itemTitle}</strong>.</p>
      <p>Please log in to the Lost and Found application to delete the post if it is no longer needed.</p>
      <p>Thank you for using our service!</p>
      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #777;">
        <p>This is an automated message. Please do not reply to this email.</p>
      </div>
    </div>
  `;
};

export const createClaimItemEmailContent = (claimerName, itemTitle) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #333;">Item Claim Notification</h2>
      <p>Hello,</p>
      <p>We'd like to inform you that <strong>${claimerName}</strong> has claimed your found item: <strong>${itemTitle}</strong>.</p>
<p>Please log in to the Lost and Found application to delete the post if it is no longer needed.</p>
      <p>Thank you for using our service!</p>
      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #777;">
        <p>This is an automated message. Please do not reply to this email.</p>
      </div>
    </div>
  `;
};
