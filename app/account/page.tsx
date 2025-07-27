import { Suspense } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookmarkIcon, HeartIcon, TagIcon, CrownIcon, SparklesIcon } from "lucide-react"
import { getUserAccountData } from "./actions"
import { BookmarkedArticles } from "./components/bookmarked-articles"
import { LikedArticles } from "./components/liked-articles"
import { FollowedTopics } from "./components/followed-topics"
import { LogoutButton } from "./components/logout-button"
import { ProfileImageEditor } from "./components/profile-image-editor"
import { Header } from "@/components/header"


export default async function AccountPage() {
  const userData = await getUserAccountData()

  if (!userData) {
    return (
      <div className="container mx-auto px-4 py-8">
        
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">User not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isPremium = true
  const isAdmin = false

  return (
    <>
    <Header/>
    
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header Section */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <ProfileImageEditor
                  currentImage={userData.image || undefined}
                  userName={userData.name || "User"}
                />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">{userData.name || "Anonymous User"}</h1>
                    {isAdmin && (
                      <Badge variant="destructive" className="gap-1">
                        <CrownIcon className="h-3 w-3" />
                        Admin
                      </Badge>
                    )}
                    {isPremium && !isAdmin && (
                      <Badge variant="default" className="gap-1">
                        <SparklesIcon className="h-3 w-3" />
                        Premium
                      </Badge>
                    )}
                    {userData.role === "FREE" && <Badge variant="secondary">Free</Badge>}
                  </div>
                  <p className="text-muted-foreground">{userData.email}</p>
                  <p className="text-sm text-muted-foreground">
                    Member since {new Date(userData.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <LogoutButton />
            </div>
          </CardHeader>
        </Card>

        {/* Upgrade Nudge for Free Users */}
        {userData.role === "FREE" && (
          <Card className="mt-4 border-amber-200 bg-amber-50">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <SparklesIcon className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-900">Upgrade to Premium</p>
                  <p className="text-sm text-amber-700">Get unlimited bookmarks, advanced features, and more!</p>
                </div>
              </div>
              <Button variant="default" className="bg-amber-600 hover:bg-amber-700">
                Upgrade Now
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <BookmarkIcon className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-2xl font-bold">{userData._count.Bookmark}</p>
              <p className="text-sm text-muted-foreground">Bookmarks</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <HeartIcon className="h-5 w-5 text-red-600" />
            <div>
              <p className="text-2xl font-bold">{userData._count.Like}</p>
              <p className="text-sm text-muted-foreground">Likes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <TagIcon className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-2xl font-bold">{userData._count.followedTopics}</p>
              <p className="text-sm text-muted-foreground">Topics</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="h-5 w-5 rounded-full bg-purple-600" />
            <div>
              <p className="text-2xl font-bold">{userData._count.interactions}</p>
              <p className="text-sm text-muted-foreground">Articles Read</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="bookmarks" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bookmarks" className="gap-2">
            <BookmarkIcon className="h-4 w-4" />
            Bookmarks
          </TabsTrigger>
          <TabsTrigger value="likes" className="gap-2">
            <HeartIcon className="h-4 w-4" />
            Likes
          </TabsTrigger>
          <TabsTrigger value="topics" className="gap-2">
            <TagIcon className="h-4 w-4" />
            Topics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bookmarks">
          <Suspense fallback={<div className="text-center py-8">Loading bookmarks...</div>}>
            <BookmarkedArticles  />
          </Suspense>
        </TabsContent>

        <TabsContent value="likes">
          <Suspense fallback={<div className="text-center py-8">Loading likes...</div>}>
            <LikedArticles  />
          </Suspense>
        </TabsContent>

        <TabsContent value="topics">
          <Suspense fallback={<div className="text-center py-8">Loading topics...</div>}>
            <FollowedTopics  />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
    </>
  )
}
