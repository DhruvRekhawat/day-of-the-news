export default function Loading() {
    return (
      <div className="min-h-screen ">
        <div className="container mx-auto px-4 py-6">
          {/* Header skeleton */}
          <div className="h-16 bg-gray-200 animate-pulse  mb-6"></div>
  
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Main content skeleton */}
            <div className="col-span-1 lg:col-span-8">
              {/* Title */}
              <div className="h-12 bg-gray-200 animate-pulse rounded mb-4"></div>
              <div className="h-8 bg-gray-200 animate-pulse rounded mb-6 w-3/4"></div>
  
              {/* Bias indicators */}
              <div className="flex space-x-4 mb-6">
                <div className="h-8 bg-gray-200 animate-pulse rounded w-20"></div>
                <div className="h-8 bg-gray-200 animate-pulse rounded w-20"></div>
                <div className="h-8 bg-gray-200 animate-pulse rounded w-20"></div>
              </div>
  
              {/* Content */}
              <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 animate-pulse rounded"></div>
                ))}
              </div>
            </div>
  
            {/* Sidebar skeleton */}
            <div className="col-span-1 lg:col-span-4">
              <div className="h-64 bg-gray-200 animate-pulse  mb-6"></div>
              <div className="h-48 bg-gray-200 animate-pulse "></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  