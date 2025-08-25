import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HeartIcon, ExternalLinkIcon, CalendarIcon } from "lucide-react"
import { getUserLikes } from "../actions"


export async function LikedArticles() {
  const likes = await getUserLikes()

  if (likes.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <HeartIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No liked articles yet</h3>
          <p className="text-muted-foreground text-center">
            Like articles to show your appreciation and save them here
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Liked Articles</h2>
        <Badge variant="secondary">{likes.length} articles</Badge>
      </div>

      <div className="grid gap-4">
        {likes.map((like) => (
          <Card key={like.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex gap-4">
                {like.event.image && (
                  <img
                    src={like.event.image || "/placeholder.svg"}
                    alt={like.event.title}
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{like.event.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{like.event.summary}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="font-medium">{like.event.topic}</span>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          {new Date(like.event.publishedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={`/event/${like.event.id}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLinkIcon className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <HeartIcon className="h-4 w-4 fill-current text-red-500" />
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
