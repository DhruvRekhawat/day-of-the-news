import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-[#242625] text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* News Section */}
          <div>
            <h3 className="font-semibold mb-4">News</h3>
            <ul className="space-y-2 text-sm ">
              <li>
                <Link href="#" className="hover:text-white">
                  Home Page
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Local News
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  International
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Covid-19
                </Link>
              </li>
            </ul>
          </div>

          {/* International Section */}
          <div>
            <h3 className="font-semibold mb-4">International</h3>
            <ul className="space-y-2 text-sm ">
              <li>
                <Link href="#" className="hover:text-white">
                  North America
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  South America
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Europe
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Asia
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Australia
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Africa
                </Link>
              </li>
            </ul>
          </div>

          {/* Trending Internationally */}
          <div>
            <h3 className="font-semibold mb-4">Trending Internationally</h3>
            <ul className="space-y-2 text-sm ">
              <li>
                <Link href="#" className="hover:text-white">
                  Baseball
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Social Media
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Artificial Intelligence
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Senate
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Vladimir Putin
                </Link>
              </li>
            </ul>
          </div>

          {/* Trending in U.S. */}
          <div>
            <h3 className="font-semibold mb-4">Trending in U.S.</h3>
            <ul className="space-y-2 text-sm ">
              <li>
                <Link href="#" className="hover:text-white">
                  Israel-Hamas Conflict
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Baseball
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Golf
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  NCAA
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  NFL
                </Link>
              </li>
            </ul>
          </div>

          {/* Trending in U.K. */}
          <div>
            <h3 className="font-semibold mb-4">Trending in U.K.</h3>
            <ul className="space-y-2 text-sm ">
              <li>
                <Link href="#" className="hover:text-white">
                  Israel-Hamas Conflict
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Manchester United
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Soccer
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  UK Politics
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Premier League
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo */}
            <div className="flex flex-col items-center justify-center">
              <span className="text-sm text-gray-400">DAY OF THE</span>
              <span className="text-3xl font-bold">NEWS</span>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm ">
                <li>
                  <Link href="#" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Mission
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Subscribe
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Gift
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Free Trial
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Affiliates
                  </Link>
                </li>
              </ul>
            </div>

            {/* Help */}
            <div>
              <h4 className="font-semibold mb-4">Help</h4>
              <ul className="space-y-2 text-sm ">
                <li>
                  <Link href="#" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    For Educators/Libraries
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Media Bias Ratings
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Ownership and Factuality Ratings
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Referral Code
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    News Sources
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Topics
                  </Link>
                </li>
              </ul>
            </div>

            {/* Tools */}
            <div>
              <h4 className="font-semibold mb-4">Tools</h4>
              <ul className="space-y-2 text-sm ">
                <li>
                  <Link href="#" className="hover:text-white">
                    App
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Browser Extension
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Daily Newsletter
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
