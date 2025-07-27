// components/header.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useSearch } from "@/hooks/useSearch";
import { authClient } from "@/lib/auth-client";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SearchOverlay } from "./search-overlay";
import SignInModal from "./sign-in-modal";
import UserDropdown from "./user-dropdown";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const {
    query,
    results,
    groupedResults,
    isLoading,
    handleSearch,
    clearSearch,
    getPopularSearches,
    totalResults
  } = useSearch([]);

  const openSearch = () => {
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    clearSearch();
  };

  const { 
    data: session, 
} = authClient.useSession() 

const user = session?.user

  return (
    <>
      <header className="bg-background border-b relative">
        <div className="container mx-auto px-4">
          {/* Main Navigation */}
          <div className="flex items-center justify-between py-4">
            {/* Mobile Menu Button & Logo */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
              <Link href="/" className="flex flex-col">
                <span className="text-xs text-gray-600 dark:text-gray-200">
                  DAY OF THE
                </span>
                <span className="text-xl font-bold">NEWS</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-gray-700 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100"
              >
                HOME
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100"
              >
                ABOUT
              </Link>
              <div className="flex items-center space-x-1">
                <Link
                  href="#"
                  className="text-gray-700 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100"
                >
                  CATEGORY
                </Link>
                <ChevronDown className="w-4 h-4" />
              </div>
              <Link
                href="/faq"
                className="text-gray-700 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100"
              >
                FAQ
              </Link>
              <Link
                href="/pricing"
                className="text-gray-700 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100"
              >
                PRICING
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100"
              >
                CONTACT US
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Desktop Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search articles..."
                  className="pl-10 w-64 cursor-pointer"
                  onClick={openSearch}
                  readOnly
                />
              </div>
              {/* Mobile Search */}
              <Button variant="ghost" size="sm" className="md:hidden" onClick={openSearch}>
                <Search className="w-5 h-5" />
              </Button>
              <ModeToggle />
              {user ? <UserDropdown /> : <SignInModal />}
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t bg-background">
              <nav className="flex flex-col space-y-4 py-4">
                <Link
                  href="/"
                  className="text-gray-700 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100 px-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  HOME
                </Link>
                <Link
                  href="/about"
                  className="text-gray-700 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100 px-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ABOUT
                </Link>
                <div className="flex items-center justify-between px-2">
                  <Link
                    href="#"
                    className="text-gray-700 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100"
                  >
                    CATEGORY
                  </Link>
                  <ChevronDown className="w-4 h-4" />
                </div>
                <Link
                  href="/faq"
                  className="text-gray-700 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100 px-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  FAQ
                </Link>
                <Link
                  href="/pricing"
                  className="text-gray-700 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100 px-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  PRICING
                </Link>
                <Link
                  href="/contact"
                  className="text-gray-700 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100 px-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  CONTACT US
                </Link>
                {/* Mobile Search Input */}
                <div className="relative px-2">
                  <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search articles..."
                    className="pl-10 w-full cursor-pointer"
                    onClick={openSearch}
                    readOnly
                  />
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={closeSearch}
        query={query}
        onQueryChange={handleSearch}
        results={results}
        groupedResults={groupedResults}
        isLoading={isLoading}
        popularSearches={getPopularSearches()}
        totalResults={totalResults}
      />
    </>
  );
}