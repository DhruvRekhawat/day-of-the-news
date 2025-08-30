import type React from "react"
import type { Metadata } from "next"
import { Archivo } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/lib/auth-client"
import Script from "next/script"

const archivo = Archivo({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Day of the News - Unbiased News Analysis & Bias Detection",
    template: "%s | Day of the News"
  },
  description: "Get unbiased news analysis with AI-powered bias detection. Compare multiple sources, understand media bias, and stay informed with reliable news coverage from around the world.",
  keywords: ["news", "bias detection", "unbiased news", "media analysis", "news comparison", "fact checking", "reliable news sources"],
  authors: [{ name: "Day of the News Team" }],
  creator: "Day of the News",
  publisher: "Day of the News",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://dayofthenews.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dayofthenews.com',
    title: 'Day of the News - Unbiased News Analysis & Bias Detection',
    description: 'Get unbiased news analysis with AI-powered bias detection. Compare multiple sources, understand media bias, and stay informed with reliable news coverage.',
    siteName: 'Day of the News',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Day of the News - Unbiased News Analysis',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Day of the News - Unbiased News Analysis & Bias Detection',
    description: 'Get unbiased news analysis with AI-powered bias detection. Compare multiple sources, understand media bias, and stay informed.',
    images: ['/og-image.jpg'],
    creator: '@dayofthenews',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={archivo.className}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </AuthProvider>
        <Toaster />
        
        {/* Razorpay Script */}
        <Script
          id="razorpay-checkout-js"
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  )
}
