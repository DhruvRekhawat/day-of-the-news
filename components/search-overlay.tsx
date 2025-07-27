// components/search-overlay.tsx
"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, TrendingUp, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  source: string;
  category: string;
  publishedAt: string;
  aiSummary?: string;
  url: string;
  image?: string;
}

interface SearchResult extends Article {
  relevanceScore: number;
  matchedFields: string[];
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (query: string) => void;
  results: SearchResult[];
  groupedResults: Record<string, SearchResult[]>;
  isLoading: boolean;
  popularSearches: string[];
  totalResults: number;
}

export function SearchOverlay({
  isOpen,
  onClose,
  query,
  onQueryChange,
  groupedResults,
  isLoading,
  popularSearches,
  totalResults
}: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    let highlightedText = text;
    
    searchTerms.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
    });
    
    return highlightedText;
  };

  return (
    <>
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Search Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
        <div className="w-full max-w-4xl mx-auto">
          {/* Search Input */}
          <div className="bg-background border rounded-lg shadow-lg">
            <div className="flex items-center px-4 py-3 border-b">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Search articles, topics, sources..."
                className="flex-1 border-0 focus-visible:ring-0 text-lg"
              />
              
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">Searching...</span>
                </div>
              ) : query.trim() ? (
                <div className="p-4">
                  {totalResults > 0 ? (
                    <>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Found {totalResults} result{totalResults !== 1 ? 's' : ''} for &quot;{query}&quot;
                      </div>
                      
                      {/* Results by Category */}
                      {Object.entries(groupedResults).map(([category, categoryResults]) => (
                        <div key={category} className="mb-6">
                          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 uppercase tracking-wide">
                            {category} ({categoryResults.length})
                          </h3>
                          <div className="space-y-3">
                            {categoryResults.slice(0, 5).map((article) => (
                              <Link
                                key={article.id}
                                href={article.url}
                                onClick={onClose}
                                className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                              >
                                <div className="flex gap-3">
                                  {article.image && (
                                    <div className="w-16 h-16 flex-shrink-0">
                                      <Image
                                        src={article.image}
                                        alt={article.title}
                                        width={64}
                                        height={64}
                                        className="w-full h-full object-cover rounded"
                                      />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <h4 
                                      className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 mb-1"
                                      dangerouslySetInnerHTML={{ 
                                        __html: highlightText(article.title, query) 
                                      }}
                                    />
                                    <p 
                                      className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2"
                                      dangerouslySetInnerHTML={{ 
                                        __html: highlightText(article.excerpt, query) 
                                      }}
                                    />
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                      <span>{article.source}</span>
                                      <span>•</span>
                                      <span>{formatDate(article.publishedAt)}</span>
                                      {article.matchedFields.length > 0 && (
                                        <>
                                          <span>•</span>
                                          <span className="text-blue-600 dark:text-blue-400">
                                            Matched: {article.matchedFields.join(', ')}
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-500 dark:text-gray-400 mb-2">
                        No results found for &quot;{query}&quot;
                      </div>
                      <div className="text-sm text-gray-400 dark:text-gray-500">
                        Try different keywords or check your spelling
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4">
                  {/* Popular Searches */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Popular Searches
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((search) => (
                        <Button
                          key={search}
                          variant="outline"
                          size="sm"
                          onClick={() => onQueryChange(search)}
                          className="text-xs"
                        >
                          {search}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Search Tips */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                      Search Tips
                    </h3>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <div>• Use specific keywords for better results</div>
                      <div>• Search by source, category, or topic</div>
                      <div>• Try multiple related terms</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}