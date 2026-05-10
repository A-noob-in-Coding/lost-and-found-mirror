import React from "react";

// Small skeleton for the stats counters 
export function StatsSkeleton() {
  return (
    <div className="flex justify-center items-center space-x-2">
      <div className="h-6 w-20 bg-gray-200 rounded shimmer" />
    </div>
  );
}

// Full stat card skeleton 
export function StatsCardSkeleton() {
  return (
    <div className="rounded-2xl p-4 sm:p-6 bg-black/5">
      <div className="text-center">
        <div className="mx-auto h-10 w-28 bg-gray-200 rounded shimmer mb-3" />
        <div className="mx-auto h-3 w-24 bg-gray-200 rounded shimmer opacity-80" />
      </div>
    </div>
  );
}

export default function PreviewSkeleton({ 
  cards = 6, 
  // increased heights to match updated preview cards
  imageHeight = "h-48 sm:h-44 lg:h-56 xl:h-64",
  cardWidth = "w-full sm:w-[49.5%] lg:w-[30%]",
  maxWidth = "max-w-xs sm:max-w-sm"
}) {
  const placeholders = Array.from({ length: cards });

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 lg:gap-6">
        {placeholders.map((_, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${cardWidth} ${maxWidth}`}
          >
            <div className="relative">
              <div className={`${imageHeight} bg-gray-200 shimmer rounded-t-lg sm:rounded-t-xl lg:rounded-t-2xl`} />
              <div className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 lg:top-2 lg:right-2">
                <div className="h-5 w-12 sm:h-6 sm:w-14 rounded-full bg-gray-200 shimmer" />
              </div>
            </div>

            <div className="p-2 sm:p-3 lg:p-4">
              {/* Title */}
              <div className="h-4 sm:h-4 lg:h-5 bg-gray-200 rounded w-3/4 mb-1 shimmer" />
              
              {/* Description */}
              <div className="h-3 sm:h-3.5 bg-gray-200 rounded w-full mb-1 shimmer" />
              
              {/* Location and Campus */}
              <div className="flex items-center justify-between mb-1">
                <div className="h-3 bg-gray-200 rounded w-2/5 shimmer" />
                <div className="h-3 bg-gray-200 rounded w-1/4 shimmer" />
              </div>
              
              {/* Time */}
              <div className="h-3 bg-gray-200 rounded w-1/3 shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

