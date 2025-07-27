import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookmarkIcon, ExternalLinkIcon, CalendarIcon } from "lucide-react"
import { getUserBookmarks } from "../actions"


export async function BookmarkedArticles() {
  const bookmarks = await getUserBookmarks()

  if (bookmarks.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BookmarkIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No bookmarks yet</h3>
          <p className="text-muted-foreground text-center">Start bookmarking articles you want to read later</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Bookmarks</h2>
        <Badge variant="secondary">{bookmarks.length} articles</Badge>
      </div>

      <div className="grid gap-4">
        {bookmarks.map((bookmark:any) => (
          <Card key={bookmark.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex gap-4">
                {bookmark.article.image && (
                  <img
                    src={bookmark.article.image || "/placeholder.svg"}
                    alt={bookmark.article.title}
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{bookmark.article.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{bookmark.article.excerpt}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="font-medium">{bookmark.article.source}</span>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          {new Date(bookmark.article.publishedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={bookmark.article.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLinkIcon className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <BookmarkIcon className="h-4 w-4 fill-current" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
