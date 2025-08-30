import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-[#242625] text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Mobile Layout - Grid */}
        <div className="grid grid-cols-2 gap-8 md:hidden">
          {/* Topics Section */}
          <div>
            <h3 className="font-semibold mb-4">Topics</h3>
            <ul className="space-y-2 text-sm ">
              <li>
                <Link href="/topic/india" className="hover:text-white">
                  India
                </Link>
              </li>
              <li>
                <Link href="/topic/politics" className="hover:text-white">
                  Politics
                </Link>
              </li>
              <li>
                <Link href="/topic/sports" className="hover:text-white">
                  Sports
                </Link>
              </li>
              <li>
                <Link href="/topic/business" className="hover:text-white">
                  Business
                </Link>
              </li>
              <li>
                <Link href="/topic/global-conflicts" className="hover:text-white">
                  Global Conflicts
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm ">
              <li>
                <Link href="/about" className="hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Desktop Layout - 3 Column Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {/* Logo */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-400">DAY OF THE</span>
              <span className="text-2xl font-bold">NEWS</span>
            </div>
          </div>
          
          {/* Topics */}
          <div>
            <h3 className="font-semibold mb-4">Topics</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/topic/india" className="hover:text-white">
                  India
                </Link>
              </li>
              <li>
                <Link href="/topic/politics" className="hover:text-white">
                  Politics
                </Link>
              </li>
              <li>
                <Link href="/topic/sports" className="hover:text-white">
                  Sports
                </Link>
              </li>
              <li>
                <Link href="/topic/business" className="hover:text-white">
                  Business
                </Link>
              </li>
              <li>
                <Link href="/topic/global-conflicts" className="hover:text-white">
                  Global Conflicts
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer - Mobile Only */}
      <div className="border-t border-gray-800 md:hidden">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center">
            {/* Logo */}
            <div className="flex flex-col items-center justify-center">
              <span className="text-sm text-gray-400">DAY OF THE</span>
              <span className="text-3xl font-bold">NEWS</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
