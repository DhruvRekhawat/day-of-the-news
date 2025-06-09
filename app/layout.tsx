import type React from "react"
import type { Metadata } from "next"
import { Archivo } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/ui/theme-provider"

const archivo = Archivo({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Day of the News",
  description: "Your go-to platform for understanding news bias and reliability",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
        <body className={archivo.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
