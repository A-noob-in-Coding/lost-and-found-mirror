import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../utilities/footer.jsx";
import MobileSidebarNav from "../components/mobileSidebarNav.jsx";

// Hardcoded team members data
const teamMembers = [
  {
    member_id: 1,
    name: 'Muhammad Ahmad Butt',
    roll_number: '23L-3059',
    campus: 'Lahore',
    email: 'l233059@lhr.nu.edu.pk',
    role: '',
    linkedin: 'https://www.linkedin.com/in/m-ahmad-butt',
    github: 'https://github.com/m-ahmad-butt',
    icon: 'fa-code',
    display_order: 1
  },
  {
    member_id: 2,
    name: 'Abd Ur Rehman',
    roll_number: '23L-3105',
    campus: 'Lahore',
    email: 'l233105@lhr.nu.edu.pk',
    role: '',
    linkedin: 'https://www.linkedin.com/in/a-noob-in-coding',
    github: 'https://github.com/A-noob-in-Coding',
    icon: 'fa-code',
    display_order: 2
  }
];

export default function AboutUs() {
  const navigate = useNavigate();

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
            About Us
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Building a connected campus community through innovative lost and found solutions
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8 border-l-4 border-black">
              <h3 className="text-2xl font-bold text-black mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                The FAST NUCES Lost & Found platform was created with a simple mission: to reunite students with their lost items and provide a streamlined way for good Samaritans to return found belongings to their rightful owners.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 border-l-4 border-black">
              <h3 className="text-2xl font-bold text-black mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To create a campus where no student has to worry about permanently losing their belongings, fostering a culture of trust, responsibility, and community support at FAST NUCES.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Story Behind Our Solution */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-6 text-black">The Story Behind Our Solution</h3>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-4xl mx-auto">
            Our platform was born from real frustrations experienced by FAST NUCES students dealing with lost and found items.
          </p>
          
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl p-8 border-l-4 border-black shadow-sm">
                <h4 className="text-xl font-bold text-black mb-4">Why we built this solution</h4>
                <p className="text-gray-700 leading-relaxed">
We were constantly receiving unorganized emails from the university about lost and found items. The messages were scattered, had no clear structure or visual appeal, and made it time consuming to find relevant information. Although WhatsApp groups offered faster communication, they quickly became cluttered as messages got buried, important details were lost, and there was no proper system to track or manage items.                </p>
                <p className="mt-4 text-gray-700">
That’s when we realized the need for a dedicated and centralized platform where students could easily report, search, and recover lost items in a structured and efficient way. This led us to create our Lost and Found Portal.                </p>
              </div>
            </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-black">Meet Our Team</h3>
          
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl">
              {teamMembers.map((member) => (
              <div key={member.member_id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 p-8 text-center min-w-80 relative">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center">
                    <i className={`fas ${member.icon} text-xl`}></i>
                  </div>
                </div>
                <h4 className="text-xl font-semibold text-black mb-4">{member.name}</h4>
                
                <div className="flex justify-center space-x-2">
                  {member.linkedin && (
                    <a 
                      href={member.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center"
                      title="LinkedIn"
                    >
                      <i className="fab fa-linkedin text-sm"></i>
                    </a>
                  )}
                  {member.github && (
                    <a 
                      href={member.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center"
                      title="GitHub"
                    >
                      <i className="fab fa-github text-sm"></i>
                    </a>
                  )}
                  {member.email && (
                    <a 
                      href={`mailto:${member.email}`} 
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center"
                      title="Email"
                    >
                      <i className="fas fa-envelope text-sm"></i>
                    </a>
                  )}
                </div>

                {/* roll/campus info removed */}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>      {/* Statistics Section */}
    

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-black">Our Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h4 className="text-xl font-semibold text-black mb-3">Security & Trust</h4>
              <p className="text-gray-600 text-sm">We prioritize the safety and security of our users in every interaction.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-heart"></i>
              </div>
              <h4 className="text-xl font-semibold text-black mb-3">Community First</h4>
              <p className="text-gray-600 text-sm">Building stronger connections within the FAST NUCES community.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Join Our Community</h3>
          <p className="text-gray-300 mb-8 text-lg">
            Help us build a more connected and responsible campus community.
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
