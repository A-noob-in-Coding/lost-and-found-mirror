import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useUtil } from "../context/utilContext";
import { postService } from "../services/postService";
import ConfirmationModal from "./confirmationModal";
import toast from "react-hot-toast";

export default function UserPostsGrid({ userPosts, onPostDeleted, deletePostMutation, isOwner = true }) {
  const { user } = useAuth();
  const { campuses } = useUtil();
  const navigate = useNavigate();
  const [deletingPosts, setDeletingPosts] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  const campusMap = useMemo(
    () => Object.fromEntries(campuses.map(c => [c.campusID, c.campusName])),
    [campuses]
  );

  const openPostDetail = (post) => {
    setSelectedPost(post);
  };

  const closePostDetail = () => {
    setSelectedPost(null);
  };

  const handleDeletePost = async (post) => {
    setPostToDelete(post);
    setShowDeleteConfirm(true);
  };

  const confirmDeletePost = async () => {
    if (!postToDelete) return;

    setShowDeleteConfirm(false);
    setDeletingPosts(prev => ({ ...prev, [postToDelete.id]: true }));

    try {
      await deletePostMutation.mutateAsync({
        postId: postToDelete.id,
        postType: postToDelete.type,
        rollno: user?.rollno
      });
      toast.success(`${postToDelete.type} post deleted successfully`);
      if (onPostDeleted) {
        onPostDeleted(postToDelete.id);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete post');
    } finally {
      setDeletingPosts(prev => ({ ...prev, [postToDelete.id]: false }));
      setPostToDelete(null);
    }
  };

  const cancelDeletePost = () => {
    setShowDeleteConfirm(false);
    setPostToDelete(null);
  };

  if (!userPosts || userPosts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-th-large text-gray-400 text-xl"></i>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Posts Yet</h3>
        <p className="text-gray-500 text-sm max-w-md mx-auto">Help your community! Share lost items you've found or post about items you've lost.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {userPosts.map((post) => (
          <div
            key={`${post.type}-${post.id}`}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden"
          >
            {/* Post Image */}
            <div className="aspect-square overflow-hidden">
              <img
                src={post.image || "/no_prev_img.png"}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Post Content */}
            <div className="p-4">
              {/* Post Type Badge and Actions */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${post.type === "Lost"
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                      }`}
                  >
                    <i className={`fas ${post.type === "Lost" ? "fa-search" : "fa-hand-holding"} mr-1`}></i>
                    {post.type}
                  </span>
                  {(post.isVerified !== undefined || post.isverified !== undefined) && (
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded ${(post.isVerified === false || post.isverified === false) ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}
                    >
                      {(post.isVerified === false || post.isverified === false) ? 'Unverified' : 'Verified'}
                    </span>
                  )}
                </div>

                {/* Delete Button (only shown to owner) */}
                {isOwner && (
                  <button
                    onClick={() => handleDeletePost(post)}
                    disabled={deletingPosts[post.id]}
                    className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete post"
                  >
                    {deletingPosts[post.id] ? (
                      <i className="fas fa-spinner fa-spin text-sm"></i>
                    ) : (
                      <i className="fas fa-trash text-sm"></i>
                    )}
                  </button>
                )}
              </div>

              {/* Title */}
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{post.title}</h3>

              {/* Location and Campus */}
              <div className="space-y-1 mb-3">
                <div className="flex items-center text-gray-600 text-sm">
                  <i className="fas fa-map-marker-alt mr-2 text-gray-400"></i>
                  <span className="truncate">{post.location}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <i className="fas fa-university mr-2 text-gray-400"></i>
                  <span className="truncate">{campusMap[post.campusID] || campusMap[post.campusid] || 'Campus not specified'}</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-3 overflow-hidden">
                <p className="text-sm text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">
                  {post.description}
                </p>
                {post.description && post.description.length > 40 && (
                  <button
                    onClick={() => openPostDetail(post)}
                    className="text-blue-600 text-xs font-medium mt-1 hover:underline"
                  >
                    Show more
                  </button>
                )}
              </div>

              {/* Date */}
              <div className="text-xs text-gray-400">
                {post.date ? new Date(post.date.replace(' ', 'T') + 'Z').toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : 'No date'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={cancelDeletePost}
        onConfirm={confirmDeletePost}
        title="Delete Post"
        message={postToDelete ? `Are you sure you want to delete this ${postToDelete.type} post? This action cannot be undone.` : ""}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Post Detail Panel */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closePostDetail}>
          <div 
            className="bg-white/95 backdrop-blur rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col md:flex-row h-full max-h-[85vh]">
              {/* Left - Image */}
              <div className="md:w-1/2 bg-gray-100 flex-shrink-0">
                <img
                  src={selectedPost.image || "/no_prev_img.png"}
                  alt={selectedPost.title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>

              {/* Right - Content */}
              <div className="md:w-1/2 flex flex-col max-h-[85vh] md:max-h-full">
                {/* Header with close button */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${selectedPost.type === "Lost"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                      }`}
                    >
                      <i className={`fas ${selectedPost.type === "Lost" ? "fa-search" : "fa-hand-holding"} mr-2`}></i>
                      {selectedPost.type}
                    </span>
                    {(selectedPost.isVerified !== undefined || selectedPost.isverified !== undefined) && (
                      <span
                        className={`text-sm font-medium px-3 py-1 rounded-full ${(selectedPost.isVerified === false || selectedPost.isverified === false) ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {(selectedPost.isVerified === false || selectedPost.isverified === false) ? 'Unverified' : 'Verified'}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={closePostDetail}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <i className="fas fa-times text-gray-500"></i>
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900">{selectedPost.title}</h2>

                  {/* Location and Campus */}
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <i className="fas fa-map-marker-alt mr-3 text-gray-400 w-5"></i>
                      <span>{selectedPost.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <i className="fas fa-university mr-3 text-gray-400 w-5"></i>
                      <span>{campusMap[selectedPost.campusID] || campusMap[selectedPost.campusid] || 'Campus not specified'}</span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <i className="fas fa-calendar-alt mr-3 text-gray-400 w-5"></i>
                      <span>
                        {selectedPost.date ? new Date(selectedPost.date.replace(' ', 'T') + 'Z').toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'No date'}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="pt-3 border-t border-gray-100 pb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
                    <p className="text-gray-600 whitespace-pre-wrap break-words">{selectedPost.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
