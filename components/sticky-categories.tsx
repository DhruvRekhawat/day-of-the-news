import Link from "next/link"

export function StickyCategories() {
  return (
    <div className="sticky top-0 z-25 bg-background border-b shadow-sm">
      <div className="container mx-auto px-4">
        <nav className="flex items-center space-x-8 text-sm text-gray-600 dark:text-gray-200 overflow-x-auto py-3">
          <Link href="/category/politics" className="whitespace-nowrap hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100">
            POLITICS
          </Link>
          <Link href="/category/business" className="whitespace-nowrap hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100">
            BUSINESS
          </Link>
          <Link href="/category/sports" className="whitespace-nowrap hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100">
            SPORTS
          </Link>
          <Link href="/category/technology" className="whitespace-nowrap hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100">
            TECHNOLOGY
          </Link>
          <Link href="/topic/india" className="whitespace-nowrap hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100">
            INDIA
          </Link>
          <Link href="/topic/global-conflicts" className="whitespace-nowrap hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100">
            GLOBAL CONFLICTS
          </Link>
          <Link href="/topic/modi" className="whitespace-nowrap hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100">
            MODI
          </Link>
          <Link href="/topic/trump" className="whitespace-nowrap hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100">
            TRUMP
          </Link>
        </nav>
      </div>
    </div>
  )
}
