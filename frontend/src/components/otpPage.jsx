import { useState, useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { authService } from "../services/authService";
export default function OtpPage({
  setShowOtpPage,
  setShowChangePassword,
  formData,
  mode = "register"
}) {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState("");
  const [cooldownTime, setCooldownTime] = useState(0);
  const [hasResendedOnce, setHasResendedOnce] = useState(false);
  const cooldownIntervalRef = useRef(null);
  const navigate = useNavigate();


  useEffect(() => {
    let resolvedEmail = "";

    if (mode === "register") {
      resolvedEmail = formData?.email || "";
    } else if (mode === "reset") {
      resolvedEmail = localStorage.getItem("resetEmail") || "";
    }

    setEmail(resolvedEmail);

    // Cleanup cooldown interval on unmount
    return () => {
      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current);
      }
    };
  }, [mode, formData]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Move focus to next input if current field is filled
    if (element.value !== "" && index < 5) {
      const nextInput = element.nextSibling;
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    // Navigate to previous input on backspace if current field is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = e.target.previousSibling;
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();

    // Check if pasted content is all numbers and proper length
    if (/^\d+$/.test(pastedData) && pastedData.length <= 6) {
      const newOtp = [...otp];

      // Fill in the OTP fields
      for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
        newOtp[i] = pastedData[i];
      }

      setOtp(newOtp);

      // Focus the field after the last filled input
      const inputs = document.querySelectorAll('input[type="text"]');
      const lastIndex = Math.min(pastedData.length, 6) - 1;
      if (lastIndex < 5 && inputs[lastIndex + 1]) {
        inputs[lastIndex + 1].focus();
      }
    }
  };

  const startCooldown = () => {
    setCooldownTime(120);
    if (cooldownIntervalRef.current) {
      clearInterval(cooldownIntervalRef.current);
    }
    cooldownIntervalRef.current = setInterval(() => {
      setCooldownTime((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownIntervalRef.current);
          cooldownIntervalRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Email not found. Please try again.");
      return;
    }
    if (cooldownTime > 0) {
      return;
    }
    setIsResending(true);
    try {
      await authService.resendOtp(email);
      toast.success("OTP resent successfully");
      // Start cooldown after first successful resend
      if (!hasResendedOnce) {
        setHasResendedOnce(true);
      }
      startCooldown();
    } catch (error) {
      // Handle 429 rate limit error
      if (error.message && error.message.includes('wait')) {
        toast.error(error.message);
      } else {
        toast.error('Error sending OTP');
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleRegisterSubmit = async (enteredOtp) => {
    try {

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.fullName);
      formDataToSend.append("rollNo", formData.studentId);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("imageFile", formData.imageFile);
      formDataToSend.append("campusID", formData.campusId);
      formDataToSend.append("otp", enteredOtp);

      await authService.register(formDataToSend);

      toast.success("Registration completed successfully");
      localStorage.removeItem("resetEmail");
      navigate("/login"); // redirect
      return true;
    } catch (error) {
      toast.error(error.message || "Failed to complete registration");
      return false;
    }
  };

  const handleResetSubmit = async (enteredOtp) => {
    try {
      await authService.verifyOtp(email, enteredOtp);

      toast.success("OTP verified successfully");
      localStorage.setItem("otpVerified", "true"); // track verification
      setShowOtpPage(false);
      setShowChangePassword(true);
      return true;
    } catch (error) {
      toast.error(error.message || "Invalid OTP");
      return false;
    }
  };

  const handleSubmit = async () => {
    // Validate that all OTP fields are filled
    if (otp.some(digit => digit === "")) {
      toast.error("Please enter the complete OTP");
      return;
    }

    setIsLoading(true);
    const enteredOtp = otp.join('');

    let success = false;

    if (mode === "register") {
      success = await handleRegisterSubmit(enteredOtp);
    } else if (mode === "reset") {
      success = await handleResetSubmit(enteredOtp);
    }

    setIsLoading(false);
    return success;
  };

  return (
    <div className="flex justify-center w-full">
      <div className="max-w-md w-full">
        <div className="p-6">
          <div className="relative mb-6">
            <h3 className="text-xl font-semibold text-black text-center">
              {mode === "register" ? "Verify Registration" : "Verify Reset Password"}
            </h3>
            <button
              onClick={() => setShowOtpPage(false)}
              className="absolute top-0 right-0 text-black hover:text-gray-800"
            >
              <FaTimes />
            </button>
          </div>

          <p className="text-gray-600 mb-6 text-center">
            Enter the 6-digit OTP sent to{" "}
            <span className="font-medium">{email}</span>
          </p>

          <div className="flex justify-center items-center gap-3 mb-6">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={index === 0 ? handlePaste : null}
                className="w-10 h-12 text-center text-xl font-semibold bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
              />
            ))}
          </div>

          <button
            className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-300 cursor-pointer flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                <span>Verifying...</span>
              </>
            ) : (
              "Verify OTP"
            )}
          </button>

          <div className="mt-4 text-center">
            <button
              className={`text-sm transition-colors flex items-center justify-center mx-auto ${
                cooldownTime > 0 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-500 hover:text-black cursor-pointer'
              }`}
              onClick={handleResendOtp}
              disabled={isResending || cooldownTime > 0}
            >
              {isResending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Resending...</span>
                </>
              ) : cooldownTime > 0 ? (
                <span>Resend OTP in {cooldownTime}s</span>
              ) : (
                "Didn't receive code? Resend OTP"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
