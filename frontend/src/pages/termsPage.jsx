import { useNavigate } from "react-router-dom";
import { termsAndConditions } from "../data/terms.js";
import Footer from "../utilities/footer.jsx";
import MobileSidebarNav from "../components/mobileSidebarNav.jsx";

export default function TermsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
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
              onClick={() => navigate("/login")}
              className="hidden md:block bg-black text-white px-10 py-2 rounded-full text-sm font-medium hover:bg-white hover:text-black border-2 border-black transition-all duration-300 hover:scale-110 transform"
            >
              Login
            </button>
            {/* Mobile Sidebar Navigation */}
            <MobileSidebarNav />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-2">
            {termsAndConditions.title}
          </h1>
          <p className="text-gray-500 text-center mb-8">
            Last Updated: {termsAndConditions.lastUpdated}
          </p>

          <div className="space-y-6">
            {termsAndConditions.content.map((section, index) => (
              <div key={index} className="border-b border-gray-100 pb-6 last:border-b-0">
                <h2 className="text-lg font-semibold text-black mb-2">
                  {section.heading}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {section.text}
                </p>
              </div>
            ))}
          </div>

          {/* Copyright Section */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold mb-6">Copyright Notice</h2>
            <p className="text-gray-600 leading-relaxed">
              © 2026 FAST NUCES Lost & Found System. All rights reserved. All content, including text, graphics, logos, and images on this platform, is the property of FAST NUCES Lost & Found. Unauthorized reproduction, distribution, or use of any content without prior permission is not allowed.
            </p>
          </div>

          {/* Contact Section */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you have any questions about these Terms and Conditions or Copyright Notice, please contact us at:
            </p>
            <a 
              href="mailto:lostandfound.fastnuces@gmail.com" 
              className="text-black font-medium hover:underline"
            >
              lostandfound.fastnuces@gmail.com
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
