import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SubmitPost from "../components/submitPost";

export default function CreatePostPage() {
  const [postType, setPostType] = useState("lost");
  const navigate = useNavigate();

  const handleBackToFeed = () => {
    navigate("/feed");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Layout */}
      <div className="block lg:hidden">
        <div className="max-w-md mx-auto py-8 rounded-md border-gray-100 px-4 sm:px-6">
          {/* Header with back button */}
          <div className="flex items-center mb-6">
            <button
              onClick={handleBackToFeed}
              className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Back to feed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold">Create New Post</h1>
          </div>

          {/* Post type selector */}
          <div className="mb-8">
            <div className="flex space-x-4 mb-6">
              <button
                className={`flex-1 py-3 rounded-lg font-medium text-sm transition-colors ${postType === "lost"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                onClick={() => setPostType("lost")}
                type="button"
              >
                <i className="fas fa-search mr-2"></i> Lost Item
              </button>
              <button
                className={`flex-1 py-3 rounded-lg font-medium text-sm transition-colors ${postType === "found"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                onClick={() => setPostType("found")}
                type="button"
              >
                <i className="fas fa-hand-holding mr-2"></i> Found Item
              </button>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="w-full max-w-sm mx-auto">
                <SubmitPost
                  postType={postType}
                  layout="mobile"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header with back button */}
          <div className="flex items-center mb-8">
            <button
              onClick={handleBackToFeed}
              className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Back to feed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-3xl font-bold">Create New Post</h1>
          </div>

          {/* Post type selector */}
          <div className="mb-8 max-w-md">
            <div className="flex space-x-4">
              <button
                className={`flex-1 py-3 rounded-lg font-medium text-sm transition-colors ${postType === "lost"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                onClick={() => setPostType("lost")}
                type="button"
              >
                <i className="fas fa-search mr-2"></i> Lost Item
              </button>
              <button
                className={`flex-1 py-3 rounded-lg font-medium text-sm transition-colors ${postType === "found"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                onClick={() => setPostType("found")}
                type="button"
              >
                <i className="fas fa-hand-holding mr-2"></i> Found Item
              </button>
            </div>
          </div>

          {/* Two Panel Layout */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <SubmitPost
              postType={postType}
              layout="desktop"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
