import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import HCaptcha from "@hcaptcha/react-hcaptcha";

export default function LoginForm({ setShowForgotPassword }) {
  const navigate = useNavigate(); // Fixed typo in navigate
  const { login, user } = useAuth(); // Import login function from auth context
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(""); // Added error state
  const [captchaValue, setCaptchaValue] = useState(null);
  const [captchaError, setCaptchaError] = useState(false);

  useEffect(() => {
  }, [user]);


  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Validate captcha
    if (!captchaValue) {
      setError("Please complete the captcha");
      setCaptchaError(true);
      return;
    }

    setIsLoading(true); // Start loading

    setTimeout(async () => {
      try {
        const success = await login(email, password);
        if (success) {
          const from = location.state?.from?.pathname || "/feed";
          navigate(from, { replace: true });
        } else {
          setError("Invalid credentials");
        }
      } catch (error) {
        setError("Invalid credentials");
      } finally {
        setIsLoading(false); // Stop loading
      }
    }, 1);
  };

  const onCaptchaChange = (value) => {
    setCaptchaValue(value);
    setError(""); // Clear error when captcha is completed
    setCaptchaError(false); // Clear captcha error highlight
  };
  return (
    <form onSubmit={handleLogin} className="space-y-6">
      {error && (
        <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
          {error}</div>
      )}
      <div className="relative">
        <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        <input
          type="email"
          placeholder="University Email (e.g., l23xxxx@lhr.nu.edu.pk)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
          required
        />
      </div>
      <div className="relative">
        <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full pl-10 pr-10 py-3 bg-gray-100 border-none rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
        </button>
      </div>

      {/* reCAPTCHA */}
      <div className="flex justify-center px-2">
        <HCaptcha
          sitekey={import.meta.env.VITE_HCAPTCHA_SITE_KEY}
          onVerify={onCaptchaChange}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center justify-center shadow-md hover:shadow-lg"
      >
        {isLoading ? <i className="fas fa-spinner fa-spin"></i> : "Login"}
      </button>
      <div className="flex justify-between text-sm">
             
        <button
          type="button"
          onClick={() => setShowForgotPassword(true)}
          className="text-gray-500 hover:text-black transition-colors cursor-pointer"
        >
          Forgot Password?
        </button>
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="text-gray-500 hover:text-black transition-colors cursor-pointer"
        >
          Register
        </button>
      </div>
    </form>
  );
}
