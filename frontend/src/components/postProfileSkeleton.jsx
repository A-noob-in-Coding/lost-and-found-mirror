import React from "react";

export default function ProfilePostSkeleton({ 
  cards = 6,
  imageHeight = "aspect-square",
  gridLayout = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
}) {
  const placeholders = Array.from({ length: cards });

  return (
    <div className={gridLayout}>
      {placeholders.map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          {/* Image Skeleton */}
          <div className={`${imageHeight} overflow-hidden bg-gray-200 shimmer`} />

          {/* Content Skeleton */}
          <div className="p-4">
            {/* Badges and Delete Button */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-16 bg-gray-200 rounded-full shimmer" />
                <div className="h-6 w-20 bg-gray-200 rounded shimmer" />
              </div>
              <div className="w-6 h-6 bg-gray-200 rounded-md shimmer" />
            </div>

            {/* Title Skeleton */}
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 shimmer" />

            {/* Location and Campus Skeleton */}
            <div className="space-y-1 mb-3">
              <div className="h-4 w-2/3 bg-gray-200 rounded shimmer" />
              <div className="h-4 w-1/2 bg-gray-200 rounded shimmer" />
            </div>

            {/* Description Skeleton */}
            <div className="mb-3 space-y-2">
              <div className="h-3 w-full bg-gray-200 rounded shimmer" />
              <div className="h-3 w-5/6 bg-gray-200 rounded shimmer" />
            </div>

            {/* Date Skeleton */}
            <div className="h-3 w-24 bg-gray-200 rounded shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}