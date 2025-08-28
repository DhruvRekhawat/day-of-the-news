"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Share2, 
  Copy, 
  Facebook, 
  Twitter, 
  MessageCircle,
  Mail,
  Linkedin,
  Check
} from "lucide-react";

interface SocialShareProps {
  title: string;
  excerpt: string;
  url: string;
}

export function SocialShare({ title, excerpt, url }: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : url;
  const encodedTitle = encodeURIComponent(title);
  const encodedExcerpt = encodeURIComponent(excerpt);
  const encodedUrl = encodeURIComponent(shareUrl);

  const socialPlatforms = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'text-blue-600 hover:text-blue-700',
      bgColor: 'hover:bg-blue-50'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: 'text-sky-500 hover:text-sky-600',
      bgColor: 'hover:bg-sky-50'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: 'text-green-600 hover:text-green-700',
      bgColor: 'hover:bg-green-50'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'text-blue-700 hover:text-blue-800',
      bgColor: 'hover:bg-blue-50'
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=${encodedTitle}&body=${encodedExcerpt}%0A%0A${encodedUrl}`,
      color: 'text-gray-600 hover:text-gray-700',
      bgColor: 'hover:bg-gray-50'
    }
  ];

  const handleNativeShare = async () => {
    setIsSharing(true);
    
    const shareData = {
      title,
      text: excerpt,
      url: shareUrl,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        setIsOpen(false);
      } else {
        // Fallback to showing social options
        setIsOpen(!isOpen);
      }
    } catch (error:any) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error);
        setIsOpen(!isOpen);
      }
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleSocialShare = (platform: typeof socialPlatforms[0]) => {
    window.open(platform.url, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={handleNativeShare}
        disabled={isSharing}
        className="text-gray-200 hover:text-gray-700"
      >
        <Share2 className="h-4 w-4" />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Share this article
              </h3>
              
              {/* Copy Link */}
              <div className="mb-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyLink}
                  className="w-full justify-start text-left p-2 h-auto hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div className="flex items-center space-x-3">
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-600" />
                    )}
                    <span className="text-sm">
                      {copied ? 'Link copied!' : 'Copy link'}
                    </span>
                  </div>
                </Button>
              </div>

              {/* Social Platforms */}
              <div className="space-y-1">
                {socialPlatforms.map((platform) => {
                  const IconComponent = platform.icon;
                  return (
                    <Button
                      key={platform.name}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSocialShare(platform)}
                      className={`w-full justify-start text-left p-2 h-auto ${platform.bgColor}`}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className={`h-4 w-4 ${platform.color}`} />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Share on {platform.name}
                        </span>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}