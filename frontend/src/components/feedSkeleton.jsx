import React from "react";

export default function FeedSkeleton({ 
  cards = 6,
  imageHeight = "aspect-square",
  cardLayout = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
}) {
  const placeholders = Array.from({ length: cards });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className={cardLayout}>
        {placeholders.map((_, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-sm border border-black/10 relative flex flex-col h-full"
          >
            {/* Image Skeleton */}
            <div className={`${imageHeight} overflow-hidden rounded-t-xl bg-gray-200 shimmer`} />

            <div className="p-4 flex-1 flex flex-col">
              {/* User Info Skeleton */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 shimmer" />
                  <div>
                    <div className="h-4 w-32 bg-gray-200 rounded shimmer mb-2" />
                    <div className="h-3 w-40 bg-gray-200 rounded shimmer" />
                  </div>
                </div>
              </div>

              {/* Content Skeleton */}
              <div className="flex flex-col flex-grow">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 shimmer" />
                <div className="flex items-center mb-2">
                  <div className="h-4 w-40 bg-gray-200 rounded shimmer" />
                </div>
                <div className="flex items-center mb-2">
                  <div className="h-4 w-36 bg-gray-200 rounded shimmer" />
                </div>
                <div className="mb-4 space-y-2">
                  <div className="h-3 w-full bg-gray-200 rounded shimmer" />
                  <div className="h-3 w-5/6 bg-gray-200 rounded shimmer" />
                </div>
              </div>

              {/* Button Skeleton */}
              <div className="mt-auto">
                <div className="w-full h-10 bg-gray-200 rounded-lg shimmer" />
              </div>

              {/* Comments Section Skeleton */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="h-4 w-28 bg-gray-200 rounded shimmer" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}