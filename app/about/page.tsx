import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { Users, Target, Lightbulb, Heart } from "lucide-react"

export default function AboutPage() {
  const stats = [
    { number: "200+", label: "Worldwide offices" },
    { number: "85+", label: "Team members" },
    { number: "+10M", label: "Capital raised" },
    { number: "+500k", label: "Active users" },
  ]

  const values = [
    {
      icon: Users,
      title: "Team work",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit eium nec suscipit sit sed orma odio id risus ultrices",
    },
    {
      icon: Target,
      title: "OwnerShip",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit eium nec suscipit sit sed orma odio id risus ultrices",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit eium nec suscipit sit sed orma odio id risus ultrices",
    },
    {
      icon: Heart,
      title: "Team work",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit eium nec suscipit sit sed orma odio id risus ultrices",
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
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold  mb-6">About News of the Day</h1>
              <p className="text-gray-600 dark:text-gray-200 mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit eium nec suscipit sit sed orma odio id risus
                ultrices convallis placerat vel tristique diam lorem placerat aliquet lorem a aliquam incl accusam eget
                etiam ultrices. Lorem ipsum dolor sit amet, consectetur adipiscing elit eium nec suscipit sit sed orma
                odio id risus ultrices convallis placerat vel tristique diam lorem placerat aliquet lorem a aliquam incl
                accusam eget etiam ultrices.
              </p>
              <p className="text-gray-600 dark:text-gray-200">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit eium nec suscipit sit sed orma odio id risus
                ultrices convallis placerat vel tristique diam lorem placerat aliquet lorem a aliquam incl accusam eget
                etiam ultrices.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className=" py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold  mb-6">We&apos;re a team of experts</h2>
                <p className="text-gray-600 dark:text-gray-200">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit eium nec suscipit sit sed orma odio id risus
                  ultrices convallis placerat vel tristique diam lorem placerat aliquet lorem a aliquam incl accusam
                  eget etiam ultrices.
                </p>
              </div>
              <div className="relative">
                <Image
                  src="/placeholder.png?height=400&width=600"
                  alt="Team meeting"
                  width={600}
                  height={400}
                  className=""
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold  mb-6">About us</h2>
              <p className="text-gray-600 dark:text-gray-200">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit eium nec suscipit sit sed orma odio id risus
                ultrices convallis placerat vel tristique diam lorem placerat aliquet lorem a aliquam incl accusam eget
                etiam ultrices. Lorem ipsum dolor sit amet, consectetur adipiscing elit eium nec suscipit sit sed orma
                odio id risus ultrices convallis placerat vel tristique diam lorem placerat aliquet lorem a aliquam incl
                accusam eget etiam ultrices.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold  mb-2">{stat.number}</div>
                  <div className="text-gray-600 dark:text-gray-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className=" py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div className="relative">
                <Image
                  src="/placeholder.png?height=400&width=600"
                  alt="Team collaboration"
                  width={600}
                  height={400}
                  className=""
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gray-900 bg-opacity-90 text-white p-6 rounded-b-lg">
                  <h3 className="text-xl font-semibold mb-2">About us</h3>
                  <p className="text-sm ">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit eium nec suscipit sit sed orma odio id risus
                    ultrices convallis placerat vel tristique diam lorem placerat aliquet lorem a aliquam incl accusam
                    eget etiam ultrices.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold  mb-8">Our values</h2>
                <div className="space-y-6">
                  {values.map((value, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="bg-gray-100 p-3 rounded-full">
                        <value.icon className="w-6 h-6 text-gray-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold  mb-2">{value.title}</h3>
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
