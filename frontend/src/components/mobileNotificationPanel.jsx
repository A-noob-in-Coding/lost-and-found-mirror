import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService.js';
import { useAuth } from '../context/authContext';
import toast from 'react-hot-toast';
import ConfirmationModal from './confirmationModal.jsx';

const MobileNotificationPanel = ({ isOpen, onClose, onNotificationCountUpdate }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

  // Fetch notifications when panel opens
  useEffect(() => {
    if (isOpen && user?.email) {
      setIsAnimating(true);
      fetchNotifications();
    } else if (!isOpen) {
      setIsAnimating(false);
    }
  }, [isOpen, user?.email]);

  // Close panel on outside click or escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const fetchNotifications = async () => {
    if (!user?.email) return;

    try {
      setNotificationsLoading(true);
      const userNotifications = await notificationService.getUserNotifications(user.email);
      setNotifications(userNotifications);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setNotificationsLoading(false);
    }
  };

  const handleDeleteClick = (notification) => {
    setNotificationToDelete(notification);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!notificationToDelete) return;

    try {
      await notificationService.deleteNotification(notificationToDelete.id);
      setNotifications(prev => prev.filter(n => n.id !== notificationToDelete.id));

      // Update parent component's notification count
      if (onNotificationCountUpdate) {
        onNotificationCountUpdate(prev => Math.max(0, prev - 1));
      }

      toast.success('Notification removed');
    } catch (error) {
      toast.error('Failed to remove notification');
    } finally {
      setShowDeleteConfirm(false);
      setNotificationToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setNotificationToDelete(null);
  };



  const handleDeleteAll = () => {
    setShowDeleteAllConfirm(true);
  };

  const handleDeleteAllConfirm = async () => {
    if (!user?.email) return;

    try {
      // Delete all notifications for the user
      for (const notification of notifications) {
        await notificationService.deleteNotification(notification.id);
      }

      setNotifications([]);

      // Update parent component's notification count to 0
      if (onNotificationCountUpdate) {
        onNotificationCountUpdate(0);
      }

      toast.success('All notifications deleted successfully');
    } catch (error) {
      toast.error('Failed to delete all notifications');
    } finally {
      setShowDeleteAllConfirm(false);
    }
  };

  const handleDeleteAllCancel = () => {
    setShowDeleteAllConfirm(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Notification Panel */}
      <div
        className="fixed inset-0 z-40 md:hidden"
        style={{ top: '60px' }} // Position below navbar
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black bg-opacity-20"
          style={{ backdropFilter: 'blur(4px)' }}
          onClick={handleBackdropClick}
        ></div>

        {/* Panel */}
        <div className={`absolute inset-0 bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
          {/* Panel Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shrink-0">
            <div className="flex items-center space-x-3">
              <i className="fas fa-bell text-xl text-gray-700"></i>
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            </div>
            <div className="flex items-center space-x-2">
              {notifications.length > 0 && (
                <button
                  onClick={handleDeleteAll}
                  className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors px-2 py-1 rounded flex items-center space-x-1"
                  title="Delete all notifications"
                >
                  <i className="fas fa-trash text-sm"></i>
                  <span>Delete All</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close notifications"
              >
                <i className="fas fa-times text-gray-500 text-lg"></i>
              </button>
            </div>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            {notificationsLoading ? (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <i className="fas fa-spinner fa-spin text-2xl text-gray-400 mb-4"></i>
                <p className="text-gray-500 text-center">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-bell-slash text-gray-400 text-2xl"></i>
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">No notifications</h3>
                <p className="text-gray-500 text-center text-sm">
                  You're all caught up! Check back later for updates.
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 relative cursor-pointer hover:bg-gray-50 transition-colors group"

                  >
                    {/* Notification Content */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <i className="fas fa-envelope text-blue-600 text-sm"></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              Notification from {notification.sender}
                            </p>
                            <p className="text-xs text-gray-600 leading-relaxed">
                              Kindly check your email for details.
                            </p>
                            <div className="flex items-center mt-2 text-xs text-gray-500">
                              <i className="fas fa-clock mr-1"></i>
                              <span>
                                {notification.date ? new Date(notification.date).toLocaleString() : 'Just now'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Delete Button - Always visible on mobile */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(notification);
                        }}
                        className="text-red-500 hover:text-red-600 transition-colors p-2 rounded-md hover:bg-red-50"
                        aria-label="Delete notification"
                      >
                        <i className="fas fa-trash text-sm"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Panel Footer */}
          <div className="p-4 border-t border-gray-200 bg-white shrink-0">
            <p className="text-xs text-gray-500 text-center">
              {notifications.length > 0
                ? `${notifications.length} notification${notifications.length !== 1 ? 's' : ''}`
                : 'No new notifications'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Notification"
        message="Are you sure you want to delete this notification? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Delete All Notifications Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteAllConfirm}
        onClose={handleDeleteAllCancel}
        onConfirm={handleDeleteAllConfirm}
        title="Delete All Notifications"
        message={`Are you sure you want to delete all ${notifications.length} notifications? This action cannot be undone.`}
        confirmText="Delete All"
        cancelText="Cancel"
        type="danger"
      />
    </>
  );
};

export default MobileNotificationPanel;
