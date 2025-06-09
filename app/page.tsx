import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Bias indicator component
function BiasIndicator({
  leftPercent,
  centerPercent,
  rightPercent,
}: {
  leftPercent: number;
  centerPercent?: number;
  rightPercent: number;
}) {
  return (
    <div className="flex w-full h-2 rounded-full overflow-hidden">
      <div className="bg-red-500" style={{ width: `${leftPercent}%` }}></div>
      {centerPercent && (
        <div
          className="bg-gray-400"
          style={{ width: `${centerPercent}%` }}
        ></div>
      )}
      <div className="bg-blue-500" style={{ width: `${rightPercent}%` }}></div>
    </div>
  );
}

// Simple bias indicator for recent news
function SimpleBiasIndicator({ rightPercent }: { rightPercent: number }) {
  const leftPercent = 100 - rightPercent;
  return (
    <div className="flex w-16 h-1 rounded-full overflow-hidden">
      <div className="bg-red-500" style={{ width: `${leftPercent}%` }}></div>
      <div className="bg-blue-500" style={{ width: `${rightPercent}%` }}></div>
    </div>
  );
}

export default function HomePage() {
  const recentNews = [
    {
      title: "The heartbeat of a billion: What Virat Kohli meant to",
      category: "Sports, India",
      rightBias: 55,
    },
    {
      title: "Georgetown academic released from immigration detention afte...",
      category: "Education, Judiciary",
      rightBias: 55,
    },
    {
      title: "Why India could not stop IMF bailout to Pakistan",
      category: "India, Pakistan",
      rightBias: 55,
    },
    {
      title:
        "Beginning of the end? Ukraine's front-line soldiers eye Russia tal...",
      category: "Russia, Ukraine",
      rightBias: 55,
    },
    {
      title: "Drone attacks raise stakes in new phase of Sudan's civil war",
      category: "Africa, War",
      rightBias: 55,
    },
    {
      title: "Drone attacks raise stakes in new phase of Sudan's civil war",
      category: "Africa, War",
      rightBias: 55,
    },
    {
      title: "Drone attacks raise stakes in new phase of Sudan's civil war",
      category: "Africa, War",
      rightBias: 55,
    },
    {
      title: "Drone attacks raise stakes in new phase of Sudan's civil war",
      category: "Africa, War",
      rightBias: 55,
    },
    {
      title: "Drone attacks raise stakes in new phase of Sudan's civil war",
      category: "Africa, War",
      rightBias: 55,
    },
    {
      title: "Drone attacks raise stakes in new phase of Sudan's civil war",
      category: "Africa, War",
      rightBias: 55,
    },
  ];

  const featuredStories = [
    {
      title:
        "Trump meets interim Syrian president Damascus celebrates lifting of sanctions",
      image: "/placeholder.png?height=400&width=600",
      leftBias: 22,
      centerBias: 28,
      rightBias: 40,
      isMain: true,
    },
    {
      title: "Trump says Rubio to head to Ukraine talks in Turkey",
      description:
        "Trump decided on Rubio after initially considering attending the negotiations himself during his first major overseas trip to the...",
      image: "/placehoder.png",
      rightCoverage: 24,
      sources: 14,
      time: "2 hours ago",
      isMain: false,
    },
    {
      title:
        "Air Force One greeted by fighter escorts during Trump's Midwest visit",
      description:
        "Trump decided on Rubio after initially considering attending the negotiations himself during his first major overseas trip to the...",
      image: "/placehoder.png",
      rightCoverage: 24,
      sources: 14,
      time: "2 hours ago",
      isMain: false,
    },
  ];

  const sidebarNews = [
    {
      title: "Union Cabinet approves crore HC...",
      time: "2 hours ago",
      image: "/placeholder.png?height=100&width=150",
    },
    {
      title: "Union Cabinet approves crore HC...",
      time: "3 hours ago",
      image: "/placeholder.png?height=100&width=150",
    },
  ];

  const localNews = [
    {
      title: "Trump says Rubio to head to Ukraine talks in...",
      excerpt:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      time: "2 hours ago",
      category: "Politics",
    },
    {
      title: "Indian academic released from US imm...",
      excerpt:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      time: "3 hours ago",
      category: "International",
    },
    {
      title: "Construction sites appear in Gaza ahead...",
      excerpt:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      time: "4 hours ago",
      category: "International",
    },
    {
      title: "Meet the 'invisible crew' who have 35 seconds...",
      excerpt:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      time: "5 hours ago",
      category: "Sports",
    },
  ];

  const politicsNews = [
    {
      title:
        "Union Cabinet approves crore HCL-Foxconn semiconductor project in Gujarat",
      time: "2 hours ago",
      image: "/placeholder.png?height=150&width=200",
    },
    {
      title:
        "Air Force One greeted by fighter escorts during Trump's Midwest visit",
      time: "3 hours ago",
      image: "/placeholder.png?height=150&width=200",
    },
    {
      title:
        "Air Force One greeted by fighter escorts during Trump's Midwest visit",
      time: "4 hours ago",
      image: "/placeholder.png?height=150&width=200",
    },
    {
      title:
        "Air Force One greeted by fighter escorts during Trump's Midwest visit",
      time: "5 hours ago",
      image: "/placeholder.png?height=150&width=200",
    },
  ];

  const moreNewsItems = [
    "Juror removed from mushroom lunch murder trial",
    "Three Minn MPs face suspension over 'intimidating' haka",
    "Mark Carney says Canadians are not 'impressed' by UK's invite to Trump",
    "Mark Carney says Canadians are not 'impressed' by UK's invite to Trump",
    "Mark Carney says Canadians are not 'impressed' by UK's invite to Trump",
  ];

  const socialAccounts = [
    { name: "Cricket", followers: "+" },
    { name: "Business", followers: "+" },
    { name: "Sports", followers: "+" },
    { name: "Football", followers: "+" },
    { name: "USA", followers: "+" },
    { name: "Brooklyn", followers: "+" },
    { name: "Sam Altman", followers: "+" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section with Three Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Sidebar - Recent News */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">RECENT NEWS</h2>
            </div>

            <div className="space-y-4">
              {recentNews.map((news, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="text-4xl font-light  min-w-[2rem]">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium  mb-2 text-sm leading-tight">
                      {news.title}
                    </h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <SimpleBiasIndicator rightPercent={news.rightBias} />
                      <span className="text-xs text-gray-500">
                        {news.rightBias}%R
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">{news.category}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Center - Featured Stories */}
          <div className="lg:col-span-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">TOP STORY</h2>
            </div>

            <div className="space-y-6">
              {/* Main Featured Story */}
              <article className="relative">
                <div className="relative">
                  <Image
                    src={featuredStories[0].image || "/placeholder.png"}
                    alt={featuredStories[0].title}
                    width={600}
                    height={400}
                    className="w-full h-80 object-cover rounded-lg"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                    <h1 className="text-white font-bold text-2xl mb-4 leading-tight">
                      {featuredStories[0].title}
                    </h1>
                    <div className="flex items-center space-x-4 text-white text-sm">
                      <div className="flex items-center space-x-2">
                        <span>Left {featuredStories[0].leftBias}%</span>
                        <span>Center {featuredStories[0].centerBias}%</span>
                        <span>Right {featuredStories[0].rightBias}%</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <BiasIndicator
                        leftPercent={featuredStories[0].leftBias || 0}
                        centerPercent={featuredStories[0].centerBias || 0}
                        rightPercent={featuredStories[0].rightBias || 0}
                      />
                    </div>
                  </div>
                </div>
              </article>

              {/* Secondary Featured Stories */}
              <div className="space-y-4">
                {featuredStories.slice(1).map((story, index) => (
                  <article
                    key={index}
                    className="flex space-x-4 bg-white p-4 rounded-lg"
                  >
                    <Image
                      src={story.image || "/placeholder.png"}
                      alt={story.title}
                      width={120}
                      height={80}
                      className="w-32 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold  mb-2 text-lg leading-tight">
                        {story.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {story.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-2">
                          <SimpleBiasIndicator
                            rightPercent={story.rightCoverage || 50}
                          />
                          <span>
                            {story.rightCoverage}% Right Coverage:{" "}
                            {story.sources} sources
                          </span>
                        </div>
                        <span>{story.time}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Uncovered */}
          <div className="lg:col-span-3">
            <section className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h3 className="font-semibold  mb-2">UNCOVERED</h3>
              <p className="text-sm text-gray-600 mb-4">
                News covered by both sides of the political spectrum.
              </p>

              {/* Bias indicator for uncovered section */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-2 h-8 bg-red-500 rounded"></div>
                <div className="flex-1 h-1 bg-gray-200 rounded"></div>
                <div className="w-2 h-8 bg-blue-500 rounded"></div>
              </div>

              <div className="space-y-4">
                {sidebarNews.map((news, index) => (
                  <article key={index} className="flex space-x-3">
                    <Image
                      src={news.image || "/placeholder.png"}
                      alt={news.title}
                      width={80}
                      height={60}
                      className="w-16 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium  leading-tight">
                        {news.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">{news.time}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Social Accounts */}
            <section className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold  mb-4">
                Social Accounts
              </h3>
              <div className="space-y-3">
                {socialAccounts.map((account, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <span className="text-sm font-medium ">
                        {account.name}
                      </span>
                    </div>
                    <Button size="sm" variant="ghost" className="text-gray-500">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Rest of the content remains the same */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-4">
            {/* Local News */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Local News</h2>
                <Link
                  href="#"
                  className="text-sm text-blue-600 hover:underline"
                >
                  See all
                </Link>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {localNews.map((news, index) => (
                  <article
                    key={index}
                    className="bg-white p-6 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs text-gray-500">
                        {news.category}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{news.time}</span>
                    </div>
                    <h3 className="font-semibold  mb-2">
                      {news.title}
                    </h3>
                    <p className="text-sm text-gray-600">{news.excerpt}</p>
                  </article>
                ))}
              </div>
            </section>

            {/* Politics Section */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Politics</h2>
                <Link
                  href="#"
                  className="text-sm text-blue-600 hover:underline"
                >
                  See all
                </Link>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {politicsNews.map((news, index) => (
                  <article
                    key={index}
                    className="bg-white rounded-lg overflow-hidden shadow-sm"
                  >
                    <Image
                      src={news.image || "/placeholder.png"}
                      alt={news.title}
                      width={200}
                      height={150}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-medium  mb-2 text-sm leading-tight">
                        {news.title}
                      </h3>
                      <p className="text-xs text-gray-500">{news.time}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Israel-Hamas Conflict */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Israel-Hamas Conflict</h2>
                <Link
                  href="#"
                  className="text-sm text-blue-600 hover:underline"
                >
                  See all
                </Link>
              </div>

              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <article
                    key={index}
                    className="flex space-x-4 bg-white p-4 rounded-lg shadow-sm"
                  >
                    <Image
                      src="/placeholder.png?height=80&width=120"
                      alt="News image"
                      width={120}
                      height={80}
                      className="w-24 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium  mb-1 text-sm">
                        Air Force One greeted by fighter escorts during Trump&apos;s
                        Midwest visit
                      </h3>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Business & Sports Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Business</h2>
                  <Link
                    href="#"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    See all
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <article
                      key={index}
                      className="bg-white rounded-lg overflow-hidden shadow-sm"
                    >
                      <Image
                        src="/placeholder.png?height=100&width=150"
                        alt="Business news"
                        width={150}
                        height={100}
                        className="w-full h-20 object-cover"
                      />
                      <div className="p-3">
                        <h3 className="text-xs font-medium  leading-tight">
                          Air Force One greeted by fighter escorts during
                          Trump&apos;s Midwest visit
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          2 hours ago
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Sports</h2>
                  <Link
                    href="#"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    See all
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <article
                      key={index}
                      className="bg-white rounded-lg overflow-hidden shadow-sm"
                    >
                      <Image
                        src="/placeholder.png?height=100&width=150"
                        alt="Sports news"
                        width={150}
                        height={100}
                        className="w-full h-20 object-cover"
                      />
                      <div className="p-3">
                        <h3 className="text-xs font-medium  leading-tight">
                          Air Force One greeted by fighter escorts during
                          Trump&apos;s Midwest visit
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          2 hours ago
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            {/* More News */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">More News</h2>
                <Link
                  href="#"
                  className="text-sm text-blue-600 hover:underline"
                >
                  See all
                </Link>
              </div>

              <div className="space-y-4">
                {moreNewsItems.map((title, index) => (
                  <article
                    key={index}
                    className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm"
                  >
                    <Image
                      src="/placeholder.png?height=60&width=60"
                      alt="News thumbnail"
                      width={60}
                      height={60}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium  text-sm">
                        {title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-6 text-center">
                <Button variant="outline">View More News</Button>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
