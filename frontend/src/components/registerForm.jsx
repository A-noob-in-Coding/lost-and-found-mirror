import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useUtil } from "../context/utilContext.jsx";
import { extractRollNo, validateEmail } from "../utilities/methods.js";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { termsAndConditions } from "../data/terms.js";

export default function RegisterForm({
  formData,
  setFormData,
  setShowOtpPage
}) {
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [captchaError, setCaptchaError] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const { campuses } = useUtil();
  const navigate = useNavigate()
  const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
  const [emailError, setEmailError] = useState("");
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  // Extract roll number whenever email changes
  useEffect(() => {
    if (formData.email) {
      const isValid = validateEmail(formData.email);

      if (!isValid) {
        setEmailError("Please enter a valid university email address");
        setFormData((prev) => ({
          ...prev,
          studentId: "",
        }));
      } else {
        setEmailError("");
        const extractedRollNo = extractRollNo(formData.email);
        if (extractedRollNo) {
          setFormData((prev) => ({
            ...prev,
            studentId: extractedRollNo,
          }));
        } else {
          setEmailError("Unable to extract Student ID from this email");
        }
      }
    } else {
      setEmailError("");
      setFormData((prev) => ({
        ...prev,
        studentId: "",
      }));
    }
  }, [formData.email]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "password") {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
      if (!passwordRegex.test(value)) {
        setError(
          "Password must be at least 8 characters long, include 1 capital letter and 1 special character"
        );
      } else {
        setError("");
      }
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateFile = (file) => {
    if (!file) return false;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError("Please upload a JPEG, PNG, or WEBP image file.");
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image size must be less than 3MB");
      return false;
    }

    return true;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
      setError("");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };



  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate terms
    if (!termsAccepted) {
      setError("You must accept the Terms and Conditions to register");
      return;
    }

    // Validate captcha
    if (!captchaValue) {
      setError("Please complete the captcha");
      setCaptchaError(true);
      return;
    }

    if (formData.password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.studentId) {
      setError("Please enter a valid university email to extract Student ID");
      return;
    }

    setIsLoading(true);
    try {
      // Check if email already exists
      const checkEmailResponse = await fetch(`${VITE_API_URL}/api/users/check-email?email=${encodeURIComponent(formData.email)}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const emailData = await checkEmailResponse.json();

      if (checkEmailResponse.ok && emailData.exists) {
        toast.error('An account with this email already exists');
        setIsLoading(false);
        return;
      }

      await authService.resendOtp(formData.email);
      toast.success("OTP sent to your email!");
      setShowOtpPage(true);
    } catch (error) {
      toast.error(error.message || "Error while initiating registration");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="space-y-6 w-full">
      {error && (
        <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 p-1 lg:p-6 rounded-lg">
          {/* Left Section - Form Fields */}
          <div className="space-y-3 lg:space-y-4">
            <h2 className="text-base lg:text-lg font-semibold text-gray-800 mb-3 lg:mb-4">Account Information</h2>

            {/* Full Name */}
            <div>
              <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1.5 lg:mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange({ target: { name: 'fullName', value: e.target.value.slice(0, 20) } })}
                  maxLength={20}
                  className="w-full px-2.5 lg:px-4 py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-sm lg:text-base"
                  placeholder="Enter your full name"
                  required
                />
                <span className="absolute right-2.5 lg:right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">{formData.fullName.length}/20</span>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1.5 lg:mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-2.5 lg:px-4 py-2.5 lg:py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 text-sm lg:text-base ${emailError && formData.email
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-black"
                  }`}
                placeholder="Enter your university email address"
                required
              />
              {emailError && formData.email && (
                <p className="mt-1 text-xs text-red-600 break-words">
                  {emailError}
                </p>
              )}
            </div>

            {/* Student ID - Display Only */}
            <div>
              <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1.5 lg:mb-2">
                Student ID <span className="text-red-500">*</span>
              </label>
              <div className={`w-full px-2.5 lg:px-4 py-2.5 lg:py-3 border rounded-lg text-sm lg:text-base ${emailError && formData.email
                ? "border-red-200 bg-red-50 text-red-700"
                : formData.studentId
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-gray-200 bg-gray-50 text-gray-500"
                }`}>
                {emailError && formData.email ? (
                  <span className="flex items-center">
                    <i className="fas fa-exclamation-circle mr-2 flex-shrink-0 text-sm"></i>
                    <span className="break-words text-xs lg:text-sm">{emailError}</span>
                  </span>
                ) : formData.studentId ? (
                  <span className="flex items-center font-medium">
                    <i className="fas fa-check-circle mr-2 flex-shrink-0 text-sm"></i>
                    <span className="text-xs lg:text-sm">{formData.studentId}</span>
                  </span>
                ) : (
                  <span className="text-xs lg:text-sm">Enter valid University email to extract Student ID</span>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Student ID is automatically extracted from your email address
              </p>
            </div>

            {/* Campus */}
            <div>
              <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1.5 lg:mb-2">
                Campus <span className="text-red-500">*</span>
              </label>
              <select
                name="campusId"
                value={formData.campusId || ""}
                onChange={handleInputChange}
                className="w-full px-2.5 lg:px-4 py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 appearance-none bg-white text-sm lg:text-base"
                required
              >
                <option value="" disabled>Select your campus</option>
                {campuses.map((campus) => (
                  <option key={campus.campusID} value={campus.campusID}>
                    {campus.campusName}
                  </option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1.5 lg:mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={() => setShowPasswordRequirements(true)}
                  onBlur={() => setShowPasswordRequirements(false)}
                  className="w-full px-2.5 lg:px-4 py-2.5 lg:py-3 pr-10 lg:pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-sm lg:text-base"
                  placeholder="Create a strong password"
                  required
                  pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$"
                  title="Password must be at least 8 characters long, include 1 capital letter, 1 special character, and 1 digit"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-2.5 lg:pr-3 flex items-center"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm lg:text-base text-gray-400 hover:text-gray-600`}></i>
                </button>
              </div>
              {showPasswordRequirements && (
                <div className="mt-2 p-2.5 lg:p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-xs lg:text-sm font-medium text-blue-800 mb-2">Password requirements:</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• At least 8 characters long</li>
                    <li>• Must contain 1 capital letter</li>
                    <li>• Must contain 1 special character (!@#$%^&*)</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1.5 lg:mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (e.target.value !== formData.password) {
                      setError("Passwords do not match");
                    } else {
                      setError("");
                    }
                  }}
                  className="w-full px-2.5 lg:px-4 py-2.5 lg:py-3 pr-10 lg:pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-sm lg:text-base"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-2.5 lg:pr-3 flex items-center"
                >
                  <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm lg:text-base text-gray-400 hover:text-gray-600`}></i>
                </button>
              </div>
            </div>
          </div>

          {/* Right Section - Image Upload */}
          <div className="space-y-4 lg:space-y-6">
            <h2 className="text-base lg:text-lg font-semibold text-gray-800 mb-3 lg:mb-4">Profile Image</h2>

            <div className="space-y-3 lg:space-y-4">


              <div
                className={`relative border-2 border-dashed rounded-xl p-4 lg:p-8 text-center cursor-pointer transition-all duration-300 ${isDragging
                  ? "border-black bg-gray-50 scale-105"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
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
                  <div className="space-y-3 lg:space-y-4">
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Profile Preview"
                        className="mx-auto h-28 w-28 lg:h-40 lg:w-40 object-cover rounded-full border-4 border-white shadow-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                        <i className="fas fa-camera text-white text-xl lg:text-2xl"></i>
                      </div>
                    </div>
                    <div className="space-y-1 lg:space-y-2">
                      <p className="text-xs lg:text-sm font-medium text-gray-700">Looking good!</p>
                      <p className="text-xs text-gray-500">
                        Click to change your profile image
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 lg:space-y-4">
                    <div className="mx-auto h-14 w-14 lg:h-20 lg:w-20 bg-gray-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-cloud-upload-alt text-2xl lg:text-3xl text-gray-400"></i>
                    </div>
                    <div className="space-y-1 lg:space-y-2">
                      <p className="text-sm lg:text-base font-medium text-gray-700">
                        Drop your image here
                      </p>
                      <p className="text-xs lg:text-sm text-gray-500">
                        or <span className="text-black font-medium">browse</span> to upload
                      </p>
                      <p className="text-xs text-gray-400">
                        JPEG, PNG, or WEBP (max 3MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 lg:p-4">
                <div className="flex">
                  <i className="fas fa-question-circle text-blue-400 mt-0.5 mr-2 flex-shrink-0 text-sm"></i>
                  <div className="text-xs lg:text-sm">
                    <p className="text-blue-700 mt-1">
                      Having issues while registering? Feel free to <span onClick={() => navigate("/contact")} className="font-bold underline cursor-pointer">contact us.</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="bg-gray-50 rounded-lg p-3 lg:p-4 border border-gray-100">
              <div className="flex items-start">
                <div className="flex items-center h-5 flex-shrink-0">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
                </div>
                <div className="ml-2.5 lg:ml-3 text-xs lg:text-sm">
  <label htmlFor="terms" className="font-medium text-gray-700">
    I agree to the{" "}
    <a
      href="/terms"
      className="text-black underline hover:text-gray-700"
    >
      Terms and Conditions
    </a>{" "}
    and{" "}
    <a
      href="/privacy"
      className="text-black underline hover:text-gray-700"
    >
      Privacy Policy
    </a>
  </label>
  <p className="text-gray-500 text-xs mt-0.5">
    You must accept our terms to create an account.
  </p>
</div>

              </div>
            </div>
            {/* reCAPTCHA */}
            <div className="mt-4 lg:mt-6 flex justify-center -mx-3 lg:mx-0">
              <div className="scale-[0.77] sm:scale-90 lg:scale-100 origin-center">
                <HCaptcha
                  sitekey={import.meta.env.VITE_HCAPTCHA_SITE_KEY}
                  onVerify={(token, ekey) => {
                    setCaptchaValue(token);
                    setError("");
                    setCaptchaError(false);
                  }}
                />
              </div>
            </div>          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 lg:mt-8 pt-4 lg:pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2.5 lg:py-3 px-4 bg-black text-white font-medium rounded-lg transition-all duration-300 text-sm lg:text-base ${isLoading
              ? "opacity-70 cursor-not-allowed"
              : "hover:bg-gray-800"
              }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <i className="fas fa-spinner fa-spin"></i>
                <span>Creating Account...</span>
              </div>
            ) : (
              "Create Account"
            )}
          </button>

          <div className="text-center mt-3 lg:mt-4">
            <p className="text-xs lg:text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => window.location.href = '/login'}
                className="text-black font-medium hover:underline focus:outline-none"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </form>

    
    </div>
  );
}
