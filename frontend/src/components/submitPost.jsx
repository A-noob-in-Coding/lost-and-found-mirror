import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/authContext";
import { useUtil } from "../context/utilContext";
import { useNavigate } from "react-router-dom";
import { postService } from "../services/postService";
import PendingApprovalModal from "./pendingApprovalModal";
import imageCompression from 'browser-image-compression';
export default function SubmitPost({ postType, layout = "mobile" }) {
  const [isFormSend, setIsFormSend] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const { campuses, categories } = useUtil()
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    campusID: "",
    category_id: "",
    rollNo: "",
    description: "",
    imageFile: null,
  });
  const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

  const handleSubmitPost = async (e) => {
    if (isFormSend) return; // Prevent multiple submissions
    e.preventDefault();
    setIsFormSend(true); // Set to true to prevent multiple submissions
    setError("");

    if (!user || !user.rollno) {
      toast.error("Please log in to post an item");
      setIsFormSend(false);
      return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("campusID", formData.campusID);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("image", formData.imageFile);
    formDataToSend.append("category_id", formData.category_id);
    formDataToSend.append("rollno", user.rollno);

    try {
      const response = await postService.createPost(formDataToSend, postType);
      // Only show pending approval modal if not auto-approved
      if (response.autoApproved) {
        toast.success("Post published successfully!");
        navigate("/feed");
      } else {
        setShowPendingModal(true);
      }
      setIsFormSend(false);
    } catch (error) {
      const errorMessage = error?.message || "An error occurred while posting the item";
      toast.error(errorMessage);
      setIsFormSend(false);
    }
  };

  const handlePendingModalClose = () => {
    setShowPendingModal(false);
    navigate("/feed");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const validateFile = (file) => {
    if (!file) return false;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError("Please upload a JPEG, PNG, or WEBP image file.");
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image size must be less than 1MB");
      return false;
    }

    return true;
  };

  const handleImageChange = async (e) => {
    let file = e.target.files[0];
    if (!file) return;

    // Compress if > 1MB
    if (file.size > MAX_FILE_SIZE) {
      try {
        file = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        });
      } catch (err) {
        setError("Image compression failed");
        return;
      }
    }

    if (validateFile(file)) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
      }));
      setError("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
      }));
    }
  };

  return (
    <>
      {layout === "mobile" ? (
        // Mobile Layout (single column)
        <form onSubmit={handleSubmitPost} className="space-y-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-sm"
              placeholder={`${postType} item title...`}
              required
              onChange={handleInputChange}
              name="title"
              maxLength={20}
            />
            <p className="text-xs text-gray-500 mt-1 text-right">{formData.title.length}/20</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-sm appearance-none bg-white"
              required
              onChange={handleInputChange}
              name="category_id"
              defaultValue=""
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Campus
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-sm appearance-none bg-white"
              required
              onChange={handleInputChange}
              name="campusID"
              defaultValue=""
            >
              <option value="" disabled>Select your campus</option>
              {campuses.map((campus) => (
                <option key={campus.campusID} value={campus.campusID}>
                  {campus.campusName}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-sm"
              placeholder="Where was it lost/found?"
              required
              onChange={handleInputChange}
              name="location"
              maxLength={20}
            />
            <p className="text-xs text-gray-500 mt-1 text-right">{formData.location.length}/20</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-sm"
              placeholder="Describe the item..."
              rows={4}
              required
              name="description"
              onChange={handleInputChange}
              maxLength={200}
            ></textarea>
            <p className="text-xs text-gray-500 mt-1 text-right">{formData.description.length}/200</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Item Image (JPEG, PNG, or WEBP, max 1MB)
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerFileInput}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
              />

              {imagePreview ? (
                <div className="relative flex justify-center items-center h-auto w-40 mx-auto">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="object-cover w-32 h-32 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      URL.revokeObjectURL(imagePreview);
                      setImagePreview(null);
                      setFormData((prev) => ({ ...prev, imageFile: null }));
                    }}
                    className="absolute top-0 right-0 transform -translate-x-2 -translate-y-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all"
                    title="Remove image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-400">
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                    <path d="m9 15 3-3 3 3"></path>
                    <path d="M12 12v9"></path>
                    <path d="M16 5h6"></path>
                    <path d="M19 2v6"></path>
                  </svg>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      Drag and drop an image or click to browse
                    </p>
                    <p className="text-sm text-gray-500">
                      JPEG, PNG, or WEBP (max 1MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div className="flex space-x-4 mt-6">
            <button
              type="button"
              onClick={() => navigate("/feed")}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isFormSend}
              className="flex-1 py-3 bg-black text-white rounded-lg font-medium text-sm hover:bg-gray-900 transition-colors whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isFormSend ? "Posting..." : `Post ${postType} item`}
            </button>
          </div>
        </form>
      ) : (
        // Desktop Layout (two columns)
        <form onSubmit={handleSubmitPost} className="grid grid-cols-2 min-h-[600px]">
          {/* Left Panel - Form */}
          <div className="p-8 space-y-6 bg-white border-r border-gray-200">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                  placeholder={`${postType} item title...`}
                  required
                  onChange={handleInputChange}
                  name="title"
                  maxLength={20}
                />
                <p className="text-xs text-gray-500 mt-1 text-right">{formData.title.length}/20</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm appearance-none bg-white"
                  required
                  onChange={handleInputChange}
                  name="category_id"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.map((category) => (
                    <option key={category.category_id} value={category.category_id}>
                      {category.category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campus
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm appearance-none bg-white"
                  required
                  onChange={handleInputChange}
                  name="campusID"
                  defaultValue=""
                >
                  <option value="" disabled>Select your campus</option>
                  {campuses.map((campus) => (
                    <option key={campus.campusID} value={campus.campusID}>
                      {campus.campusName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                  placeholder="Where was it lost/found?"
                  required
                  onChange={handleInputChange}
                  name="location"
                  maxLength={20}
                />
                <p className="text-xs text-gray-500 mt-1 text-right">{formData.location.length}/20</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                  placeholder="Describe the item..."
                  rows={5}
                  required
                  name="description"
                  onChange={handleInputChange}
                  maxLength={200}
                ></textarea>
                <p className="text-xs text-gray-500 mt-1 text-right">{formData.description.length}/200</p>
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/feed")}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isFormSend}
                className="flex-1 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isFormSend ? "Posting..." : `Post ${postType} item`}
              </button>
            </div>
          </div>

          {/* Right Panel - Image Upload */}
          <div className="bg-gray-50 p-8 flex flex-col">
            <div className="space-y-4 flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Item Image (JPEG, PNG, or WEBP, max 1MB)
              </label>

              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 flex-1 flex flex-col justify-center min-h-[400px] ${isDragging
                  ? "border-blue-500 bg-blue-50 scale-[1.02]"
                  : "border-gray-300 hover:border-gray-400 hover:bg-white hover:shadow-sm"
                  }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                />

                {imagePreview ? (
                  <div className="relative flex justify-center items-center">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full max-h-96 object-contain rounded-lg shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        URL.revokeObjectURL(imagePreview);
                        setImagePreview(null);
                        setFormData((prev) => ({ ...prev, imageFile: null }));
                      }}
                      className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all shadow-lg"
                      title="Remove image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-400">
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                      <path d="m9 15 3-3 3 3"></path>
                      <path d="M12 12v9"></path>
                      <path d="M16 5h6"></path>
                      <path d="M19 2v6"></path>
                    </svg>
                    <div className="space-y-3">
                      <p className="text-lg text-gray-600 font-medium">
                        Drag and drop an image here
                      </p>
                      <p className="text-gray-500">
                        or click to browse your files
                      </p>
                      <p className="text-sm text-gray-400">
                        JPEG, PNG, or WEBP (max 1MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
          </div>
        </form>
      )}

      {/* Pending Approval Modal */}
      <PendingApprovalModal
        isOpen={showPendingModal}
        onClose={handlePendingModalClose}
        type="post"
      />
    </>
  );
}
