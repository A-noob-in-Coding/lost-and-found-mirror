export default function OtherProfileSkeleton() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            {/* Avatar Skeleton */}
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gray-200 border-2 border-gray-200 flex-shrink-0 shimmer" />

            <div className="flex-1 w-full text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between">
                <div className="flex-1 w-full">
                  {/* Name Skeleton */}
                  <div className="h-6 sm:h-8 w-40 sm:w-48 bg-gray-200 rounded shimmer mb-2 mx-auto sm:mx-0" />
                  {/* Campus Skeleton */}
                  <div className="h-3 sm:h-4 w-28 sm:w-32 bg-gray-200 rounded shimmer mb-1 mx-auto sm:mx-0" />
                  {/* Roll Number Skeleton */}
                  <div className="h-3 sm:h-4 w-32 sm:w-40 bg-gray-200 rounded shimmer mx-auto sm:mx-0" />
                </div>
              </div>

              {/* Stats Skeleton */}
              <div className="mt-4 flex items-center justify-center sm:justify-start space-x-6">
                <div className="text-center sm:text-left">
                  <div className="h-6 sm:h-7 w-8 sm:w-12 bg-gray-200 rounded shimmer mb-1 mx-auto sm:mx-0" />
                  <div className="h-3 sm:h-4 w-10 sm:w-12 bg-gray-200 rounded shimmer mx-auto sm:mx-0" />
                </div>
                <div className="text-center sm:text-left">
                  <div className="h-6 sm:h-7 w-8 sm:w-12 bg-gray-200 rounded shimmer mb-1 mx-auto sm:mx-0" />
                  <div className="h-3 sm:h-4 w-16 sm:w-20 bg-gray-200 rounded shimmer mx-auto sm:mx-0" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200 flex space-x-1">
          <div className="h-9 sm:h-10 w-24 sm:w-28 bg-gray-200 rounded-lg shimmer" />
          <div className="h-9 sm:h-10 w-28 sm:w-32 bg-gray-200 rounded-lg shimmer" />
        </div>
      </div>

      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            {/* Image Skeleton */}
            <div className="aspect-square bg-gray-200 shimmer" />

            {/* Content Skeleton */}
            <div className="p-3 sm:p-4">
              {/* Badges */}
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="h-5 sm:h-6 w-14 sm:w-16 bg-gray-200 rounded-full shimmer" />
                  <div className="h-5 sm:h-6 w-16 sm:w-20 bg-gray-200 rounded shimmer" />
                </div>
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-200 rounded-md shimmer" />
              </div>

              {/* Title */}
              <div className="h-4 sm:h-5 bg-gray-200 rounded w-3/4 mb-2 shimmer" />

              {/* Location and Campus */}
              <div className="space-y-1 mb-2 sm:mb-3">
                <div className="h-3 sm:h-4 w-2/3 bg-gray-200 rounded shimmer" />
                <div className="h-3 sm:h-4 w-1/2 bg-gray-200 rounded shimmer" />
              </div>

              {/* Description */}
              <div className="mb-2 sm:mb-3 space-y-1 sm:space-y-2">
                <div className="h-3 w-full bg-gray-200 rounded shimmer" />
                <div className="h-3 w-5/6 bg-gray-200 rounded shimmer" />
              </div>

              {/* Date */}
              <div className="h-3 w-20 sm:w-24 bg-gray-200 rounded shimmer" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}