import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { notificationService } from "../services/notificationService.js";
import ConfirmationModal from "../components/confirmationModal";
import MobileNotificationPanel from "../components/mobileNotificationPanel";
import toast from "react-hot-toast";

export default function Navbar({ searchQuery, setSearchQuery }) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [profileImgUrl, setProfileImgUrl] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showMobileNotifications, setShowMobileNotifications] = useState(false);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const { user, logout } = useAuth(); // call the hook inside the component

  useEffect(() => {
    // Check if user exists and has an image_url property before setting it
    if (user && user.image_url) {
      setProfileImgUrl(user.image_url);
    }

    // Fetch notification count when user is logged in
    if (user && user.email) {
      fetchNotificationCount();
    }
  }, [user]); // Add user as a dependency to update when user changes

  // Fetch notification count
  const fetchNotificationCount = async () => {
    if (!user?.email) return;

    try {
      const count = await notificationService.getNotificationCount(user.email);
      setNotificationCount(count);
    } catch (error) {
      toast.error('Error fetching notification count:', error);
    }
  };

  // Fetch notifications
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

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setShowMobileMenu(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-dropdown-container')) {
        setShowProfileDropdown(false);
      }
      if (!event.target.closest('.notifications-container')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleNotifications = async () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      // Fetch notifications when opening the dropdown
      await fetchNotifications();
    }
  };

  const handleMobileNotifications = async () => {
    setShowMobileNotifications(true);
    setShowMobileMenu(false);
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setNotificationCount(prev => Math.max(0, prev - 1));
      toast.success('Notification removed');
    } catch (error) {
      toast.error('Failed to remove notification');
    }
  };

  const handleDeleteAllNotifications = () => {
    if (notifications.length === 0) return;
    setShowDeleteAllConfirm(true);
  };

  const confirmDeleteAllNotifications = async () => {
    try {
      // Delete all notifications
      for (const notification of notifications) {
        await notificationService.deleteNotification(notification.id);
      }

      setNotifications([]);
      setNotificationCount(0);
      setShowDeleteAllConfirm(false);
      toast.success('All notifications deleted successfully');
    } catch (error) {
      toast.error('Failed to delete all notifications');
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    navigate("/login");
    setShowLogoutModal(false);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
    toast.success('Staying logged in');
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleViewProfile = () => {
    navigate("/profile");
    setShowProfileDropdown(false);
  };

  const handleLogoutFromDropdown = () => {
    setShowProfileDropdown(false);
    setShowLogoutModal(true);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-[60px] bg-white shadow-sm z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo - Always visible */}
          <div className="flex items-center space-x-3">
            <img
              src="/lf_logo.png"
              alt="Lost & Found Logo"
              className="h-12 w-12 rounded-full"
            />
            <div className="text-lg sm:text-xl font-bold">Lost & Found</div>
          </div>

          {/* Search Bar - Hidden on mobile, visible on tablets and up */}
          <div className="hidden md:block relative flex-1 max-w-xl mx-8">
            <input
              type="text"
              placeholder="Search for lost or found items..."
              className="w-full px-4 py-2 pr-12 border border-gray-200 rounded-full focus:outline-none focus:border-black text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <i className="fas fa-search text-white text-sm"></i>
            </div>
          </div>

          {/* Desktop Actions - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <button
              onClick={() => navigate("/createPost")}
              className="bg-black text-white px-6 lg:px-8 py-2 rounded-full text-sm font-medium hover:bg-gray-900 transition-colors whitespace-nowrap"
            >
              Post
            </button>
            <div className="relative notifications-container">
              <div className="relative">
                <i
                  className="fas fa-bell text-2xl cursor-pointer hover:text-gray-600 transition-colors"
                  onClick={handleNotifications}
                ></i>
                {/* Notification Count Badge */}
                {notificationCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </span>
                )}
              </div>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 p-4 z-10 max-h-96 overflow-y-auto">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Notifications</h3>
                    <div className="flex items-center space-x-2">
                      {notificationCount > 0 && (
                        <span className="text-xs text-gray-500">{notificationCount} new</span>
                      )}
                      {notifications.length > 0 && (
                        <button
                          onClick={handleDeleteAllNotifications}
                          className="text-red-500 hover:text-red-600 transition-colors p-1 rounded-md hover:bg-red-50"
                          title="Delete all notifications"
                        >
                          <i className="fas fa-trash text-sm"></i>
                        </button>
                      )}
                    </div>
                  </div>

                  {notificationsLoading ? (
                    <div className="text-center py-4">
                      <i className="fas fa-spinner fa-spin text-gray-400"></i>
                      <p className="text-sm text-gray-500 mt-2">Loading notifications...</p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="text-center py-4">
                      <i className="fas fa-bell-slash text-gray-400 text-2xl mb-2"></i>
                      <p className="text-sm text-gray-600">No new notifications</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="p-3 bg-gray-50 rounded-lg border border-gray-200 relative group"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800 mb-1">
                                Notification from {notification.sender}
                              </p>
                              <p className="text-xs text-gray-600">
                                Kindly check your email for details.
                              </p>
                            </div>
                            <button
                              onClick={() => handleDeleteNotification(notification.id)}
                              className="ml-2 text-red-500 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                              title="Delete notification"
                            >
                              <i className="fas fa-trash text-xs"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="relative profile-dropdown-container">
              <div
                className="w-12 h-12 rounded-full bg-gray-200 cursor-pointer overflow-hidden flex items-center justify-center hover:ring-2 hover:ring-gray-300 transition-all"
                onClick={handleProfileClick}
              >
                {profileImgUrl ? (
                  <div className="w-full h-full relative">
                    <img
                      src={profileImgUrl || "https://via.placeholder.com/40"}
                      alt="Profile"
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/40";
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                    <i className="fas fa-user text-lg"></i>
                  </div>
                )}
              </div>
              {/* Profile Dropdown */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-10">
                  <button
                    onClick={handleViewProfile}
                    className="w-full flex items-center px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <i className="fas fa-user mr-3 text-lg"></i>
                    View Profile
                  </button>
                  <button
                    onClick={handleLogoutFromDropdown}
                    className="w-full flex items-center px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <i className="fas fa-sign-out-alt mr-3 text-lg"></i>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-md text-gray-600 hover:text-black hover:bg-gray-100 transition-colors"
            >
              <i className="fas fa-bars text-2xl"></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {showMobileMenu && (
          <div className="md:hidden bg-white border-t border-gray-100">
            {/* Mobile Search */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for lost or found items..."
                  className="w-full px-4 py-2 pr-12 border border-gray-200 rounded-full focus:outline-none focus:border-black text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <i className="fas fa-search text-white text-sm"></i>
                </div>
              </div>
            </div>

            {/* Mobile Menu Items */}
            <div className="px-4 py-3 space-y-2">
              <button
                onClick={() => {
                  navigate("/createPost");
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i className="fas fa-plus mr-3 text-lg"></i>
                Create Post
              </button>
              <button
                onClick={handleMobileNotifications}
                className="w-full flex items-center px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative"
              >
                <i className="fas fa-bell mr-3 text-lg"></i>
                Notifications
                {notificationCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  navigate("/profile");
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i className="fas fa-user mr-3 text-lg"></i>
                View Profile
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <i className="fas fa-sign-out-alt mr-3 text-lg"></i>
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={cancelLogout}
        onConfirm={confirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout? You will be redirected to the login page."
        confirmText="Logout"
        cancelText="Stay Logged In"
        confirmShortText="Logout"
        cancelShortText="Stay"
        type="warning"
      />

      {/* Mobile Notifications Panel */}
      <MobileNotificationPanel
        isOpen={showMobileNotifications}
        onClose={() => setShowMobileNotifications(false)}
        onNotificationCountUpdate={setNotificationCount}
      />

      {/* Delete All Notifications Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteAllConfirm}
        onClose={() => setShowDeleteAllConfirm(false)}
        onConfirm={confirmDeleteAllNotifications}
        title="Delete All Notifications"
        message={`Are you sure you want to delete all ${notifications.length} notifications? This action cannot be undone.`}
        confirmText="Delete All"
        cancelText="Cancel"
        type="danger"
      />
    </>
  );
}
