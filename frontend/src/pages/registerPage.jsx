import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/registerForm.jsx";
import OtpPage from "../components/otpPage.jsx";
export const Register = () => {
  const navigate = useNavigate();
  const [showOtpPage, setShowOtpPage] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    studentId: "",
    email: "",
    campusId: "",
    password: "",
    imageFile: null
  });

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className={`${showOtpPage ? 'max-w-md' : 'max-w-4xl'} w-full bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200`}>
          <div className="lg:p-8 p-4">
            {/* Back Button */}
            <div className="flex justify-start mb-4">
              <button
                onClick={() => navigate("/")}
                className="flex items-center text-gray-600 hover:text-black transition-colors duration-200"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                <span className="text-sm">Back to Preview</span>
              </button>
            </div>

            <div className="flex justify-center mb-8">
              <img
                src="/lf_logo.png"
                alt="Lost & Found Logo"
                className="h-16 w-16 rounded-full"
              />
            </div>
            <h1 className="text-3xl font-bold text-center mb-2 tracking-tight">
              FAST Lost & Found
            </h1>
            <p className="text-gray-500 text-center mb-8">
              Join our community
            </p>

            {!showOtpPage ? (
              <RegisterForm
                setShowOtpPage={setShowOtpPage}
                formData={formData}
                setFormData={setFormData}
              />
            ) : (
              <OtpPage
                setShowOtpPage={setShowOtpPage}
                formData={formData}
              />
            )}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
              © 2026 FAST NUCES Lost & Found System
              <div className="mt-2">
                <a href="/terms" className="hover:text-black underline">Terms & Conditions</a>
                <span className="mx-2">|</span>
                <a href="/privacy" className="hover:text-black underline">Privacy Policy</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
