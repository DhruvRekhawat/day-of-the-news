import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Image from "next/image";
import { Users, Target, Lightbulb, Heart } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Day of the News",
  description:
    "Learn about Day of the News, our mission to provide unbiased news analysis, and how we use AI to detect media bias and help readers make informed decisions.",
  keywords: [
    "about us",
    "mission",
    "unbiased news",
    "media bias detection",
    "AI news analysis",
    "team",
  ],
  openGraph: {
    title: "About Us - Day of the News",
    description:
      "Learn about Day of the News, our mission to provide unbiased news analysis, and how we use AI to detect media bias.",
    type: "website",
    url: "https://dayofthenews.com/about",
  },
  twitter: {
    card: "summary",
    title: "About Us - Day of the News",
    description:
      "Learn about Day of the News, our mission to provide unbiased news analysis, and how we use AI to detect media bias.",
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
  ];

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
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2 flex justify-center">
              <Image
                src="/images/Collaborative Work Session in Black and White.png"
                alt="Team collaboration"
                width={520}
                height={350}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 object-cover"
                unoptimized
                priority
              />
            </div>
            <div className="w-full md:w-1/2">
              <h1 className="text-3xl md:text-4xl font-semibold mb-6 tracking-tight text-zinc-900 dark:text-zinc-100">
                About Day of the News
              </h1>
              <p className="text-zinc-600 dark:text-zinc-300 mb-4 leading-relaxed">
                Day of the News is a pioneering news platform dedicated to increasing transparency in the Indian media landscape. Founded by Nikhil Garg, a recent Imperial College London graduate, our mission is to hold mass media outlets accountable for biases in their reporting and empower readers with unbiased news analysis.
              </p>
              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Through advanced AI integration and comprehensive data collection from various sources, including the Ministry of Corporate Affairs for ownership data, we provide accurate ratings for media agencies and deliver the latest news with transparency and integrity.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="container mx-auto px-4 py-20 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-zinc-900 dark:text-zinc-100">
                Our Expert Team
              </h2>
              <div className="space-y-4">
                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  Our dedicated team brings together deep expertise in journalism, technology, and data analysis to deliver comprehensive, trustworthy news coverage.
                </p>
                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  We believe that the best results come from a blend of human insight and advanced AI. Our journalists and technologists work side by side, using cutting-edge artificial intelligence to analyze news sources, while maintaining rigorous human oversight to ensure accuracy, fairness, and transparency in every report.
                </p>
                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  By fostering a culture of collaboration and continuous learning, our team is committed to upholding the highest standards of integrity and innovation in the Indian media landscape.
                </p>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
              <Image
                src="/images/Casual Office or Café Gathering.png"
                alt="Team meeting"
                width={420}
                height={220}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 object-cover"
                unoptimized
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-20 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-zinc-900 dark:text-zinc-100">
                Our Impact
              </h2>
              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                At Day of the News, we&apos;re committed to revolutionizing how news is consumed in India. By providing bias analysis and comprehensive coverage, we help readers make informed decisions about their news consumption. Our platform combines advanced AI technology with human expertise to deliver accurate, unbiased news summaries and analysis.
              </p>
            </div>
            <div className="w-full md:w-1/2 grid grid-cols-2 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center border border-zinc-100 dark:border-zinc-800 rounded-lg py-8 bg-white dark:bg-zinc-900"
                >
                  <div className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-zinc-500 dark:text-zinc-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="container mx-auto px-4 py-20 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2 flex justify-center">
              <Image
                src="/images/Handshake Close-Up.png"
                alt="Team collaboration"
                width={500}
                height={340}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 object-cover"
                unoptimized
              />
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-zinc-900 dark:text-zinc-100">
                Our Values
              </h2>
              <div className="space-y-6">
                {values.map((value, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-full flex items-center justify-center">
                      <value.icon className="w-6 h-6 text-zinc-700 dark:text-zinc-200" />
                    </div>
                    <div>
                      <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">{value.title}</h3>
                      <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
