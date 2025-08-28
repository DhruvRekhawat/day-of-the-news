import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pricing Plans - Day of the News",
  description: "Choose the perfect pricing plan for your news analysis needs. From free basic access to premium features with advanced bias detection and detailed reports.",
  keywords: ["pricing", "plans", "subscription", "premium", "free", "bias analysis", "news analysis"],
  openGraph: {
    title: "Pricing Plans - Day of the News",
    description: "Choose the perfect pricing plan for your news analysis needs. From free basic access to premium features with advanced bias detection and detailed reports.",
    type: "website",
    url: "https://dayofthenews.com/pricing",
  },
  twitter: {
    card: "summary",
    title: "Pricing Plans - Day of the News",
    description: "Choose the perfect pricing plan for your news analysis needs. From free basic access to premium features with advanced bias detection and detailed reports.",
  },
  alternates: {
    canonical: "https://dayofthenews.com/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


