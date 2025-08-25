import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Frequently Asked Questions - Day of the News",
  description: "Find answers to common questions about Day of the News, our bias analysis methodology, and how we help you understand media bias and make informed decisions.",
  keywords: ["FAQ", "frequently asked questions", "bias analysis", "media bias", "news analysis", "help", "support"],
  openGraph: {
    title: "Frequently Asked Questions - Day of the News",
    description: "Find answers to common questions about Day of the News, our bias analysis methodology, and how we help you understand media bias.",
    type: "website",
    url: "https://dayofthenews.com/faq",
  },
  twitter: {
    card: "summary",
    title: "Frequently Asked Questions - Day of the News",
    description: "Find answers to common questions about Day of the News, our bias analysis methodology, and how we help you understand media bias.",
  },
  alternates: {
    canonical: "https://dayofthenews.com/faq",
  },
};

export default function FAQPage() {
  const faqs = [
    {
      question: "What is Day of the News?",
      answer:
        "Day of the News is your go-to platform for understanding news bias and reliability. We analyze stories from multiple perspectives, highlighting political leanings, factual accuracy, and diverse viewpoints so you can stay informed and empowered.",
      defaultOpen: true,
    },
    {
      question: "How does the bias analysis work?",
      answer:
        "Our bias analysis uses advanced algorithms and expert review to evaluate news sources across multiple dimensions including political lean, factual accuracy, and editorial standards.",
    },
    {
      question: "Why should I trust Day of the News?",
      answer:
        "We maintain transparency in our methodology, employ diverse teams of analysts, and regularly audit our processes to ensure accuracy and fairness in our assessments.",
    },
    {
      question: "Is Day of the News free to use?",
      answer:
        "We offer both free and premium tiers. Basic access to our bias ratings and analysis is free, while premium features include detailed reports and advanced filtering options.",
    },
    {
      question: "How does Day of the News handle misinformation?",
      answer:
        "We have a dedicated team that identifies and flags misinformation, working with fact-checkers and using automated systems to detect potentially false or misleading content.",
    },
    {
      question: "Why should I care about news bias?",
      answer:
        "Understanding news bias helps you make more informed decisions by recognizing different perspectives and potential blind spots in reporting, leading to a more complete understanding of current events.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold  mb-4">FAQS</h1>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className=" border border-gray-200  px-6"
              >
                <AccordionTrigger className="text-left font-medium  hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-200 pb-6">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>

      <Footer />
    </div>
  )
}
