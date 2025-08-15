// components/header.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useSearch } from "@/hooks/useSearch";
import { authClient } from "@/lib/auth-client";
import { ChevronDown, Menu, Search, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { SearchOverlay } from "./search-overlay";
import SignInModal from "./sign-in-modal";
import UserDropdown from "./user-dropdown";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when mouse leaves the dropdown area
  useEffect(() => {
    function handleMouseLeave() {
      setIsCategoriesDropdownOpen(false);
    }

    const dropdownElement = dropdownRef.current;
    if (dropdownElement) {
      dropdownElement.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        dropdownElement.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);
  
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
                             <div 
                 className="relative" 
                 ref={dropdownRef}
                 onMouseEnter={() => setIsCategoriesDropdownOpen(true)}
               >
                 <button
                   className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100"
                 >
                   <span>CATEGORIES</span>
                   <ChevronDown className={`w-4 h-4 transition-transform ${isCategoriesDropdownOpen ? 'rotate-180' : ''}`} />
                 </button>
                 
                 {isCategoriesDropdownOpen && (
                   <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                     <div className="p-4">
                       <div className="mb-4">
                         <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Categories</h3>
                         <div className="space-y-1">
                                                       <Link
                              href="/category/politics"
                              className="block text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-1"
                            >
                              Politics
                            </Link>
                            <Link
                              href="/category/business"
                              className="block text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-1"
                            >
                              Business
                            </Link>
                            <Link
                              href="/category/sports"
                              className="block text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-1"
                            >
                              Sports
                            </Link>
                            <Link
                              href="/category/technology"
                              className="block text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-1"
                            >
                              Technology
                            </Link>
                         </div>
                       </div>
                       
                       <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                         <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Topics</h3>
                         <div className="space-y-1">
                                                       <Link
                              href="/topic/india"
                              className="block text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-1"
                            >
                              India
                            </Link>
                            <Link
                              href="/topic/global-conflicts"
                              className="block text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-1"
                            >
                              Global Conflicts
                            </Link>
                            <Link
                              href="/topic/modi"
                              className="block text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-1"
                            >
                              Modi
                            </Link>
                            <Link
                              href="/topic/trump"
                              className="block text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-1"
                            >
                              Trump
                            </Link>
                         </div>
                       </div>
                       
                       <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                                   <Link
                            href="/categories"
                            className="block text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                          >
                            View All Categories →
                          </Link>
                       </div>
                     </div>
                   </div>
                 )}
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
                                 <div className="px-2">
                   <button
                     onClick={() => setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen)}
                     className="flex items-center justify-between w-full text-gray-700 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100"
                   >
                     <span>CATEGORIES</span>
                     <ChevronRight className={`w-4 h-4 transition-transform ${isCategoriesDropdownOpen ? 'rotate-90' : ''}`} />
                   </button>
                   
                   {isCategoriesDropdownOpen && (
                     <div className="mt-2 ml-4 space-y-2">
                       <div className="mb-3">
                         <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">Categories</h4>
                         <div className="space-y-1">
                           <Link
                             href="/category/politics"
                             className="block text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-1"
                             onClick={() => {
                               setIsCategoriesDropdownOpen(false);
                               setIsMobileMenuOpen(false);
                             }}
                           >
                             Politics
                           </Link>
                           <Link
                             href="/category/business"
                             className="block text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-1"
                             onClick={() => {
                               setIsCategoriesDropdownOpen(false);
                               setIsMobileMenuOpen(false);
                             }}
                           >
                             Business
                           </Link>
                           <Link
                             href="/category/sports"
                             className="block text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-1"
                             onClick={() => {
                               setIsCategoriesDropdownOpen(false);
                               setIsMobileMenuOpen(false);
                             }}
                           >
                             Sports
                           </Link>
                           <Link
                             href="/category/technology"
                             className="block text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-1"
                             onClick={() => {
                               setIsCategoriesDropdownOpen(false);
                               setIsMobileMenuOpen(false);
                             }}
                           >
                             Technology
                           </Link>
                         </div>
                       </div>
                       
                       <div className="mb-3">
                         <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">Topics</h4>
                         <div className="space-y-1">
                           <Link
                             href="/topic/india"
                             className="block text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-1"
                             onClick={() => {
                               setIsCategoriesDropdownOpen(false);
                               setIsMobileMenuOpen(false);
                             }}
                           >
                             India
                           </Link>
                           <Link
                             href="/topic/global-conflicts"
                             className="block text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-1"
                             onClick={() => {
                               setIsCategoriesDropdownOpen(false);
                               setIsMobileMenuOpen(false);
                             }}
                           >
                             Global Conflicts
                           </Link>
                           <Link
                             href="/topic/modi"
                             className="block text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-1"
                             onClick={() => {
                               setIsCategoriesDropdownOpen(false);
                               setIsMobileMenuOpen(false);
                             }}
                           >
                             Modi
                           </Link>
                           <Link
                             href="/topic/trump"
                             className="block text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-1"
                             onClick={() => {
                               setIsCategoriesDropdownOpen(false);
                               setIsMobileMenuOpen(false);
                             }}
                           >
                             Trump
                           </Link>
                         </div>
                       </div>
                       
                       <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                         <Link
                           href="/categories"
                           className="block text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                           onClick={() => {
                             setIsCategoriesDropdownOpen(false);
                             setIsMobileMenuOpen(false);
                           }}
                         >
                           View All Categories →
                         </Link>
                       </div>
                     </div>
                   )}
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