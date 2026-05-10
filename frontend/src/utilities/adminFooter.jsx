import React from 'react';

export default function AdminFooter() {
  return (
    <footer className="bg-black text-white w-full mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* Top area: branding (left) and contact (right on md, stacked & centered on small) */}
        <div className="w-full flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div className="flex items-start md:items-center space-x-4">
            <img
              src="/lf_logo.png"
              alt="Lost & Found Logo"
              className="h-10 w-10 rounded-full bg-white/5 p-1 object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src = '/lf_logo.png'; }}
            />
            <div>
              <h3 className="text-lg md:text-xl font-bold">FAST Lost & Found — Admin</h3>
              <p className="text-gray-300 text-sm mt-1">Admin dashboard - Reconnecting students with their belongings at FAST NUCES.</p>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end text-right md:text-right">
            <h4 className="font-semibold mb-2">Connect With Us</h4>
            <a href="mailto:lostandfound.fastnuces@gmail.com" className="text-sm text-gray-300 hover:text-white">
              lostandfound.fastnuces@gmail.com
            </a>
          </div>
        </div>

        {/* Divider + copyright */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <p className="text-sm text-gray-400 text-center md:text-left">© 2026 FAST NUCES Lost & Found System. All rights reserved.</p>
          <div className="flex gap-4 justify-center md:justify-end text-sm text-gray-400">
            <a href="/terms" className="hover:text-white">Terms & Conditions</a>
            <span>|</span>
            <a href="/terms" className="hover:text-white">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
