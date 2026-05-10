import {
  sendEmailNotification,
  createFoundItemEmailContent,
  createClaimItemEmailContent,
  storeNotification,
  getNotificationsByReceiver,
  getNotificationCount,
  deleteNotification
} from "../service/notificationService.js";

export const sendFoundItemNotification = async (req, res) => {
  const { senderEmail, receiverEmail, itemTitle } = req.body;

  if (!senderEmail || !receiverEmail || !itemTitle) {
    return res.status(400).json({ message: 'All fields are required: senderEmail, receiverEmail, itemTitle' });
  }

  if (senderEmail === receiverEmail) {
    return res.status(400).json({ message: 'Sender and receiver email cannot be the same.' });
  }

  try {
    await storeNotification(senderEmail, receiverEmail);

    const emailContent = createFoundItemEmailContent(senderEmail, itemTitle);

    await sendEmailNotification(
      receiverEmail,
      'Good News! Your Item Has Been Found',
      emailContent
    );

    res.status(200).json({ message: 'Found item notification sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send notification' });
  }
};

export const sendClaimItemNotification = async (req, res) => {
  const { senderEmail, receiverEmail, itemTitle } = req.body;

  if (!senderEmail || !receiverEmail || !itemTitle) {
    return res.status(400).json({ message: 'All fields are required: senderEmail, receiverEmail, itemTitle' });
  }

  if (senderEmail === receiverEmail) {
    return res.status(400).json({ message: 'Sender and receiver email cannot be the same.' });
  }

  try {
    await storeNotification(senderEmail, receiverEmail);

    const emailContent = createClaimItemEmailContent(senderEmail, itemTitle);

    await sendEmailNotification(
      receiverEmail,
      'Someone Has Claimed Your Found Item',
      emailContent
    );

    res.status(200).json({ message: 'Claim item notification sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send notification' });
  }
};

export const getUserNotifications = async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  if (req.user?.email && req.user.email.toLowerCase() !== email.toLowerCase()) {
    return res.status(403).json({ message: 'Unauthorized to view these notifications' });
  }

  try {
    const notifications = await getNotificationsByReceiver(email);
    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get notifications' });
  }
};

export const getUserNotificationCount = async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  if (req.user?.email && req.user.email.toLowerCase() !== email.toLowerCase()) {
    return res.status(403).json({ message: 'Unauthorized to view these notifications' });
  }

  try {
    const count = await getNotificationCount(email);
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get notification count' });
  }
};

export const removeNotification = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Notification ID is required' });
  }

  try {
    const deletedNotification = await deleteNotification(id);
    if (!deletedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete notification' });
  }
};
