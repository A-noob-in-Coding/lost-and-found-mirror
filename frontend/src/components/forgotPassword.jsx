import { useState, useRef, useEffect } from "react";
import { FaTimes, FaSync } from "react-icons/fa";
import toast from 'react-hot-toast';
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';

export default function ForgotPassword({
  setShowForgotPassword,
  setShowOtpPage,
}) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [captchaInput, setCaptchaInput] = useState("");
  const isSubmittingRef = useRef(false);
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    loadCaptchaEnginge(6, 'white', 'black', 'upper');
  }, []);

  const refreshCaptcha = () => {
    loadCaptchaEnginge(6, 'white', 'black', 'upper');
    setCaptchaInput("");
  };
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (isSubmittingRef.current || isLoading) {
      return;
    }

    // Validate captcha first
    if (!validateCaptcha(captchaInput)) {
      toast.error('Invalid captcha. Please try again.');
      refreshCaptcha();
      return;
    }

    isSubmittingRef.current = true;
    setIsLoading(true);

    try {
      // First check if user exists with this email
      const checkUserResponse = await fetch(`${VITE_API_URL}/api/users/check-email?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const userData = await checkUserResponse.json();

      if (!checkUserResponse.ok || !userData.exists) {
        toast.error('No account exists with this email address');
        return;
      }

      // If user exists, proceed with sending OTP
      const response = await fetch(`${VITE_API_URL}/api/otp/send-otp`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('OTP sent to your email');
        localStorage.setItem('resetEmail', email); // Store email for later use
        setShowForgotPassword(false);
        setShowOtpPage(true);
      } else if (response.status === 429) {
        toast.error(data.message || 'Too many requests. Please wait before trying again.');
      } else {
        toast.error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      toast.error('Failed to process your request');
    } finally {
      setIsLoading(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white shadow-2xl rounded-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-black">Reset Password</h3>
          <button
            onClick={() => setShowForgotPassword(false)}
            className="text-black-500 hover:text-black cursor-pointer"
          >
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleResetPassword}>
          <p className="text-gray-600 mb-6">
            Enter your email address and we'll send you an OTP to reset your
            password.
          </p>
          <div className="relative mb-6">
            <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
              required
            />
          </div>
          
          {/* Captcha Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-gray-100 rounded-lg p-2 flex-1">
                <LoadCanvasTemplate reloadText=" " />
              </div>
              <button
                type="button"
                onClick={refreshCaptcha}
                className="ml-2 p-2 text-gray-600 hover:text-black transition-colors"
                title="Refresh Captcha"
              >
                <FaSync />
              </button>
            </div>
            <div className="relative">
              <i className="fas fa-shield-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Enter captcha"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all uppercase"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-300 cursor-pointer flex items-center justify-center shadow-md hover:shadow-lg"
          >
            {isLoading ? <i className="fas fa-spinner fa-spin"></i> : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
