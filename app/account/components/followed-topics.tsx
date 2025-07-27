import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TagIcon, UsersIcon, MinusIcon } from "lucide-react"
import { getUserFollowedTopics } from "../actions"


export async function FollowedTopics() {
  const followedTopics = await getUserFollowedTopics()

  if (followedTopics.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <TagIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No topics followed yet</h3>
          <p className="text-muted-foreground text-center">Follow topics to get personalized content recommendations</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Followed Topics</h2>
        <Badge variant="secondary">{followedTopics.length} topics</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {followedTopics.map((followedTopic) => (
          <Card key={followedTopic.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <TagIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{followedTopic.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <UsersIcon className="h-3 w-3" />
                      {/* {followedTopic.followers.toLocaleString()} followers */}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                >
                  <MinusIcon className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="w-full">
                View Articles
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
