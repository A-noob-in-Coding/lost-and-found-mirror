import React, { useState, useEffect, useRef } from "react";
import ChangePassword from "../components/changePassword";
import UserPostsGrid from "../components/userPostsGrid";
import UserCommentsGrid from "../components/userCommentsGrid";
import { useAuth } from "../context/authContext";
import { useUtil } from "../context/utilContext";
import Footer from "../utilities/footer";
import { useNavigate } from "react-router-dom";
import { MdEdit, MdAddAPhoto } from "react-icons/md";

import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import ProfilePostSkeleton from "../components/postProfileSkeleton";
import { useDeletePost, useUserPosts } from "../hooks/postHook";
import { useDeleteComment, useUserComments } from "../hooks/commentHook";

const ProfilePage = () => {
  const { user, updateUsername, updateProfileImage, updateCampus, updatePrivacy } = useAuth();
  const { data: userPosts = [], isloading: postsLoading, removePost } = useUserPosts(user?.rollno)
  const { data: userComments = [], isloading: commentsLoading, removeComment } = useUserComments(user?.rollno)
  const { campuses, isUserVerified } = useUtil()
  const [isloading, setisloading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' or 'comments'
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState("");
  const [showForgotPassword, setShowChangePassword] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingCampus, setIsEditingCampus] = useState(false);
  const [selectedCampusId, setSelectedCampusId] = useState("");
  const [showEditProfile, setShowEditProfile] = useState(false);
  const fileInputRef = useRef(null);
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [visibilityConfirmRoll, setVisibilityConfirmRoll] = useState("");
  const [visibilityLoading, setVisibilityLoading] = useState(false);
  const deletePostMutation = useDeletePost()
  const deleteCommentMutation = useDeleteComment()


  const submitNameChange = async () => {
    setisloading(true);
    await updateUsername(username);
    setisloading(false);
    setIsEditingName(false);
  };

  const handleNameKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await submitNameChange();
    } else if (e.key === "Escape") {
      setUsername(user?.name || "");
      setIsEditingName(false);
    }
  };

  const cancelNameChange = () => {
    setUsername(user?.name || "");
    setIsEditingName(false);
  };


  const onChangePrivacy = async () => {
    if (!visibilityConfirmRoll || visibilityConfirmRoll.trim() === '') {
      toast.error('Please enter your roll number to confirm');
      return;
    }
    if (visibilityConfirmRoll.trim() !== (user?.rollno || '').toString()) {
      toast.error('Roll number does not match. Action cancelled.');
      return;
    }

    try {
      setVisibilityLoading(true);
      const newType = user?.account_type === 'private' ? 'public' : 'private';
      await updatePrivacy(newType);
      toast.success(`Profile visibility changed to ${newType}`);
      setShowVisibilityModal(false);
      setVisibilityConfirmRoll('');
    } catch (error) {
      toast.error(error?.message || 'Failed to update visibility');
    } finally {
      setVisibilityLoading(false);
    }
  }

  const submitCampusChange = async () => {
    try {
      setisloading(true);
      const selectedCampus = campuses.find(c => c.campusID == selectedCampusId);
      if (selectedCampus) {
        await updateCampus(selectedCampusId, selectedCampus.campusName);
      }
      setIsEditingCampus(false);
    } catch (error) {
    } finally {
      setisloading(false);
    }
  };

  const cancelCampusChange = () => {
    setSelectedCampusId(user?.campus_id || "");
    setIsEditingCampus(false);
  };

  const handleProfileImageClick = () => {
    if ((3 - (user?.profile_changes_count || 0)) <= 0) {
      toast.error('You have reached your profile change limit for this month');
      return;
    }
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Check file size (limit to 3MB)
    if (file.size > 3 * 1024 * 1024) {
      alert('Image size should be less than 3MB');
      return;
    }

    try {
      setImageLoading(true);

      // Create a temporary URL for preview
      const tempUrl = URL.createObjectURL(file);
      setProfileImage(tempUrl);

      // Upload original image file
      await updateProfileImage(file);

    } catch (error) {
      toast.error("Error uploading image")
    } finally {
      setImageLoading(false);
    }
  };

  useEffect(() => {
    if (user?.image_url) {
      setProfileImage(user.image_url);
    }
    setUsername(user?.name || "");
    setSelectedCampusId(user?.campus_id || "");
  }, [user]);

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

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Logo and Navigation */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between w-full">
          <div className="flex items-center space-x-3 ml-4">
            <img
              src="/lf_logo.png"
              alt="Lost & Found Logo"
              className="h-10 w-10 rounded-full"
            />
            <h1 className="text-xl md:text-2xl font-bold text-black">FAST Lost & Found</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0 ml-auto mr-0">
            <button
              onClick={() => navigate("/feed")}
              className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-white hover:text-black border-2 border-black transition-all duration-300 hover:scale-110 transform"
            >
              Back to Feed
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-md text-gray-600 hover:text-black hover:bg-gray-100 transition-colors"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-4 py-3 space-y-2">
              <button
                onClick={() => {
                  navigate("/feed");
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center px-8 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i className="fas fa-home mr-3"></i>
                Back to Feed
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Profile Section */}
      <section className="py-8 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          {/* Profile Header */}
          <div className="flex flex-col items-center text-center mb-8">
            {/* Profile Image */}
            <div className="w-[128px] h-[128px] rounded-full overflow-hidden border-4 border-gray-200 shadow-md relative group mb-6">
              {imageLoading ? (
                <div className="flex items-center justify-center w-full h-full bg-gray-200">
                  <ClipLoader color="#000000" loading={true} size={40} />
                </div>
              ) : (
                <>
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover high-quality-img"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <i className="fas fa-user text-gray-400 text-5xl"></i>
                    </div>
                  )}
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full"
                    onClick={handleProfileImageClick}
                  >
                    <MdAddAPhoto className="text-white text-3xl" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                </>
              )}
            </div>

            {/* Profile Name */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <h2 className="text-2xl font-bold text-black">{username || user?.name}</h2>
              {isUserVerified(user?.rollno) && (
                <img src="/verfication_tag.png" alt="Verified" title="Verified User" className="w-5 h-5 object-contain" />
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center space-x-8 mb-6">
              <div className="text-center bg-gray-50 rounded-lg px-6 py-4 min-w-[80px]">
                <div className="text-2xl font-bold text-black">{userPosts.length}</div>
                <div className="text-sm text-gray-600">posts</div>
              </div>
              <div className="text-center bg-gray-50 rounded-lg px-6 py-4 min-w-[80px]">
                <div className="text-2xl font-bold text-black">{userComments.length}</div>
                <div className="text-sm text-gray-600">comments</div>
              </div>
            </div>

            {/* Edit Profile Button */}
            <button
              onClick={() => setShowEditProfile(true)}
              className="px-8 py-2 bg-gray-100 text-black font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Edit profile
            </button>
          </div>

          {/* Tab Toggle for Mobile */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200">
              <button
                onClick={() => setActiveTab('posts')}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${activeTab === 'posts'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-gray-600 hover:text-black hover:bg-gray-50'
                  }`}
              >
                <i className="fas fa-th-large mr-2"></i>
                Posts
              </button>
              <button
                onClick={() => setActiveTab('comments')}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${activeTab === 'comments'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-gray-600 hover:text-black hover:bg-gray-50'
                  }`}
              >
                <i className="fas fa-comments mr-2"></i>
                Comments
              </button>
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'posts' ? (
            postsLoading ? (
              <div className="py-4">
                <ProfilePostSkeleton cards={6} />
              </div>
            ) : (
              <UserPostsGrid
                userPosts={userPosts}
                deletePostMutation={deletePostMutation}
                onPostDeleted={removePost}
              />
            )
          ) : (
            commentsLoading ? (
              <div className="flex justify-center items-center py-16">
                <ClipLoader color="#000000" loading={true} size={40} />
              </div>
            ) : (
              <UserCommentsGrid
                userComments={userComments ? [...userComments].sort((a, b) => new Date(b.rawDate || b.date) - new Date(a.rawDate || a.date)) : []}
                deleteCommentMutation={deleteCommentMutation}
                onCommentDeleted={removeComment}
              />
            )
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Help Others?</h3>
          <p className="text-gray-300 mb-8 text-lg">
            Create a post to help someone find their lost item or report something you've found.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate("/createPost")}
              className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-all duration-300 hover:scale-105 transform"
            >
              Create Post
            </button>
            <button
              onClick={() => navigate("/feed")}
              className="border-2 border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-black transition-all duration-300 hover:scale-105 transform"
            >
              Browse Feed
            </button>
          </div>
        </div>
      </section>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 flex items-center justify-center z-20 bg-white bg-opacity-95">
          <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-black">Edit Profile</h2>
              <button
                onClick={() => setShowEditProfile(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              {/* Profile Changes Limit Alert */}
              <div className={`mb-6 p-4 rounded-lg flex items-center justify-between ${(3 - (user?.profile_changes_count || 0)) <= 0
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                <div className="flex items-center">
                  <i className={`fas ${(3 - (user?.profile_changes_count || 0)) <= 0 ? 'fa-exclamation-circle' : 'fa-info-circle'} mr-3 text-xl`}></i>
                  <div>
                    <p className="font-semibold">Profile Changes</p>
                    <p className="text-sm">
                      {(3 - (user?.profile_changes_count || 0)) <= 0
                        ? 'You have used all your profile changes for this month.'
                        : `You have ${3 - (user?.profile_changes_count || 0)} changes remaining this month.`
                      }
                    </p>
                  </div>
                </div>
                {user?.profile_changes_reset_date && (
                  <div className="text-xs opacity-75 text-right">
                    Reset on: <br />
                    {(() => {
                      const d = user.profile_changes_reset_date;
                      let parsedDate = d ? new Date(d.replace(' ', 'T')) : null;
                      if (!parsedDate || isNaN(parsedDate.getTime())) {
                        parsedDate = d ? new Date(d) : null;
                      }
                      return parsedDate && !isNaN(parsedDate.getTime())
                        ? parsedDate.toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'Invalid Date';
                    })()}
                  </div>
                )}
              </div>

              {/* Profile Image Section */}
              <div className="flex justify-center mb-8">
                <div className="w-[128px] h-[128px] rounded-full overflow-hidden border-4 border-gray-200 shadow-md relative group">
                  {imageLoading ? (
                    <div className="flex items-center justify-center w-full h-full bg-gray-200">
                      <ClipLoader color="#000000" loading={true} size={40} />
                    </div>
                  ) : (
                    <>
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover high-quality-img"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <i className="fas fa-user text-gray-400 text-5xl"></i>
                        </div>
                      )}
                      <div
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full"
                        onClick={handleProfileImageClick}
                      >
                        <MdAddAPhoto className="text-white text-3xl" />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* User Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
                <div className="bg-gray-50 rounded-2xl p-4 md:p-6">
                  <p className="text-sm text-gray-500 mb-2 font-medium">Roll Number</p>
                  <p className="text-base md:text-lg font-semibold text-black break-words">{user?.rollno}</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 md:p-6">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-500 font-medium">Full Name</p>
                    <button
                      onClick={() => {
                        if ((3 - (user?.profile_changes_count || 0)) <= 0) {
                          toast.error('Limit reached');
                          return;
                        }
                        setIsEditingName((prev) => !prev);
                      }}
                      className={`text-lg md:text-xl transition-colors p-1 ${(3 - (user?.profile_changes_count || 0)) <= 0
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-black hover:text-gray-600'
                        }`}
                      disabled={(3 - (user?.profile_changes_count || 0)) <= 0}
                    >
                      <MdEdit />
                    </button>
                  </div>

                  {isEditingName ? (
                    <div className="flex items-center w-full">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.slice(0, 20))}
                        maxLength={20}
                        className="text-base md:text-lg font-semibold w-full border border-gray-300 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition text-gray-900"
                        onKeyDown={handleNameKeyDown}
                        autoFocus
                        placeholder="Enter your name"
                      />
                      <span className="ml-2 text-xs text-gray-400 whitespace-nowrap">{username.length}/20</span>
                      {isloading && (
                        <ClipLoader color="#000000" loading={isloading} size={20} className="ml-2" />
                      )}
                    </div>
                  ) : (
                    <p className="text-base md:text-lg font-semibold text-black break-words">{username}</p>
                  )}
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 md:p-6">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-500 font-medium">Campus</p>
                    <button
                      onClick={() => {
                        if ((3 - (user?.profile_changes_count || 0)) <= 0) {
                          toast.error('Limit reached');
                          return;
                        }
                        setIsEditingCampus((prev) => !prev);
                      }}
                      className={`text-lg md:text-xl transition-colors p-1 ${(3 - (user?.profile_changes_count || 0)) <= 0
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-black hover:text-gray-600'
                        }`}
                      disabled={(3 - (user?.profile_changes_count || 0)) <= 0}
                    >
                      <MdEdit />
                    </button>
                  </div>

                  {isEditingCampus ? (
                    <div className="flex items-center w-full">
                      <select
                        value={selectedCampusId}
                        onChange={(e) => setSelectedCampusId(e.target.value)}
                        className="text-base md:text-lg font-semibold w-full border border-gray-300 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition appearance-none text-gray-900"
                        autoFocus
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                          backgroundPosition: 'right 0.5rem center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '1.5em 1.5em',
                          paddingRight: '2.5rem'
                        }}
                      >
                        <option value="">Select Campus</option>
                        {campuses.map((campus) => (
                          <option key={campus.campusID} value={campus.campusID}>
                            {campus.campusName}
                          </option>
                        ))}
                      </select>
                      {isloading && (
                        <ClipLoader color="#000000" loading={isloading} size={20} className="ml-2" />
                      )}
                    </div>
                  ) : (
                    <p className="text-base md:text-lg font-semibold text-black break-words">
                      {user?.campusName || (user?.campusID && campuses.find(c => c.campusID === user.campusID)?.campusName) || "Not Set"}
                    </p>
                  )}
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 md:p-6">
                  <p className="text-sm text-gray-500 mb-2 font-medium">Email Address</p>
                  <p className="text-base md:text-lg font-semibold text-black break-all">{user?.email}</p>
                </div>


              </div>

              {/* Action Buttons (stack on mobile, inline on md+) */}
              <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                {isEditingName || isEditingCampus ? (
                  <>
                    <button
                      className="w-full md:w-auto px-8 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-all duration-300 hover:scale-105 transform shadow-md"
                      onClick={async () => {
                        if (isEditingName) await submitNameChange();
                        if (isEditingCampus) await submitCampusChange();
                      }}
                    >
                      Save Changes
                    </button>
                    <button
                      className="w-full md:w-auto px-8 py-3 bg-white text-black border-2 border-black font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105 transform shadow-md"
                      onClick={() => {
                        if (isEditingName) cancelNameChange();
                        if (isEditingCampus) cancelCampusChange();
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="w-full md:w-auto px-8 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-all duration-300 hover:scale-105 transform shadow-md"
                      onClick={() => {
                        setShowChangePassword(true);
                        setShowEditProfile(false);
                      }}
                    >
                      Change Password
                    </button>
                    <button
                      className="w-full md:w-auto px-8 py-3 bg-white text-black border-2 border-black font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105 transform shadow-md"
                      onClick={() => {
                        setShowEditProfile(false);
                        setShowVisibilityModal(true);
                      }}
                    >
                      Change Visibility
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visibility Confirmation Modal */}
      {showVisibilityModal && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Confirm Visibility Change</h3>
              <button onClick={() => setShowVisibilityModal(false)} className="text-gray-500 hover:text-gray-700">×</button>
            </div>

            <p className="mb-4">Your profile is currently: <strong>{user?.account_type === 'private' ? 'Private' : 'Public'}</strong></p>
            <p className="mb-4">Type your roll number to confirm switching visibility to <strong>{user?.account_type === 'private' ? 'Public' : 'Private'}</strong>.</p>

            <input
              type="text"
              placeholder="Enter roll no to confirm (23L-XXXX)"
              value={visibilityConfirmRoll}
              onChange={(e) => setVisibilityConfirmRoll(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
            />

            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 rounded-md bg-gray-100 text-gray-800"
                onClick={() => {
                  setShowVisibilityModal(false);
                  setVisibilityConfirmRoll('');
                }}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 rounded-md bg-black text-white"
                onClick={onChangePrivacy}
              >
                {visibilityLoading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 flex items-center justify-center z-20 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
            <ChangePassword setShowChangePassword={setShowChangePassword} />
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProfilePage;
