import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MobileSidebarNav() {
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const menuItems = [
    { label: "Home", path: "/feed", icon: "fa-home" },
    { label: "About Us", path: "/aboutUs", icon: "fa-info-circle" },
    { label: "How It Works", path: "/howItWorks", icon: "fa-question-circle" },
    { label: "Contact Us", path: "/contact", icon: "fa-envelope" },
    { label: "Terms & Conditions", path: "/terms", icon: "fa-file-contract" },
    { label: "Privacy Policy", path: "/privacy", icon: "fa-user-secret" }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setShowMobileMenu(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-md text-gray-600 hover:text-black hover:bg-gray-100 transition-all"
        >
          <i className={`fas ${showMobileMenu ? "fa-times" : "fa-bars"} text-xl`} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-white/10 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleMobileMenu}
        >
          <div
            className="fixed top-0 right-0 w-80 bg-white/95 backdrop-blur-sm h-full shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src="/lf_logo.png"
                    alt="Lost & Found Logo"
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="text-lg font-bold text-black">Navigation</span>
                </div>
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-md text-gray-600 hover:text-black hover:bg-gray-100 transition-all"
                >
                  <i className="fas fa-times text-lg"></i>
                </button>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="p-6 space-y-2">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigation(item.path)}
                  className="w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-left font-medium hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                    <i className={`fas ${item.icon} text-sm`} />
                  </div>
                  <span className="text-gray-700 group-hover:text-black">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gray-50 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 font-medium mb-1">
                  FAST Lost & Found
                </p>
                <p className="text-xs text-gray-500">
                  Building a connected campus community
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
