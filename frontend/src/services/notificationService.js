import API from './api.js';

class NotificationService {
  // Send found item notification
  async sendFoundItemNotification(senderEmail, receiverEmail, itemTitle) {
    try {
      const response = await API.post('/api/notifications/found-item', {
        senderEmail,
        receiverEmail,
        itemTitle
      });
      return response.data;
    } catch (error) {
      console.error('Error sending found item notification');
      throw error;
    }
  }

  // Send claim item notification
  async sendClaimItemNotification(senderEmail, receiverEmail, itemTitle) {
    try {
      const response = await API.post('/api/notifications/claim-item', {
        senderEmail,
        receiverEmail,
        itemTitle
      });
      return response.data;
    } catch (error) {
      console.error('Error sending claim item notification');
      throw error;
    }
  }

  // Get user notifications
  async getUserNotifications(email) {
    try {
      const response = await API.get(`/api/notifications/user/${encodeURIComponent(email)}`);
      return response.data.notifications;
    } catch (error) {
      console.error('Error fetching user notifications');
      throw error;
    }
  }

  // Get notification count
  async getNotificationCount(email) {
    try {
      const response = await API.get(`/api/notifications/count/${encodeURIComponent(email)}`);
      return response.data.count;
    } catch (error) {
      console.error('Error fetching notification count');
      throw error;
    }
  }

  // Delete notification
  async deleteNotification(notificationId) {
    try {
      const response = await API.delete(`/api/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting notification');
      throw error;
    }
  }
}

export const notificationService = new NotificationService();
