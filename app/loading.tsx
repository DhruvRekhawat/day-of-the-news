export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header skeleton */}
        <div className="h-16 bg-gray-200 animate-pulse  mb-6"></div>

        {/* Hero section skeleton */}
        <div className="grid grid-cols-12 gap-6 mb-8">
          {/* Left sidebar */}
          <div className="col-span-3">
            <div className="h-8 bg-gray-200 animate-pulse rounded mb-4"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 animate-pulse rounded"></div>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="col-span-6">
            <div className="h-96 bg-gray-200 animate-pulse  mb-4"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-48 bg-gray-200 animate-pulse "></div>
              <div className="h-48 bg-gray-200 animate-pulse "></div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="col-span-3">
            <div className="h-8 bg-gray-200 animate-pulse rounded mb-4"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 animate-pulse rounded"></div>
              ))}
            </div>
          </div>
        </div>

        {/* News sections skeleton */}
        {[...Array(3)].map((_, i) => (
          <div key={i} className="mb-8">
            <div className="h-8 bg-gray-200 animate-pulse rounded mb-6 w-48"></div>
            <div className="grid grid-cols-4 gap-6">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="space-y-3">
                  <div className="h-48 bg-gray-200 animate-pulse "></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
