import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import toast from 'react-hot-toast';
import { useAuth } from "../context/authContext";
import { authService } from "../services/authService";
export default function ChangePassword({ setShowChangePassword }) {
  const [password, setpassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { user, logout } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
      let email = "";
      if (!user) {
        email = localStorage.getItem('resetEmail');

        // Check if OTP has been verified
        const isVerified = localStorage.getItem('otpVerified');
        if (!isVerified || isVerified !== 'true') {
          toast.error("OTP verification required");
          setIsLoading(false);
          return;
        }

      }

      else {
        email = user.email
      }
      await authService.changePassword(email, password)
      if (!user) {
        toast.success('Password reset successful');
        const claimedItems = localStorage.getItem('claimed_items');
        localStorage.removeItem('resetEmail');
        localStorage.removeItem('otpVerified');
        localStorage.removeItem('sb-fkuzxfligouemuxltptp-auth-token');
        if (claimedItems) {
          localStorage.setItem('claimed_items', claimedItems);
        }
        setShowChangePassword(false);
      } else {

        toast.success('Password changed. Logging out...');
        const claimedItems = localStorage.getItem('claimed_items');
        localStorage.removeItem('resetEmail');
        localStorage.removeItem('otpVerified');
        localStorage.removeItem('sb-fkuzxfligouemuxltptp-auth-token');
        if (claimedItems) {
          localStorage.setItem('claimed_items', claimedItems);
        }
        setTimeout(async () => {
          setShowChangePassword(false);
          await logout();
        }, 2000);
      }

    } catch (error) {
      toast.error(error.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-black">Reset Password</h3>
        <button
          onClick={() => setShowChangePassword(false)}
          className="text-black hover:text-gray-800"
        >
          <FaTimes />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
              placeholder="Enter new password"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <i className="fas fa-eye-slash"></i>
              ) : (
                <i className="fas fa-eye"></i>
              )}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
              placeholder="Confirm new password"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <i className="fas fa-eye-slash"></i>
              ) : (
                <i className="fas fa-eye"></i>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-300 cursor-pointer flex items-center justify-center shadow-md hover:shadow-lg"
        >
          {isLoading ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              <span>Resetting...</span>
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </div>
  );
}
