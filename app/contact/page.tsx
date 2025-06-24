import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Left Column - Contact Info */}
          <div>
            <h1 className="text-4xl font-bold  mb-6">Let&apos;s Talk</h1>
            <p className="text-gray-600 dark:text-gray-200 mb-12">
              Have some big idea or brand to develop and need help? Then reach out we&apos;d love to hear about your project
              and provide help
            </p>

            <div className="mb-12">
              <h2 className="text-2xl font-semibold  mb-4">Email</h2>
              <p className="text-gray-600 dark:text-gray-200">dayofthenews@gmail.com</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold  mb-4">Socials</h2>
              <div className="space-y-2">
                <Link href="#" className="block text-gray-600 dark:text-gray-200 hover:">
                  Instagram
                </Link>
                <Link href="#" className="block text-gray-600 dark:text-gray-200 hover:">
                  Twitter
                </Link>
                <Link href="#" className="block text-gray-600 dark:text-gray-200 hover:">
                  Facebook
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div>
            <form className="space-y-6">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" className="mt-2" />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" className="mt-2" />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" rows={6} className="mt-2" />
              </div>

              <Button className="w-full bg-gray-900 hover:bg-gray-800">Submit</Button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
