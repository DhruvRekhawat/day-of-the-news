import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us - Day of the News",
  description: "Get in touch with the Day of the News team. We're here to help with questions, feedback, or collaboration opportunities.",
  keywords: ["contact", "support", "feedback", "get in touch", "help"],
  openGraph: {
    title: "Contact Us - Day of the News",
    description: "Get in touch with the Day of the News team. We're here to help with questions, feedback, or collaboration opportunities.",
    type: "website",
    url: "https://dayofthenews.com/contact",
  },
  twitter: {
    card: "summary",
    title: "Contact Us - Day of the News",
    description: "Get in touch with the Day of the News team. We're here to help with questions, feedback, or collaboration opportunities.",
  },
  alternates: {
    canonical: "https://dayofthenews.com/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


