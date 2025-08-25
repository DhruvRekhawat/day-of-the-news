"use client";

import { useState, useEffect } from "react";
import { Bookmark, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getEventActionsState, toggleEventBookmark, toggleEventLike } from "@/actions/eventActions";
import AuthModal from "./sign-in-modal";
import { authClient } from "@/lib/auth-client";

interface EventActionsProps {
  eventId: string;
  initialBookmarkCount?: number;
  initialLikeCount?: number;
  className?: string;
}

export function EventActions({ eventId, initialBookmarkCount = 0, initialLikeCount = 0, className = "" }: EventActionsProps) {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;



  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(initialBookmarkCount);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Only check state if user is authenticated and not loading
    if (user && !isPending) {
      const checkState = async () => {
        try {
          const state = await getEventActionsState(eventId);
          setIsBookmarked(state.isBookmarked);
          setIsLiked(state.isLiked);
          setLikeCount(state.totalLikes);
        } catch (error) {
          console.error('Error fetching event state:', error);
        } finally {
          setLoading(false);
        }
      };
      checkState();
      console.log("user authenticated:", user);
    } else if (!isPending) {
      setLoading(false);
      console.log("user is not authenticated");
    } else {
      console.log("session is loading");
    }
  }, [eventId, user, isPending]);

  // Debug showAuthModal changes
  useEffect(() => {
    console.log('showAuthModal changed to:', showAuthModal);
  }, [showAuthModal]);

  // Debug when AuthModal should be rendered
  useEffect(() => {
    if (showAuthModal) {
      console.log('AuthModal should be rendered, showAuthModal:', showAuthModal);
    }
  }, [showAuthModal]);

  const handleBookmark = async () => {
    console.log('🔵 handleBookmark function called!');
    console.log('=== handleBookmark START ===');
    console.log('user:', user);
    console.log('isPending:', isPending);
    console.log('showAuthModal before:', showAuthModal);
    
    if (!user || isPending) {
      console.log('User not authenticated or pending, setting showAuthModal to true');
      setShowAuthModal(true);
      console.log('showAuthModal after setState:', showAuthModal);
      console.log('=== handleBookmark EARLY RETURN ===');
      return;
    }

    console.log('User is authenticated, proceeding with API call');
    try {
      const newBookmarkState = await toggleEventBookmark(eventId, isBookmarked);
      setIsBookmarked(newBookmarkState);
      setBookmarkCount(prev => isBookmarked ? prev - 1 : prev + 1);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const handleLike = async () => {
    console.log('handleLike called, user:', user, 'isPending:', isPending);
    
    if (!user || isPending) {
      setShowAuthModal(true);
      console.log("showing auth modal");
      return;
    }

    try {
      const result = await toggleEventLike(eventId, isLiked);
      setIsLiked(result.isLiked);
      setLikeCount(result.totalLikes);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button variant="ghost" size="sm" disabled>
          <Bookmark className="h-4 w-4" />
          <span className="ml-1">{bookmarkCount}</span>
        </Button>
        <Button variant="ghost" size="sm" disabled>
          <ThumbsUp className="h-4 w-4" />
          <span className="ml-1">{likeCount}</span>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className={`flex items-center gap-2 ${className}`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBookmark}
          className={`hover:bg-blue-50 dark:hover:bg-blue-950/20 ${
            isBookmarked ? 'text-blue-600 dark:text-blue-400' : ''
          }`}
        >
          <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
          <span className="ml-1">{bookmarkCount}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={`hover:bg-red-50 dark:hover:bg-red-950/20 ${
            isLiked ? 'text-red-600 dark:text-red-400' : ''
          }`}
        >
          <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          <span className="ml-1">{likeCount}</span>
        </Button>
        
     </div>

      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal} 
          onOpenChange={setShowAuthModal}
        />
      )}
    </>
  );
}
