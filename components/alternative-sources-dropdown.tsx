"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Article {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: Date;
}

interface AlternativeSourcesDropdownProps {
  sources: Article[];
}

export function AlternativeSourcesDropdown({ sources }: AlternativeSourcesDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!sources.length) return null;

  return (
    <div className="mt-6">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between"
      >
        <span>Alternative Sources ({sources.length})</span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </Button>
      
      {isOpen && (
        <div className="mt-4 space-y-4 border rounded-lg p-4 bg-muted/50">
          {sources.map((article) => (
            <div key={article.id} className="border rounded-lg p-4 bg-background">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-sm leading-tight">
                  <Link 
                    href={`/article/${article.id}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {article.title}
                  </Link>
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-6 px-2 flex-shrink-0"
                >
                  <Link href={article.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </Button>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium text-blue-600">{article.source}</span>
                <span>{formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

