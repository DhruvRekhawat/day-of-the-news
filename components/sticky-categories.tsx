import Link from "next/link"

export function StickyCategories() {
  return (
    <div className="sticky top-0 z-50 bg-background border-b shadow-sm">
      <div className="container mx-auto px-4">
        <nav className="flex items-center space-x-8 text-sm text-gray-600 dark:text-gray-200 overflow-x-auto py-3">
          <Link href="#" className="whitespace-nowrap hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100">
            SOCIAL MEDIA
          </Link>
          <Link href="#" className="whitespace-nowrap hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100">
            ARTIFICIAL INTELLIGENCE
          </Link>
          <Link href="#" className="whitespace-nowrap hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100">
            DONALD TRUMP
          </Link>
          <Link href="#" className="whitespace-nowrap hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100">
            INDIA PAKISTAN
          </Link>
          <Link href="#" className="whitespace-nowrap hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100">
            EDUCATION
          </Link>
          <Link href="#" className="whitespace-nowrap hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100">
            EUROPEAN UNION
          </Link>
          <Link href="#" className="whitespace-nowrap hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100">
            MODI
          </Link>
          <Link href="#" className="whitespace-nowrap hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100">
            STARTUPS
          </Link>
        </nav>
      </div>
    </div>
  )
}
