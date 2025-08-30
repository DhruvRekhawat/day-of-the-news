import Link from "next/link"

export function StickyCategories() {
  return (
    <div className="sticky top-0 z-25 bg-background border-b shadow-sm">
      <div className="container mx-auto px-4">
        <nav className="flex items-center space-x-8 text-sm text-gray-600 dark:text-gray-200 overflow-x-auto py-3">
          <Link href="/topic/india" className="whitespace-nowrap hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100">
            INDIA
          </Link>
          <Link href="/topic/politics" className="whitespace-nowrap hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100">
            POLITICS
          </Link>
          <Link href="/topic/sports" className="whitespace-nowrap hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100">
            SPORTS
          </Link>
          <Link href="/topic/business" className="whitespace-nowrap hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100">
            BUSINESS
          </Link>
          <Link href="/topic/global-conflicts" className="whitespace-nowrap hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100">
            GLOBAL CONFLICTS
          </Link>
        </nav>
      </div>
    </div>
  )
}
