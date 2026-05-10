import { useNavigate } from "react-router-dom";

export default function PFooter() {
  const navigate = useNavigate();
  return (
    <footer className="bg-black text-white w-full mt-auto pb-10">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="/lf_logo.png"
                alt="Lost & Found Logo"
                className="h-8 w-8 rounded-full"
              />
              <h3 className="text-xl font-bold">FAST Lost & Found</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Reconnecting students with their belongings at FAST NUCES.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="/feed" className="hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="/aboutUs" className="hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="/howItWorks" className="hover:text-white">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <ul className="text-sm text-gray-300 space-y-2">
              <li><a href="mailto:l233059@lhr.nu.edu.pk" className="hover:text-white">lostandfound.fastnuces@gmail.com</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-sm text-gray-400 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 FAST NUCES Lost & Found System. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="/terms" className="hover:text-white">Terms & Conditions</a>
            <span>|</span>
            <a href="/privacy" className="hover:text-white">Privacy Policy</a>
          </div>
        </div>
      </div>
      <div className="bg-black pb-8"></div>
    </footer>
  );
}
