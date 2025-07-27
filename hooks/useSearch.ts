// hooks/useSearch.ts
import { useState, useEffect, useMemo } from 'react';
import _ from 'lodash';

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

export const useSearch = (p0: never[]) => {
  const [query, setQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Debounced search function
  const debouncedSearch = useMemo(
    () =>
      _.debounce(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
          setResults([]);
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        try {
          const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
          if (!response.ok) {
            throw new Error('Search failed');
          }
          const data = await response.json();
          setResults(data.results || []);
        } catch (error) {
          console.error('Search error:', error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      }, 300),
    []
  );

  useEffect(() => {
    if (query.trim()) {
      debouncedSearch(query);
    } else {
      setResults([]);
    }

    return () => {
      debouncedSearch.cancel();
    };
  }, [query, debouncedSearch]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setIsSearchActive(searchQuery.trim().length > 0);
  };

  const clearSearch = () => {
    setQuery('');
    setIsSearchActive(false);
    setResults([]);
    setIsLoading(false);
  };

  // Group results by category using lodash
  const groupedResults = useMemo(() => {
    return _.groupBy(results, 'category');
  }, [results]);

  // Get popular searches (you can implement localStorage here if needed)
  const getPopularSearches = () => {
    return ['Cricket', 'Technology', 'Politics', 'Sports', 'Business'];
  };

  return {
    query,
    isSearchActive,
    results,
    groupedResults,
    isLoading,
    handleSearch,
    clearSearch,
    getPopularSearches,
    totalResults: results.length
  };
};