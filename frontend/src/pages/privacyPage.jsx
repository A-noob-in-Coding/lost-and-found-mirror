import Footer from "../utilities/footer.jsx";
import MobileSidebarNav from "../components/mobileSidebarNav.jsx";
import { useNavigate } from "react-router-dom";

export default function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between w-full">
          <div className="flex items-center space-x-3 ml-4">
            <img
              src="/lf_logo.png"
              alt="Lost & Found Logo"
              className="h-10 w-10 rounded-full"
            />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-black">
              FAST Lost & Found
            </h1>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {/* Desktop Login Button */}
            <button
              onClick={() => navigate("/login")}
              className="hidden md:block bg-black text-white px-10 py-2 rounded-full text-sm font-medium
                         hover:bg-white hover:text-black border-2 border-black
                         transition-all duration-300 hover:scale-110"
            >
              Login
            </button>

            {/* Mobile Menu */}
            <MobileSidebarNav />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-2">
            Privacy Policy
          </h1>
          <p className="text-gray-500 text-center mb-8">
            Last Updated: February 5, 2026
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Data Collection</h3>
              <p className="text-gray-600 leading-relaxed">
                We collect only the information necessary to provide our services,
                including your university email address, student ID, and profile
                information. We do not sell or share your personal data with third parties.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Data Usage</h3>
              <p className="text-gray-600 leading-relaxed">
                Your data is used solely to facilitate the lost and found services
                within FAST NUCES, including displaying posts, enabling communication,
                and maintaining accounts.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Data Security</h3>
              <p className="text-gray-600 leading-relaxed">
                We implement security measures to protect your personal information.
                However, no system is completely secure, and absolute protection
                cannot be guaranteed.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about this Privacy Policy, contact us at:
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
