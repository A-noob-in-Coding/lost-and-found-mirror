import React from "react";
import { useNavigate } from "react-router-dom";
import PFooter from "../utilities/previewPageFooter.jsx";
import { dummyPosts, transformApiDataToPreviewFormat } from "../data/dummyData.js";
import toast from 'react-hot-toast';
import PreviewSkeleton from "../components/previewSkeleton.jsx";
import { useRecent6Posts } from "../hooks/postHook.js";

const PreviewPage = () => {
  const navigate = useNavigate();

  // Use React Query hooks
  const { data: apiPosts = [], isLoading } = useRecent6Posts({
    onError: (error) => {
      toast.error('Failed to load recent posts');
    }
  });



  // Transform and prepare recent items
  const recentItems = React.useMemo(() => {
    if (!apiPosts || apiPosts.length === 0) {
      return dummyPosts; // Fallback to dummy data
    }

    // Transform API data to match preview format
    const transformedPosts = apiPosts.map(transformApiDataToPreviewFormat);

    // If we have less than 6 posts, fill with dummy data
    if (transformedPosts.length < 6) {
      const neededDummyCount = 6 - transformedPosts.length;
      const dummyDataToAdd = dummyPosts.slice(0, neededDummyCount);
      return [...transformedPosts, ...dummyDataToAdd];
    }

    return transformedPosts;
  }, [apiPosts]);



  return (
    <div className="min-h-screen bg-white">
      {/* Header with Logo and Navigation */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between w-full">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <img
              src="/lf_logo.png"
              alt="Lost & Found Logo"
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full"
            />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-black">FAST Lost & Found</h1>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={() => navigate("/login")}
              className="bg-black text-white px-4 sm:px-6 md:px-10 py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-white hover:text-black border-2 border-black transition-all duration-300 hover:scale-110 transform"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gray-50 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mt-4 sm:mt-6 md:mt-10 mb-6 sm:mb-8 md:mb-10 px-4">
            Reconnect with Your Belongings
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-6 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto px-4 leading-relaxed">
            Browse lost items, report missing belongings, and help others at FAST
            NUCES. Join our community-driven platform to reunite students with their
            lost possessions.
          </p>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-black">Recent Activity</h3>
          <p className="text-sm sm:text-base text-gray-600 text-center mb-8 sm:mb-12 px-4">
            Latest lost and found items from the FAST NUCES community
          </p>

          {/* Items Grid */}
          {isLoading ? (
            <div className="py-2">
              <PreviewSkeleton cards={6} />
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 lg:gap-6">
              {recentItems.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  onClick={() => navigate("/login")}
                  className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden hover:scale-105 transform cursor-pointer w-full sm:w-[49.5%] lg:w-[30%] max-w-xs sm:max-w-sm"
                >
                  {/* Item Badge */}
                  <div className="relative">
                    <div className="h-48 sm:h-44 lg:h-56 xl:h-64 overflow-hidden rounded-t-lg sm:rounded-t-xl lg:rounded-t-2xl">
                      <img
                        src={item.image || "/no_prev_img.png"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span
                      className={`absolute top-0.5 right-0.5 sm:top-1 sm:right-1 lg:top-2 lg:right-2 px-1 py-0.5 sm:px-1.5 sm:py-0.5 lg:px-2 lg:py-1 rounded-full text-xs font-semibold text-white ${item.type === "Found" ? "bg-green-500" : "bg-red-500"
                        }`}
                    >
                      {item.badge}
                    </span>
                  </div>

                  {/* Item Content */}
                  <div className="p-2 sm:p-3 lg:p-4">
                    <h4 className="text-sm sm:text-sm lg:text-base font-semibold text-black mb-1 line-clamp-1">{item.title}</h4>
                    <p className="text-gray-600 text-xs sm:text-sm mb-1 overflow-hidden text-ellipsis whitespace-nowrap">{item.description}</p>

                    <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
                      <div className="flex items-center flex-1 min-w-0">
                        <i className="fas fa-map-marker-alt mr-1 flex-shrink-0"></i>
                        <span className="truncate text-xs">{item.location}</span>
                      </div>
                      <div className="flex items-center ml-1 flex-shrink-0">
                        <i className="fas fa-university mr-1"></i>
                        <span className="text-xs truncate max-w-20 sm:max-w-24 lg:max-w-none">{item.campus}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-500 text-xs">
                      <i className="fas fa-clock mr-1"></i>
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View All Items Button */}
          <div className="text-center mt-8 sm:mt-10">
            <button
              onClick={() => navigate("/login")}
              className="bg-black text-white mt-4 px-6 sm:px-8 py-3 rounded-full text-sm sm:font-medium hover:bg-white hover:text-black border-2 border-black transition-all duration-300 hover:scale-110 transform"
            >
              View All Items
            </button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}


      {/* PFooter */}
      <div className="pb-0">
        <PFooter />
      </div>

      {/* Fixed/Sticky Bottom Navbar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black text-white z-50 border-t border-gray-800">
        <div className="px-3 sm:px-6 py-3 flex justify-between items-center w-full">
          <div className="text-xs sm:text-sm text-gray-400">
            Preview of Lost & Found
          </div>
          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline text-xs sm:text-sm text-gray-300">Sign up to join our community</span>
            <button
              onClick={() => navigate("/register")}
              className="bg-white text-black px-4 sm:px-10 py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-black hover:text-white border-2 border-white transition-all duration-300 hover:scale-110 transform"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;
