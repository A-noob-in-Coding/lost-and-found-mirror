import React, { useState } from 'react';

const PostVerificationForm = ({ post, onApprove, onReject }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  return (
    <div className="bg-gray-50 rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 md:flex md:flex-col">
      <div className="h-48 overflow-hidden md:h-40">
        <img
          src={post.image_url}
          alt={post.title}
          className="w-full h-full object-cover object-top"
        />
      </div>
      <div className="p-4 flex flex-col justify-between flex-grow overflow-hidden">
        <h3 className="text-lg font-bold text-gray-800 mb-2 break-words overflow-wrap-anywhere">{post.title}</h3>
        <p className="text-sm text-gray-600 mb-2">
          <i className="fas fa-map-marker-alt mr-2"></i>
          {post.location}
        </p>
        <div className="mb-4">
          <p className={`text-sm text-gray-700 break-words overflow-wrap-anywhere ${!showFullDescription ? "line-clamp-3" : ""}`}>
            {post.description}
          </p>
          {post.description && post.description.length > 100 && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-blue-600 text-xs font-medium mt-1 hover:underline"
            >
              {showFullDescription ? "Show less" : "Show more"}
            </button>
          )}
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => onApprove(post.id)}
            className="!rounded-button whitespace-nowrap bg-black text-white px-4 py-2 text-sm font-medium flex items-center cursor-pointer"
          >
            <i className="fas fa-check mr-2"></i>
            Approve
          </button>
          <button
            onClick={() => onReject(post.id)}
            className="!rounded-button whitespace-nowrap bg-black text-white px-4 py-2 text-sm font-medium flex items-center cursor-pointer"
          >
            <i className="fas fa-times mr-2"></i>
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostVerificationForm;
