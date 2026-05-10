import { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';

// QUERIES
// Get User Notifications
export const useUserNotifications = (email, options = {}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!email) {
      setIsLoading(false);
      return;
    }
    let mounted = true;
    const fetchData = async () => {
      try {
        const res = await notificationService.getUserNotifications(email);
        if (mounted) {
          setData(res);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err);
          setIsLoading(false);
        }
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, [email]);

  return { data, isLoading, error };
};

// Get Notification Count
export const useNotificationCount = (email, options = {}) => {
  const [data, setData] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!email) {
      setIsLoading(false);
      return;
    }
    let mounted = true;
    const fetchData = async () => {
      try {
        const res = await notificationService.getNotificationCount(email);
        if (mounted) {
          setData(res);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err); // Keep old data on error? or set null?
        }
      }
    };

    fetchData(); // Initial fetch

    const intervalId = setInterval(fetchData, 30000); // Poll every 30s

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [email]);

  return { data, isLoading, error };
};

// MUTATIONS

// Send Found Item Notification
export const useSendFoundItemNotification = (options = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async ({ senderEmail, receiverEmail, itemTitle }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await notificationService.sendFoundItemNotification(senderEmail, receiverEmail, itemTitle);
      if (options.onSuccess) {
        options.onSuccess(result, { senderEmail, receiverEmail, itemTitle });
      }
      return result;
    } catch (err) {
      setError(err);
      if (options.onError) {
        options.onError(err);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error };
};

// Send Claim Item Notification
export const useSendClaimItemNotification = (options = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async ({ senderEmail, receiverEmail, itemTitle }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await notificationService.sendClaimItemNotification(senderEmail, receiverEmail, itemTitle);
      if (options.onSuccess) {
        options.onSuccess(result, { senderEmail, receiverEmail, itemTitle });
      }
      return result;
    } catch (err) {
      setError(err);
      if (options.onError) {
        options.onError(err);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error };
};

// Delete Notification
export const useDeleteNotification = (options = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async ({ notificationId, userEmail }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await notificationService.deleteNotification(notificationId);
      if (options.onSuccess) {
        options.onSuccess(result, { notificationId, userEmail });
      }
      return result;
    } catch (err) {
      setError(err);
      if (options.onError) {
        options.onError(err);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error };
};

export const useClearAllNotifications = (options = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async ({ notifications, userEmail }) => {
    setIsLoading(true);
    setError(null);
    try {
      const deletePromises = notifications.map((notification) =>
        notificationService.deleteNotification(notification.id)
      );
      const result = await Promise.all(deletePromises);
      if (options.onSuccess) {
        options.onSuccess(result, { notifications, userEmail });
      }
      return result;
    } catch (err) {
      setError(err);
      if (options.onError) {
        options.onError(err);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error };
};
