import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart3,
  Calendar,
  CreditCard,
  Settings,
  Shield,
  Smartphone,
  TrendingUp,
  Users,
  Zap
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  const features = [
    {
      icon: Zap,
      title: "See It Before You Wrap It",
      description: "Upload a photo of your ride and preview your new look before you commit."
    },
    {
      icon: Smartphone,
      title: "Styles That Fit El Paso",
      description:
        "Choose bold colors, clean finishes, and standout designs built for Sun City streets."
    },
    {
      icon: Calendar,
      title: "Book in Minutes",
      description:
        "Pick a time that works for you and lock in your appointment without the back-and-forth."
    },
    {
      icon: Users,
      title: "Clear, Upfront Pricing",
      description:
        "Get transparent pricing so you know exactly what your project includes before install day."
    },
    {
      icon: BarChart3,
      title: "Built for Work Vehicles",
      description:
        "Turn trucks, vans, and fleets into rolling ads that get noticed all across El Paso."
    },
    {
      icon: Shield,
      title: "Secure Checkout",
      description: "Reserve your project with trusted payment processing and instant confirmation."
    },
    {
      icon: CreditCard,
      title: "Track Your Project",
      description: "Stay in the loop from booking to installation with clear progress updates."
    },
    {
      icon: TrendingUp,
      title: "Local Support, Fast Answers",
      description:
        "Need help? Get responsive support from a team that understands the El Paso market."
    },
    {
      icon: Settings,
      title: "Results That Turn Heads",
      description: "Drive away with a professional wrap finish built to stand out day and night."
    }
  ]

  const pricingTiers = [
    {
      name: "Window Tinting",
      price: "$189",
      period: "/vehicle",
      description: "Beat the heat and protect your interior.",
      features: [
        "Ceramic, carbon, and dyed tint options",
        "Heat and UV rejection",
        "Warranty-backed installation",
        "Texas-compliant shades"
      ],
      popular: false,
      cta: "Book Tint Consultation"
    },
    {
      name: "Vehicle Wraps",
      price: "$2,499",
      period: "/project",
      description: "Transform your ride or fleet with custom wraps.",
      features: [
        "Matte, gloss, satin, and color-change films",
        "Custom design mockups included",
        "Full or partial wrap packages",
        "Fleet branding available"
      ],
      popular: true,
      cta: "Start Your Wrap Design"
    },
    {
      name: "Custom Signage",
      price: "$299",
      period: "/project",
      description: "High-impact signage for your business.",
      features: [
        "Banners, window graphics, and decals",
        "Indoor and outdoor materials",
        "Brand-consistent designs",
        "Fast turnaround"
      ],
      popular: false,
      cta: "Get Custom Quote"
    }
  ]

  return (
    <>
      <SiteHeader />
      <div className="min-h-screen bg-neutral-950 text-neutral-100">
        {/* Hero Section */}
        <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-start py-16 lg:py-20">
          {/* Background Image - Zoomed and positioned right */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/ctrlplus-fleet-night-showcase.png"
              alt="CTRL+ vehicle wraps showcase"
              fill
              className="object-cover"
              preload
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50" />
          </div>

          {/* Hero Content - Left aligned */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-left flex items-start pt-8 lg:pt-12 min-h-screen">
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl max-w-4xl font-black tracking-tight mb-4 leading-tight uppercase whitespace-nowrap">
                Command Your <span className="text-blue-600">Brand</span>
              </h1>
              <p className="text-xl sm:text-2xl text-neutral-100 mb-8 leading-tight font-semibold">
                Transform your ride with premium vehicle wraps. Visualize designs on your car, book
                your appointment, and drive in style.
              </p>
              <div>
                <Link href="/sign-up">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-transparent hover:border-2 hover:border-blue-600 hover:text-blue-600 text-neutral-100 px-10 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
                  >
                    Start Your New Project
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 lg:py-24 px-6 sm:px-8 lg:px-12 bg-neutral-950">
          <div className="max-w-7xl mx-auto pb-10">
            <div className="text-center mb-14 lg:mb-16 py-10">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 text-neutral-100 tracking-tight uppercase">
                Built for El Paso Drivers Who Want to{" "}
                <span className="text-blue-600">Stand Out</span>
              </h2>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
              {features.map((feature, idx) => {
                const Icon = feature.icon
                return (
                  <Card
                    key={idx}
                    className="bg-neutral-900 border-neutral-800 hover:border-blue-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/10"
                  >
                    <CardHeader className="pb-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-600/10 flex items-center justify-center mb-5">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl font-semibold text-blue-600">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-neutral-100 leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="relative overflow-hidden py-20 lg:py-24 px-6 sm:px-8 lg:px-12 bg-linear-to-b from-neutral-950 to-neutral-900">
          <div className="absolute inset-0 z-0">
            <Image
              src="/chili-truck-el-paso-downtown.png"
              alt="Pricing section background"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/70" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="text-center mb-14 lg:mb-16 py-10">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 tracking-tight uppercase">
                Fair and <span className="text-blue-600">Transparent</span> Pricing
              </h2>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10 items-stretch">
              {pricingTiers.map((tier, idx) => (
                <Card
                  key={idx}
                  className={`relative flex flex-col ${
                    tier.popular
                      ? "border-blue-600 bg-neutral-900/95 ring-2 ring-blue-600 shadow-xl shadow-blue-600/20 scale-[1.03] hover:scale-[1.05]"
                      : "bg-neutral-900/90 border-neutral-700 hover:scale-[1.02]"
                  } backdrop-blur-sm transition-all duration-300 hover:shadow-2xl`}
                >
                  <CardHeader className="pb-8 pt-8">
                    <CardTitle className="text-2xl font-bold text-neutral-100">
                      {tier.name}
                    </CardTitle>
                    <CardDescription className="text-neutral-100 text-base mt-2">
                      {tier.description}
                    </CardDescription>
                    <div className="mt-6">
                      <span className="text-5xl font-extrabold text-neutral-100">{tier.price}</span>
                      <span className="text-neutral-100 text-lg ml-2">{tier.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col pb-8">
                    <ul className="space-y-4 mb-8 flex-1">
                      {tier.features.map((feature, fidx) => (
                        <li key={fidx} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0 mt-1">
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                          </div>
                          <span className="text-neutral-100 text-base leading-relaxed">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/sign-up" className="w-full">
                      <Button
                        className={`w-full py-6 text-base font-semibold ${
                          tier.popular
                            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                            : "bg-neutral-800 hover:bg-neutral-700 text-neutral-100"
                        }`}
                      >
                        {tier.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <SiteFooter />
      </div>
    </>
  )
}
