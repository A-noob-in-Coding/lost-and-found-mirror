import { useState, useMemo, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import CommentForm from "./commentForm";
import ConfirmationModal from "./confirmationModal";
import { useAuth } from "../context/authContext";
import { notificationService } from "../services/notificationService.js";
import toast from 'react-hot-toast';
import { useUtil } from "../context/utilContext";
import { authService } from "../services/authService";
import FeedSkeleton from '../components/feedSkeleton';
import { utilityService } from "../services/utilService";
import { commentService } from "../services/commentService";
import { encryptRollno } from "../utilities/methods.js";

export default function ContentGrid({ filteredItems, isLoading = false }) {
  const { campuses } = useUtil()
  const [selectedItemForComments, setSelectedItemForComments] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [mobileTab, setMobileTab] = useState("comments"); // "details" or "comments"
  const { user } = useAuth();
  const [verifiedRolls, setVerifiedRolls] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const navigate = useNavigate();
  const [claimedItems, setClaimedItems] = useState(() => {
    try {
      const saved = localStorage.getItem('claimed_items');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const campusMap = useMemo(
    () => Object.fromEntries(campuses.map(c => [c.campusID, c.campusName])),
    [campuses]
  );

  const toggleComments = (item) => {
    setSelectedItemForComments(item);
    setMobileTab("comments"); // Open comments tab
  };

  const openDetails = (item) => {
    setSelectedItemForComments(item);
    setMobileTab("details"); // Open details tab
  };

  const closeCommentsPanel = () => {
    setSelectedItemForComments(null);
  };

  // Close panel on Escape key
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const rolls = await utilityService.fetchVerifiedUsers();
        if (mounted && Array.isArray(rolls)) setVerifiedRolls(rolls.map(String));
      } catch (error) {
        toast.error('Failed to load verified users:', error);
      }
    })();

    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && selectedItemForComments) {
        closeCommentsPanel();
      }
    };

    if (selectedItemForComments) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedItemForComments]);

  // Sync selectedItemForComments with filteredItems when data updates (realtime comments)
  useEffect(() => {
    if (selectedItemForComments && filteredItems) {
      const updatedItem = filteredItems.find(
        (item) => item.id === selectedItemForComments.id && item.type === selectedItemForComments.type
      );
      if (updatedItem && JSON.stringify(updatedItem.comments) !== JSON.stringify(selectedItemForComments.comments)) {
        setSelectedItemForComments(updatedItem);
      }
    }
  }, [filteredItems]);

  const toggleDescription = (itemId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const setItemLoading = (itemKey, isLoading) => {
    setLoadingStates(prev => ({
      ...prev,
      [itemKey]: isLoading
    }));
  };

  const handleAction = async (action, type, item) => {
    const itemKey = `${item.type}-${item.id}`;
    setItemLoading(itemKey, true);
    try {
      if (!user || !user.email) {
        toast.error("Please log in to perform this action");
        setItemLoading(itemKey, false);
        return;
      }

      const senderEmail = user.email;
      const itemTitle = item.title;
      const receiverRollno = item.user.rollNumber;

      const { email: receiverEmail } =
        await authService.getUserDetails(receiverRollno, 0)

      if (action === "Found" && type === "Lost") {
        // Send found notification using service
        try {
          await notificationService.sendFoundItemNotification(senderEmail, receiverEmail, itemTitle);
          toast.success('Owner notified that you found their item!');
          setClaimedItems(prev => {
            const newState = [...prev, itemKey];
            localStorage.setItem('claimed_items', JSON.stringify(newState));
            return newState;
          });
        } catch (error) {
          if (error.response?.status === 400) {
            toast.error(error.response.data.message || 'Sender and receiver cannot be same.');
          } else {
            toast.error('Failed to send notification. Please try again.');
          }
        }
      }
      else if (action === "Claim" && type === "Found") {
        // Send claim notification using service
        try {
          await notificationService.sendClaimItemNotification(senderEmail, receiverEmail, itemTitle);
          toast.success('Finder notified that you claimed this item!');
          setClaimedItems(prev => {
            const newState = [...prev, itemKey];
            localStorage.setItem('claimed_items', JSON.stringify(newState));
            return newState;
          });
        } catch (error) {
          if (error.response?.status === 400) {
            toast.error(error.response.data.message || 'Sender and receiver cannot be same.');
          } else {
            toast.error('Failed to send notification. Please try again.');
          }
        }
      }
    } catch (error) {
      toast.error("An error occurred while sending the notification.");
    } finally {
      const itemKey = `${item.type}-${item.id}`;
      setItemLoading(itemKey, false);
    }
  };

  // Show skeleton while loading
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <FeedSkeleton cards={6} />
      </div>
    );
  }

  if (!isLoading && (!filteredItems || filteredItems.length === 0)) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-3">No posts right now</h3>
            <p className="text-gray-600 mb-4">There are no posts to show at the moment. Be the first to create one!</p>
            <div className="space-x-3">
              <a href="/createPost" className="bg-black text-white px-6 py-2 rounded-lg">Create Post</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={`${item.type}-${item.id}`}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-black/10 relative flex flex-col h-full"
          >
            <div className="aspect-square overflow-hidden rounded-t-xl">
              <img
                src={item.image || "/no_prev_img.png"}
                alt={item.title}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-8 h-8 rounded-full overflow-hidden cursor-pointer"
                    onClick={() => {
                      // If the clicked profile belongs to the logged-in user, go to their own profile page
                      if (user && String(user.rollno) === String(item.user.rollNumber)) {
                        navigate('/profile');
                      } else {
                        const res = encryptRollno(item.user.rollNumber)
                        navigate(`/user/${res}`);
                      }
                    }}
                    title={`View ${item.user.name}'s profile`}
                  >
                    {item.user?.avatar ? (
                      <img
                        src={item.user.avatar}
                        alt={item.user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <i className="fas fa-user text-gray-400"></i>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium flex items-center space-x-2">
                      <span>{item.user.name}</span>
                      {verifiedRolls.includes(String(item.user.rollNumber)) && (
                        <img
                          src="/verfication_tag.png"
                          alt="verified"
                          title="Creator of lost and found portal"
                          className="w-4 h-4 object-contain"
                        />
                      )}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center flex-wrap">
                      <span className="truncate">{new Date(item.date + ' UTC').toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content section */}
              <div className="flex flex-col flex-grow">
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <i className="fas fa-university mr-2"></i>
                  {campusMap[item.campusID] || 'Campus not specified'}
                </div>
                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <i className="fas fa-map-marker-alt mr-2"></i>
                  {item.location}
                </div>

                <div className="mb-4 overflow-hidden">
                  <p className="text-sm text-gray-600 break-words overflow-wrap-anywhere line-clamp-2">
                    {item.description}
                  </p>
                  {item.description && item.description.length > 120 && (
                    <button
                      onClick={() => openDetails(item)}
                      className="text-blue-600 text-xs font-medium mt-1 hover:underline"
                    >
                      Show more
                    </button>
                  )}
                </div>
              </div>

              {/* Button section - consistently at the bottom */}
              <div className="mt-auto">
                <button
                  disabled={loadingStates[`${item.type}-${item.id}`] || claimedItems.includes(`${item.type}-${item.id}`)}
                  className={`w-full py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center ${claimedItems.includes(`${item.type}-${item.id}`)
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-black hover:bg-gray-900 text-white"
                    }`}
                  onClick={() => handleAction(
                    item.type === "Lost" ? "Found" : "Claim",
                    item.type,
                    item
                  )}
                >
                  {loadingStates[`${item.type}-${item.id}`] ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : claimedItems.includes(`${item.type}-${item.id}`) ? (
                    item.type === "Lost" ? "Already Found By You!" : "Already Claimed By You!"
                  ) : (
                    item.type === "Lost" ? "Found This Item" : "Claim This Item"
                  )}
                </button>
              </div>

              {/* Comment section */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => toggleComments(item)}
                  className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-comment mr-2"></i>
                  Comments ({item.comments?.length || 0})
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Instagram-style Comments Panel */}
      {selectedItemForComments && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center z-50 md:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeCommentsPanel();
            }
          }}
        >
          <div className="bg-white w-full md:w-full md:max-w-5xl h-[85vh] md:h-[90vh] flex flex-col md:flex-row overflow-hidden shadow-2xl rounded-t-2xl md:rounded-2xl">
            {/* Left side - Post (Hidden on mobile) */}
            <div className="hidden md:flex md:w-1/2 h-full bg-white relative flex-col border-r border-gray-200">
              {/* Fixed Image Section */}
              <div className="w-full bg-[#E5E7EB] flex items-center justify-center flex-shrink-0" style={{ height: '45%' }}>
                <img
                  src={selectedItemForComments.image || "/no_prev_img.png"}
                  alt={selectedItemForComments.title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Scrollable Content Section */}
              <div className="flex-1 overflow-y-auto no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <div className="p-6 mt-0">
                  <h3 className="font-semibold text-2xl mb-3">{selectedItemForComments.title}</h3>
                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium mr-3 ${selectedItemForComments.type === "Lost"
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                      }`}>
                      <i className={`fas ${selectedItemForComments.type === "Lost" ? "fa-search" : "fa-hand-holding"} mr-1`}></i>
                      {selectedItemForComments.type}
                    </span>
                    <i className="fas fa-university mr-1"></i>
                    <span className="truncate">{campusMap[selectedItemForComments.campusID] || 'Campus not specified'}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <i className="fas fa-map-marker-alt mr-2"></i>
                    <span className="truncate">{selectedItemForComments.location}</span>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-3 whitespace-pre-wrap break-words overflow-wrap-anywhere">{selectedItemForComments.description}</p>

                  <div className="text-xs text-gray-500 mb-0">
                    {new Date(selectedItemForComments.date + ' UTC').toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </div>
                </div>
              </div>

              <div className="p-3.5 border-t border-gray-200 flex-shrink-0 bg-white">
                <button
                  disabled={loadingStates[`${selectedItemForComments.type}-${selectedItemForComments.id}`] || claimedItems.includes(`${selectedItemForComments.type}-${selectedItemForComments.id}`)}
                  className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center ${claimedItems.includes(`${selectedItemForComments.type}-${selectedItemForComments.id}`)
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-black hover:bg-gray-900 text-white"
                    }`}
                  onClick={() => handleAction(
                    selectedItemForComments.type === "Lost" ? "Found" : "Claim",
                    selectedItemForComments.type,
                    selectedItemForComments
                  )}
                >
                  {loadingStates[`${selectedItemForComments.type}-${selectedItemForComments.id}`] ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : claimedItems.includes(`${selectedItemForComments.type}-${selectedItemForComments.id}`) ? (
                    selectedItemForComments.type === "Lost" ? "Already Found By You!" : "Already Claimed By You!"
                  ) : (
                    selectedItemForComments.type === "Lost" ? "Found This Item" : "Claim This Item"
                  )}
                </button>
              </div>
            </div>


            {/* Right side - Comments */}
            <div className="w-full md:w-1/2 flex flex-col h-full">
              {/* Header */}
              <div className="p-3 md:p-4 border-b border-gray-200 flex-shrink-0">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-center relative">
                  <div className="flex bg-gray-100 rounded-full p-1">
                    <button
                      onClick={() => setMobileTab("details")}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        mobileTab === "details"
                          ? "bg-white text-black shadow-sm"
                          : "text-gray-500"
                      }`}
                    >
                      Details
                    </button>
                    <button
                      onClick={() => setMobileTab("comments")}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        mobileTab === "comments"
                          ? "bg-white text-black shadow-sm"
                          : "text-gray-500"
                      }`}
                    >
                      Comments
                    </button>
                  </div>
                  <button
                    onClick={closeCommentsPanel}
                    className="absolute right-0 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <i className="fas fa-times text-gray-500 text-lg"></i>
                  </button>
                </div>

                {/* Desktop Header */}
                <div className="hidden md:flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden cursor-pointer" onClick={() => {
                    // If the clicked profile belongs to the logged-in user, go to their own profile page
                    if (user && String(user.rollno) === String(selectedItemForComments.user.rollNumber)) {
                      navigate('/profile');
                    } else {
                      const temp = encryptRollno(selectedItemForComments.user.rollNumber)
                      navigate(`/user/${temp}`);
                    }
                  }}
                  >
                    {selectedItemForComments.user?.avatar ? (
                      <img
                        src={selectedItemForComments.user.avatar}
                        alt={selectedItemForComments.user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <i className="fas fa-user text-gray-400 text-xs md:text-sm"></i>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-sm md:text-base flex items-center space-x-2">
                      <span>{selectedItemForComments.user.name}</span>
                      {verifiedRolls.includes(String(selectedItemForComments.user.rollNumber)) && (
                        <img src="/verfication_tag.png" alt="Verified" title="Verified User" className="w-4 h-4 object-contain" />
                      )}
                    </div>
                    <div className="text-xs md:text-sm text-gray-500">{new Date(selectedItemForComments.date + ' UTC').toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}</div>
                  </div>
                  </div>
                  <button
                    onClick={closeCommentsPanel}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <i className="fas fa-times text-gray-500 text-lg"></i>
                  </button>
                </div>
              </div>

              {/* Mobile Details Section */}
              {mobileTab === "details" && (
                <div className="md:hidden flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto p-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <h3 className="font-semibold text-xl mb-3">{selectedItemForComments.title}</h3>
                    
                    <div className="flex items-center text-gray-600 text-sm mb-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium mr-3 ${selectedItemForComments.type === "Lost"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                        }`}>
                        <i className={`fas ${selectedItemForComments.type === "Lost" ? "fa-search" : "fa-hand-holding"} mr-1`}></i>
                        {selectedItemForComments.type}
                      </span>
                      <i className="fas fa-university mr-1"></i>
                      <span className="truncate">{campusMap[selectedItemForComments.campusID] || 'Campus not specified'}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 text-sm mb-3">
                      <i className="fas fa-map-marker-alt mr-2"></i>
                      <span className="truncate">{selectedItemForComments.location}</span>
                    </div>

                    <div className="flex items-center text-gray-500 text-sm mb-4">
                      <i className="fas fa-calendar-alt mr-2"></i>
                      <span>{new Date(selectedItemForComments.date + ' UTC').toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}</span>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">{selectedItemForComments.description}</p>
                    </div>
                  </div>

                  <div className="p-4 border-t border-gray-200 flex-shrink-0 bg-white">
                    <button
                      disabled={loadingStates[`${selectedItemForComments.type}-${selectedItemForComments.id}`] || claimedItems.includes(`${selectedItemForComments.type}-${selectedItemForComments.id}`)}
                      className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center ${claimedItems.includes(`${selectedItemForComments.type}-${selectedItemForComments.id}`)
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-black hover:bg-gray-900 text-white"
                        }`}
                      onClick={() => handleAction(
                        selectedItemForComments.type === "Lost" ? "Found" : "Claim",
                        selectedItemForComments.type,
                        selectedItemForComments
                      )}
                    >
                      {loadingStates[`${selectedItemForComments.type}-${selectedItemForComments.id}`] ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Processing...
                        </>
                      ) : claimedItems.includes(`${selectedItemForComments.type}-${selectedItemForComments.id}`) ? (
                        selectedItemForComments.type === "Lost" ? "Already Found By You!" : "Already Claimed By You!"
                      ) : (
                        selectedItemForComments.type === "Lost" ? "Found This Item" : "Claim This Item"
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Comments Section - Scrollable (shown on desktop always, mobile only when comments tab active) */}
              <div className={`flex-1 overflow-y-auto p-3 md:p-4 min-h-0 ${mobileTab === "details" ? "hidden md:block" : ""}`}>
                <div className="space-y-4">
                  {selectedItemForComments.comments && selectedItemForComments.comments.length > 0 ? (
                    [...selectedItemForComments.comments]
                      .sort((a, b) => {
                        // Parse as UTC
                        const dateA = new Date(a.date.replace(' ', 'T') + 'Z');
                        const dateB = new Date(b.date.replace(' ', 'T') + 'Z');
                        // Asc order comments
                        return dateA - dateB;
                      })
                      .map((comment) => (
                      <div key={comment.id} className="flex items-start space-x-3 group parent-comment">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 cursor-pointer"
                          onClick={() => {
                            // If the clicked profile belongs to the logged-in user, go to their own profile page
                            if (user && String(user.rollno) === String(comment.user.rollNumber)) {
                              navigate('/profile');
                            } else {
                              const res = encryptRollno(comment.user.rollNumber)
                              navigate(`/user/${res}`);
                            }
                          }}
                        >
                          {comment.user?.avatar ? (
                            <img
                              src={comment.user.avatar}
                              alt={comment.user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                              <i className="fas fa-user text-gray-400 text-xs"></i>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              <span
                                className="font-medium text-sm truncate cursor-pointer hover:underline"
                                onClick={() => {
                                  if (user && String(user.rollno) === String(comment.user.rollNumber)) {
                                    navigate('/profile');
                                  } else {
                                    const res = encryptRollno(comment.user.rollNumber)
                                    navigate(`/user/${res}`);
                                  }
                                }}
                              >
                                {comment.user.name}
                              </span>
                              {verifiedRolls.includes(String(comment.user.rollNumber)) && (
                                <img src="/verfication_tag.png" alt="Verified" title="Verified User" className="w-4 h-4 object-contain" />
                              )}
                              <span className="text-xs text-gray-500 flex-shrink-0">
                                {new Date(comment.date + ' UTC').toLocaleString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: true
                                })}
                              </span>
                            </div>
                            {user && String(user.rollno) === String(comment.user.rollNumber) && (
                              <button
                                onClick={() => {
                                  setCommentToDelete(comment);
                                  setShowDeleteModal(true);
                                }}
                                className="text-red-500 hover:text-red-700 transition-colors p-1" // Always visible, red color
                                title="Delete comment"
                              >
                                <i className="fas fa-trash-alt text-xs"></i>
                              </button>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 break-words overflow-wrap-anywhere">{comment.text}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <i className="fas fa-comments text-gray-300 text-3xl mb-3"></i>
                      <p className="text-gray-500">No comments yet</p>
                      <p className="text-gray-400 text-sm">Be the first to comment!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Comment Form - hidden on mobile when details tab is active */}
              <div className={`p-3 md:p-4 border-t border-gray-200 flex-shrink-0 bg-white ${mobileTab === "details" ? "hidden md:block" : ""}`}>
                <CommentForm item={selectedItemForComments} />
              </div>


            </div>
          </div>
        </div>
      )}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setCommentToDelete(null);
        }}
        onConfirm={async () => {
          if (!commentToDelete) return;

          try {
            await commentService.deleteComment(commentToDelete.id, selectedItemForComments.type, user.rollno);
            // Update local state
            setSelectedItemForComments(prev => ({
              ...prev,
              comments: prev.comments.filter(c => c.id !== commentToDelete.id)
            }));
            toast.success("Comment deleted successfully");
            setShowDeleteModal(false);
            setCommentToDelete(null);
          } catch (error) {
            toast.error("Failed to delete comment");
          }
        }}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}
