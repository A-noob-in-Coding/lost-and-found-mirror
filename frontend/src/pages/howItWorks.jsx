import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../utilities/footer.jsx";
import MobileSidebarNav from "../components/mobileSidebarNav.jsx";

export default function HowItWorks() {
  const navigate = useNavigate();
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const steps = [
    {
      title: "Create an Account",
      description: "Sign up using your FAST NUCES email address to join our community.",
      icon: "fa-user-plus"
    },
    {
      title: "Report Lost Items",
      description: "Provide details and photo of your lost item, including when and where you last saw it.",
      icon: "fa-search"
    },
    {
      title: "Post Found Items",
      description: "Found something? Post details and a photo to help locate the owner quickly.",
      icon: "fa-hand-holding"
    },
    {
      title: "Connect Safely",
      description: "Use details provided by students to ensure a safe exchange.",
      icon: "fa-comments"
    },
    {
      title: "Close the Case",
      description: "Mark items as recovered and help us track successful reunions.",
      icon: "fa-check-circle"
    },
    {
      title: "Build Community",
      description: "Leave feedback and help improve our platform for everyone at FAST NUCES.",
      icon: "fa-users"
    }
  ];

  const faqs = [
    {
      question: "Who can use this platform?",
      answer: "The Lost & Found platform is exclusively for FAST NUCES students, faculty, and staff. You must register with your university email address."
    },
    {
      question: "Is there a fee for using the service?",
      answer: "No, our platform is completely free to use. It's our contribution to making campus life better."
    },
    {
      question: "How do I ensure a safe meetup?",
      answer: "Always arrange to meet in public places on campus during daylight hours. The cafeteria, library, and main lobby are good options."
    },
    {
      question: "What if someone claims my found item falsely?",
      answer: "We recommend asking for specific details about the item that only the true owner would know before handing it over."
    },
    {
      question: "How long do posts stay active?",
      answer: "Posts remain active for 30 days by default, but you can manually close them earlier once the item is recovered or extend them if needed."
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
            How It Works
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Simple steps to reunite with your belongings and help others at FAST NUCES
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-black">Getting Started</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center">
                    <i className={`fas ${step.icon} text-xl`}></i>
                  </div>
                </div>
                <h4 className="text-xl font-semibold text-black mb-3">{step.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-black">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <h4 className="text-lg font-semibold text-black">{faq.question}</h4>
                  <i className={`fas fa-${openFAQ === index ? 'minus' : 'plus'} text-black transition-transform duration-300`}></i>
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-4 animate-fadeIn">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Statistics Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black text-white rounded-2xl p-8 text-center">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-gray-300 text-sm">Platform Access</div>
            </div>
            <div className="bg-black text-white rounded-2xl p-8 text-center">
              <div className="text-4xl font-bold mb-2">5 min</div>
              <div className="text-gray-300 text-sm">Average Response</div>
            </div>
            <div className="bg-black text-white rounded-2xl p-8 text-center">
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-gray-300 text-sm">Free Service</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-gray-300 mb-8 text-lg">
            Join our community and help make FAST NUCES a more connected campus.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={() => navigate("/register")}
              className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-all duration-300 hover:scale-105 transform"
            >
              Register Now
            </button>
            <button 
              onClick={() => navigate("/contact")}
              className="border-2 border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-black transition-all duration-300 hover:scale-105 transform"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}