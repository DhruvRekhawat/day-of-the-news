// utils/articleActions.ts

interface ArticleActionsState {
    isBookmarked: boolean;
    isLiked: boolean;
    totalLikes: number;
  }
  
  export async function getArticleActionsState(articleId: string): Promise<ArticleActionsState> {
    try {
      const [bookmarkResponse, likeResponse] = await Promise.all([
        fetch(`/api/bookmarks?articleId=${articleId}`),
        fetch(`/api/likes?articleId=${articleId}`)
      ]);
  
      const [bookmarkData, likeData] = await Promise.all([
        bookmarkResponse.json(),
        likeResponse.json()
      ]);
  
      return {
        isBookmarked: bookmarkData.isBookmarked || false,
        isLiked: likeData.isLiked || false,
        totalLikes: likeData.totalLikes || 0
      };
    } catch (error) {
      console.error('Error fetching article actions state:', error);
      return {
        isBookmarked: false,
        isLiked: false,
        totalLikes: 0
      };
    }
  }
  
  export async function toggleBookmark(articleId: string, isCurrentlyBookmarked: boolean): Promise<boolean> {
    try {
      const response = await fetch('/api/bookmarks', {
        method: isCurrentlyBookmarked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ articleId }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to toggle bookmark');
      }
  
      return !isCurrentlyBookmarked;
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      throw error;
    }
  }
  
  export async function toggleLike(articleId: string, isCurrentlyLiked: boolean): Promise<{ isLiked: boolean; totalLikes: number }> {
    try {
      const response = await fetch('/api/likes', {
        method: isCurrentlyLiked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ articleId }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to toggle like');
      }
  
      const data = await response.json();
      return {
        isLiked: !isCurrentlyLiked,
        totalLikes: data.totalLikes
      };
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  }