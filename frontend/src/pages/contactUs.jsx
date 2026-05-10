import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { FaSync } from "react-icons/fa";
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';
import Footer from "../utilities/footer.jsx";
import MobileSidebarNav from "../components/mobileSidebarNav.jsx";
import { utilityService } from "../services/utilService.js";
export default function ContactUs() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [captchaInput, setCaptchaInput] = useState("");

  useEffect(() => {
    loadCaptchaEnginge(6, 'white', 'black', 'upper');
  }, []);

  const refreshCaptcha = () => {
    loadCaptchaEnginge(6, 'white', 'black', 'upper');
    setCaptchaInput("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate captcha first
    if (!validateCaptcha(captchaInput)) {
      toast.error('Invalid captcha. Please try again.');
      refreshCaptcha();
      return;
    }

    setIsLoading(true);

    try {
      await utilityService.sendContactMessage(formData);
      toast.success("Message sent successfully! We'll get back to you soon.")

      setFormData({
        name: "",
        email: "",
        message: ""
      });
      setCaptchaInput("");
      refreshCaptcha();
    } catch (error) {
      toast.error("Failed to send message. Please try again.")
    } finally {
      setIsLoading(false);
    }
  };


  const contactMethods = [
    {
      title: "Email Support",
      description: "Get in touch with our support team",
      contact: "lostandfound.fastnuces@gmail.com",
      icon: "fa-envelope"
    },
    {
      title: "Emergency Contact",
      description: "For urgent lost item reports",
      contact: "+92-3264616031",
      icon: "fa-phone"
    }
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* Header with Logo and Navigation */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between w-full">
          <div className="flex items-center space-x-3 ml-4">
            <img
              src="/lf_logo.png"
              alt="Lost & Found Logo"
              className="h-10 w-10 rounded-full"
            />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-black">FAST Lost & Found</h1>
          </div>
          <div className="flex-shrink-0 ml-auto mr-0">
            {/* Desktop Home Button - Hidden on mobile */}
            <button
              onClick={() => navigate("/feed")}
              className="hidden md:block bg-black text-white px-10 py-2 rounded-full text-sm font-medium hover:bg-white hover:text-black border-2 border-black transition-all duration-300 hover:scale-110 transform"
            >
              Home
            </button>
            {/* Mobile Sidebar Navigation */}
            <MobileSidebarNav />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Contact Us
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Have questions, feedback, or need assistance? We're here to help you make the most of our Lost & Found platform.
          </p>
        </div>
      </section>

      {/* Contact Methods Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-black">Get In Touch</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
            {contactMethods.map((method, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center">
                    <i className={`fas ${method.icon} text-lg`}></i>
                  </div>
                </div>
                <h4 className="text-xl font-semibold text-black mb-2">{method.title}</h4>
                <p className="text-gray-600 text-sm mb-3">{method.description}</p>
                {method.contact && method.contact.includes("@") ? (
                  <a
                    href={`mailto:${method.contact}`}
                    className="text-black font-medium text-sm underline hover:text-black"
                    aria-label={`Send email to ${method.contact}`}
                  >
                    {method.contact}
                  </a>
                ) : (
                  <p className="text-black font-medium text-sm">{method.contact}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center lg:items-start">
            {/* Form Info */}
            <div className="space-y-6 text-center lg:text-left mx-auto max-w-lg">
              <h3 className="text-3xl font-bold text-black">Send Us a Message</h3>
              <p className="text-gray-600 leading-relaxed">
                Fill out the form and we'll get back to you as soon as possible. Whether you have a suggestion,
                found a bug, or need help with the platform, we'd love to hear from you.
              </p>
              <div className="space-y-6 hidden sm:block">
                <div className="flex items-center justify-center lg:justify-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                    <i className="fas fa-clock text-sm"></i>
                  </div>
                  <span className="text-gray-600">Response time: 24-48 hours</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                    <i className="fas fa-shield-alt text-sm"></i>
                  </div>
                  <span className="text-gray-600">Your information is secure</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                    <i className="fas fa-users text-sm"></i>
                  </div>
                  <span className="text-gray-600">Community-focused support</span>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full mx-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/50 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/50 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/50 transition-all resize-none"
                    required
                  ></textarea>
                </div>

                {/* Captcha Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Security Check
                  </label>
                  <div className="flex items-center justify-between mb-2">
                    <div className="bg-gray-100 rounded-lg p-2 flex-1 border border-gray-300">
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
                  <input
                    type="text"
                    placeholder="Enter captcha"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/50 transition-all uppercase"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-900 transition-all duration-300 hover:scale-105 transform flex items-center justify-center"
                >
                  {isLoading && <span className="animate-spin mr-2">⟳</span>}
                  {isLoading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-black mb-8">Quick Answers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-2xl p-6 border-l-4 border-black">
              <h4 className="text-lg font-semibold text-black mb-3">How quickly do you respond?</h4>
              <p className="text-gray-600 text-sm">We typically respond to all inquiries within 24-48 hours during business days.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 border-l-4 border-black">
              <h4 className="text-lg font-semibold text-black mb-3">Can I suggest new features?</h4>
              <p className="text-gray-600 text-sm">Absolutely! We welcome feature suggestions and feedback to improve our platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
