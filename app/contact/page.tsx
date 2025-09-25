"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import { toast } from "sonner"

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message must be less than 1000 characters"),
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success("Message sent successfully! We'll get back to you soon.")
        reset()
      } else {
        if (result.errors) {
          // Handle validation errors
          result.errors.forEach((error: any) => {
            toast.error(`${error.path.join(".")}: ${error.message}`)
          })
        } else {
          toast.error(result.message || "Failed to send message. Please try again.")
        }
      }
    } catch (error) {
      console.error("Contact form error:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Left Column - Contact Info */}
          <div>
            <h1 className="text-4xl font-bold mb-6">Let&apos;s Talk</h1>
            <p className="text-gray-600 dark:text-gray-200 mb-12">
              Have some big idea or brand to develop and need help? Then reach out we&apos;d love to hear about your project
              and provide help
            </p>

            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Email</h2>
              <p className="text-gray-600 dark:text-gray-200">dayofthenews@gmail.com</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Socials</h2>
              <div className="space-y-2">
                <Link href="#" className="block text-gray-600 dark:text-gray-200 hover:text-gray-800 dark:hover:text-gray-100 transition-colors">
                  Instagram
                </Link>
                <Link href="#" className="block text-gray-600 dark:text-gray-200 hover:text-gray-800 dark:hover:text-gray-100 transition-colors">
                  Twitter
                </Link>
                <Link href="#" className="block text-gray-600 dark:text-gray-200 hover:text-gray-800 dark:hover:text-gray-100 transition-colors">
                  Facebook
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  className={`mt-2 ${errors.name ? "border-red-500 focus:border-red-500" : ""}`}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  className={`mt-2 ${errors.email ? "border-red-500 focus:border-red-500" : ""}`}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  rows={6} 
                  className={`mt-2 ${errors.message ? "border-red-500 focus:border-red-500" : ""}`}
                  {...register("message")}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gray-900 dark:text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Submit"}
              </Button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
