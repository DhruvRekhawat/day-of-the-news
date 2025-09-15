import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { Users, Target, Lightbulb, Heart } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us - Day of the News",
  description: "Learn about Day of the News, our mission to provide unbiased news analysis, and how we use AI to detect media bias and help readers make informed decisions.",
  keywords: ["about us", "mission", "unbiased news", "media bias detection", "AI news analysis", "team"],
  openGraph: {
    title: "About Us - Day of the News",
    description: "Learn about Day of the News, our mission to provide unbiased news analysis, and how we use AI to detect media bias.",
    type: "website",
    url: "https://dayofthenews.com/about",
  },
  twitter: {
    card: "summary",
    title: "About Us - Day of the News",
    description: "Learn about Day of the News, our mission to provide unbiased news analysis, and how we use AI to detect media bias.",
  },
  alternates: {
    canonical: "https://dayofthenews.com/about",
  },
};

export default function AboutPage() {
  const stats = [
    { number: "50+", label: "News Sources" },
    { number: "1000+", label: "Daily Articles" },
    { number: "100k+", label: "Monthly Users" },
    { number: "99%", label: "Accuracy Rate" },
  ]

  const values = [
    {
      icon: Users,
      title: "Integrity",
      description:
        "We maintain up-to-date information to prevent misrepresentation and errors, ensuring our users always have access to accurate news analysis.",
    },
    {
      icon: Target,
      title: "Innovation",
      description:
        "Continuously developing new features to enhance user experience and provide comprehensive, in-depth news coverage through advanced AI integration.",
    },
    {
      icon: Lightbulb,
      title: "User-oriented",
      description:
        "We prioritize user feedback and data transparency, ensuring our platform evolves to meet the needs of our community.",
    },
    {
      icon: Heart,
      title: "Prudence",
      description:
        "Taking a careful approach to AI implementation, fact-checking, and bias analysis to maintain the highest standards of news reporting.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <Image
                src="/placeholder.png?height=400&width=600"
                alt="Team collaboration"
                width={600}
                height={400}
                className=""
                unoptimized
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-6">About Day of the News</h1>
              <p className="text-gray-600 dark:text-gray-200 mb-6">
                Day of the News is a pioneering news platform dedicated to increasing transparency in the
                Indian media landscape. Founded by Nikhil Garg, a recent Imperial College London graduate,
                our mission is to hold mass media outlets accountable for biases in their reporting and
                empower readers with unbiased news analysis.
              </p>
              <p className="text-gray-600 dark:text-gray-200">
                Through advanced AI integration and comprehensive data collection from various sources,
                including the Ministry of Corporate Affairs for ownership data, we provide accurate
                ratings for media agencies and deliver the latest news with transparency and integrity.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Expert Team</h2>
                <p className="text-gray-600 dark:text-gray-200">
                  Our dedicated team combines expertise in journalism, technology, and data analysis to
                  deliver comprehensive news coverage. We leverage cutting-edge AI technology while
                  maintaining human oversight to ensure accuracy and fairness in our reporting.
                </p>
              </div>
              <div className="relative">
                <Image
                  src="/placeholder.png?height=400&width=600"
                  alt="Team meeting"
                  width={600}
                  height={400}
                  className=""
                  unoptimized
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Impact</h2>
              <p className="text-gray-600 dark:text-gray-200">
                At Day of the News, we&apos;re committed to revolutionizing how news is consumed in India.
                By providing bias analysis and comprehensive coverage, we help readers make informed
                decisions about their news consumption. Our platform combines advanced AI technology
                with human expertise to deliver accurate, unbiased news summaries and analysis.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-gray-600 dark:text-gray-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div className="relative">
                <Image
                  src="/placeholder.png?height=400&width=600"
                  alt="Team collaboration"
                  width={600}
                  height={400}
                  className=""
                  unoptimized
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gray-900 bg-opacity-90 text-white p-6 rounded-b-lg">
                  <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
                  <p className="text-sm">
                    We strive to bring transparency to Indian media by providing unbiased news analysis
                    and holding media outlets accountable through data-driven insights and advanced
                    AI technology.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-8">Our Values</h2>
                <div className="space-y-6">
                  {values.map((value, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="bg-gray-100 p-3 rounded-full">
                        <value.icon className="w-6 h-6 text-gray-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{value.title}</h3>
                        <p className="text-gray-600 dark:text-gray-200 text-sm">{value.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
