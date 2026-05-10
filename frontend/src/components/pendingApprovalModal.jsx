import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

const PendingApprovalModal = ({ isOpen, onClose, type = 'post' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (!isOpen) {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getMessage = () => {
    if (type === 'comment') {
      return {
        title: "Comment Submitted for Approval",
        message: "Your comment is pending admin approval. Once it's approved, you will see your comment on the feed. You can also check the verification status in your profile section. Thank you for your patience."
      };
    }
    return {
      title: "Post Submitted for Approval",
      message: "Your post is pending admin approval. Once it's approved, you will see your post on your feed. You can also check the verification status in your profile section. Thank you for your patience."
    };
  };

  const { title, message } = getMessage();

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white border-2 border-black rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
        >
          <i className="fas fa-times text-lg"></i>
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
            <i className="fas fa-clock text-white text-2xl"></i>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-black mb-4">
          {title}
        </h2>

        {/* Message */}
        <p className="text-gray-700 text-center mb-6 leading-relaxed">
          {message}
        </p>

        {/* Status indicator */}
        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center">
            <div className="flex-shrink-0">
              <i className="fas fa-info-circle text-black mr-3"></i>
            </div>
            <div>
              <p className="text-sm text-black font-medium">
                <strong>Status:</strong> Pending Admin Approval
              </p>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-all duration-300 hover:scale-105 transform border-2 border-black"
          >
            Got It
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PendingApprovalModal;