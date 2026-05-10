import { useState } from "react";
import { MdSend } from "react-icons/md";
import { useAuth } from "../context/authContext";
import toast from "react-hot-toast";
import PendingApprovalModal from "./pendingApprovalModal";
import API from "../services/api";

export default function CommentForm({ item }) {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Check if user exists before proceeding
    if (!user || !user.rollno) {
      toast.error("Please log in to add comments");
      return;
    }

    setIsSubmitting(true);


    const isLost = item.type === "Lost";
    const endpoint = isLost
      ? "/comment/addlostcomment"
      : "/comment/addfoundcomment";

    const body = isLost
      ? {
        lpostId: item.id,
        rollNo: user.rollno,
        comment: commentText,
      }
      : {
        fpostId: item.id,
        rollNo: user.rollno,
        comment: commentText,
      };

    try {
      const response = await API.post(endpoint, body);

      if (response.status === 200) {
        setCommentText("");
        // Only show pending approval modal if not auto-approved
        if (response.data.autoApproved) {
          toast.success("Comment posted successfully!");
        } else {
          setShowPendingModal(true);
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to add comment";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePendingModalClose = () => {
    setShowPendingModal(false);
  };

  return (
    <>
      <form className="flex items-center mt-3" onSubmit={handleAddComment}>
        <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
          {user && user.image_url ? (
            <img
              src={user.image_url}
              alt="You"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <i className="fas fa-user text-gray-400 text-xs"></i>
            </div>
          )}
        </div>
        <input
          type="text"
          placeholder={user ? "Add a comment..." : "Log in to comment..."}
          className="flex-1 px-3 py-1 text-sm border border-gray-200 rounded-full focus:outline-none focus:border-black"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          required
          disabled={isSubmitting || !user}
        />
        <button
          type="submit"
          disabled={isSubmitting || !user}
          className={`ml-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full transition-all transform ${isSubmitting || !user
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-200 hover:scale-105 active:scale-95"
            }`}
        >
          <MdSend
            className={`text-gray-500 transition-transform ${isSubmitting ? "animate-spin" : ""
              }`}
            size={24}
          />
        </button>
      </form>

      {/* Pending Approval Modal */}
      <PendingApprovalModal
        isOpen={showPendingModal}
        onClose={handlePendingModalClose}
        type="comment"
      />
    </>
  );
}
