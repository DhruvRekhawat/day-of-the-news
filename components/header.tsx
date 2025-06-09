import Link from "next/link"
import { Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "@/components/ui/mode-toggle"

export function Header() {
  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4">
        {/* Main Navigation */}
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex flex-col">
            <span className="text-xs text-gray-600">DAY OF THE</span>
            <span className="text-xl font-bold">NEWS</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:">
              HOME
            </Link>
            <Link href="/about" className="text-gray-700 hover:">
              ABOUT
            </Link>
            <div className="flex items-center space-x-1">
              <Link href="#" className="text-gray-700 hover:">
                CATEGORY
              </Link>
              <ChevronDown className="w-4 h-4" />
            </div>
            <Link href="/faq" className="text-gray-700 hover:">
              FAQ
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:">
              PRICING
            </Link>
            <Link href="/contact" className="text-gray-700 hover:">
              CONTACT US
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search" className="pl-10 w-64 hidden md:block" />
            </div>
            <ModeToggle />
            <Button variant="outline">Login</Button>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="border-t py-3">
          <nav className="flex items-center space-x-8 text-sm text-gray-600 overflow-x-auto">
            <Link href="#" className="whitespace-nowrap hover:">
              SOCIAL MEDIA
            </Link>
            <Link href="#" className="whitespace-nowrap hover:">
              ARTIFICIAL INTELLIGENCE
            </Link>
            <Link href="#" className="whitespace-nowrap hover:">
              DONALD TRUMP
            </Link>
            <Link href="#" className="whitespace-nowrap hover:">
              INDIA PAKISTAN
            </Link>
            <Link href="#" className="whitespace-nowrap hover:">
              EDUCATION
            </Link>
            <Link href="#" className="whitespace-nowrap hover:">
              EUROPEAN UNION
            </Link>
            <Link href="#" className="whitespace-nowrap hover:">
              MODI
            </Link>
            <Link href="#" className="whitespace-nowrap hover:">
              STARTUPS
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
