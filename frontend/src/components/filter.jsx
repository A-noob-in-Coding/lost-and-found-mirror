import { useEffect, useState } from "react";
import { MdFilterList } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa";
import { useUtil } from "../context/utilContext.jsx"
export default function Filter({
  setActiveFilter,
  activeFilter,
  campusFilter,
  setCampusFilter,
  categoryFilter,
  setCategoryFilter
}) {
  const [showPostTypeDropdown, setShowPostTypeDropdown] = useState(false);
  const [showCampusDropdown, setShowCampusDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const { campuses, categories } = useUtil()
  const postTypes = ["All", "Lost", "Found"];





  return (
    <div className="px-4 py-4 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Mobile Layout */}
        <div className="md:hidden space-y-3">
          {/* Filter Dropdowns */}
          <div className="flex flex-col space-y-3">
            {/* Post Type Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  // Toggle this dropdown and close the others
                  setShowPostTypeDropdown(prev => !prev);
                  setShowCampusDropdown(false);
                  setShowCategoryDropdown(false);
                }}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-left text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black transition-colors flex items-center justify-between"
              >
                <div className="flex items-center">
                  <MdFilterList className="mr-2" />
                  <span>{activeFilter}</span>
                </div>
                <FaChevronDown className={`transition-transform ${showPostTypeDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showPostTypeDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {postTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setActiveFilter(type);
                        setShowPostTypeDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${activeFilter === type ? 'bg-gray-100 font-medium' : ''
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Campus Filter */}
            {/* Campus Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  // Toggle this dropdown and close the others
                  setShowCampusDropdown(prev => !prev);
                  setShowPostTypeDropdown(false);
                  setShowCategoryDropdown(false);
                }}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-left text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black transition-colors flex items-center justify-between"
              >
                <div className="flex items-center">
                  <MdFilterList className="mr-2" />
                  <span>
                    {campusFilter
                      ? `Campus: ${campuses.find(c => c.campusID.toString() === campusFilter.toString())?.campusName || campusFilter}`
                      : "All Campuses"}
                  </span>
                </div>
                <FaChevronDown className={`transition-transform ${showCampusDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showCampusDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <button
                    onClick={() => {
                      setCampusFilter("");
                      setShowCampusDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${!campusFilter ? 'bg-gray-100 font-medium' : ''
                      }`}
                  >
                    All Campuses
                  </button>
                  {campuses.map((campus) => (
                    <button
                      key={campus.campusID}
                      onClick={() => {
                        setCampusFilter(campus.campusID.toString());
                        setShowCampusDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${campusFilter.toString() === campus.campusID.toString() ? 'bg-gray-100 font-medium' : ''
                        }`}
                    >
                      {campus.campusName}
                    </button>
                  ))}
                </div>
              )}
            </div>            {/* Category Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  // Toggle this dropdown and close the others
                  setShowCategoryDropdown(prev => !prev);
                  setShowPostTypeDropdown(false);
                  setShowCampusDropdown(false);
                }}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-left text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black transition-colors flex items-center justify-between"
              >
                <div className="flex items-center">
                  <MdFilterList className="mr-2" />
                  <span>{categoryFilter ? `Category: ${categories.find(c => c.category_id.toString() === categoryFilter.toString())?.category || categoryFilter}` : "All Categories"}</span>
                </div>
                <FaChevronDown className={`transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showCategoryDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <button
                    onClick={() => {
                      setCategoryFilter("");
                      setShowCategoryDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.category_id}
                      onClick={() => {
                        setCategoryFilter(category.category_id.toString());
                        setShowCategoryDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
                    >
                      {category.category}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="flex space-x-4 justify-between items-center">
            <div className="flex space-x-4">
              {/* Post Type Filter */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowPostTypeDropdown(prev => !prev);
                    setShowCampusDropdown(false);
                    setShowCategoryDropdown(false);
                  }}
                  className="px-6 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black transition-colors flex items-center space-x-2 min-w-36"
                >
                  <MdFilterList />
                  <span>{activeFilter}</span>
                  <FaChevronDown className={`transition-transform ${showPostTypeDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showPostTypeDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {postTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setActiveFilter(type);
                          setShowPostTypeDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${activeFilter === type ? 'bg-gray-100 font-medium' : ''
                          }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Campus Filter */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowCampusDropdown(prev => !prev);
                    setShowPostTypeDropdown(false);
                    setShowCategoryDropdown(false);
                  }}
                  className="px-6 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black transition-colors flex items-center space-x-2 min-w-48"
                >
                  <MdFilterList />
                  <span>{campusFilter ? `Campus: ${campuses.find(c => c.campusID.toString() === campusFilter.toString())?.campusName || campusFilter}` : "All Campuses"}</span>
                  <FaChevronDown className={`transition-transform ${showCampusDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showCampusDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <button
                      onClick={() => {
                        setCampusFilter("");
                        setShowCampusDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
                    >
                      All Campuses
                    </button>
                    {campuses.map((campus) => (
                      <button
                        key={campus.campusID}
                        onClick={() => {
                          setCampusFilter(campus.campusID.toString());
                          setShowCampusDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
                      >
                        {campus.campusName}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Category Filter */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowCategoryDropdown(prev => !prev);
                    setShowPostTypeDropdown(false);
                    setShowCampusDropdown(false);
                  }}
                  className="px-6 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black transition-colors flex items-center space-x-2 min-w-48"
                >
                  <MdFilterList />
                  <span>{categoryFilter ? `Category: ${categories.find(c => c.category_id.toString() === categoryFilter.toString())?.category || categoryFilter}` : "All Categories"}</span>
                  <FaChevronDown className={`transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showCategoryDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <button
                      onClick={() => {
                        setCategoryFilter("");
                        setShowCategoryDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
                    >
                      All Categories
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.category_id}
                        onClick={() => {
                          setCategoryFilter(category.category_id.toString());
                          setShowCategoryDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
                      >
                        {category.category}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}
