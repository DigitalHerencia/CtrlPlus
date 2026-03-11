import { SiteFooter } from "@/components/shared/site-footer";
import { SiteHeader } from "@/components/shared/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  Calendar,
  CreditCard,
  Settings,
  Shield,
  Smartphone,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const features = [
    {
      icon: Zap,
      title: "See It Before You Wrap It",
      description: "Upload a photo of your ride and preview your new look before you commit.",
    },
    {
      icon: Smartphone,
      title: "Styles That Fit El Paso",
      description:
        "Choose bold colors, clean finishes, and standout designs built for Sun City streets.",
    },
    {
      icon: Calendar,
      title: "Book in Minutes",
      description:
        "Pick a time that works for you and lock in your appointment without the back-and-forth.",
    },
    {
      icon: Users,
      title: "Clear, Upfront Pricing",
      description:
        "Get transparent pricing so you know exactly what your project includes before install day.",
    },
    {
      icon: BarChart3,
      title: "Built for Work Vehicles",
      description:
        "Turn trucks, vans, and fleets into rolling ads that get noticed all across El Paso.",
    },
    {
      icon: Shield,
      title: "Secure Checkout",
      description: "Reserve your project with trusted payment processing and instant confirmation.",
    },
    {
      icon: CreditCard,
      title: "Track Your Project",
      description: "Stay in the loop from booking to installation with clear progress updates.",
    },
    {
      icon: TrendingUp,
      title: "Local Support, Fast Answers",
      description:
        "Need help? Get responsive support from a team that understands the El Paso market.",
    },
    {
      icon: Settings,
      title: "Results That Turn Heads",
      description: "Drive away with a professional wrap finish built to stand out day and night.",
    },
  ];

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
        "Texas-compliant shades",
      ],
      popular: false,
      cta: "Book Tint Consultation",
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
        "Fleet branding available",
      ],
      popular: true,
      cta: "Start Your Wrap Design",
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
        "Fast turnaround",
      ],
      popular: false,
      cta: "Get Custom Quote",
    },
  ];

  return (
    <>
      <SiteHeader />
      <div className="min-h-screen bg-neutral-900 text-neutral-100">
        {/* Hero Section */}
        <section className="relative flex min-h-screen w-full items-center justify-start overflow-hidden py-16 lg:py-20">
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
            <div className="absolute inset-0 bg-neutral-900/60" />
          </div>

          {/* Hero Content - Left aligned */}
          <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-start px-6 pt-8 text-left sm:px-8 lg:px-12 lg:pt-12">
            <div className="max-w-2xl">
              <h1 className="mb-4 max-w-4xl text-4xl leading-tight font-black tracking-tight whitespace-nowrap uppercase sm:text-5xl lg:text-6xl">
                Command Your <span className="text-blue-600">Brand</span>
              </h1>
              <p className="mb-8 text-xl leading-tight font-semibold text-neutral-100 sm:text-2xl">
                Transform your ride with premium vehicle wraps. Visualize designs on your car, book
                your appointment, and drive in style.
              </p>
              <div>
                <Link href="/sign-up">
                  <Button
                    size="lg"
                    className="bg-blue-600 px-10 py-6 text-lg font-semibold text-neutral-100 shadow-xl transition-all hover:border-2 hover:border-blue-600 hover:bg-transparent hover:text-blue-600 hover:shadow-2xl"
                  >
                    Start Your New Project
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-neutral-900 px-6 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-7xl pb-10">
            <div className="mb-14 py-10 text-center lg:mb-16">
              <h2 className="mb-4 text-4xl font-black tracking-tight text-neutral-100 uppercase sm:text-5xl lg:text-6xl">
                Built for El Paso Drivers Who Want to{" "}
                <span className="text-blue-600">Stand Out</span>
              </h2>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:gap-10">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={idx}
                    className="border-neutral-700 bg-neutral-900 transition-all duration-300 hover:border-blue-600/50 hover:shadow-lg hover:shadow-blue-600/10"
                  >
                    <CardHeader className="pb-4">
                      <div className="mb-5 flex h-12 w-12 items-center justify-center bg-blue-600/10">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl font-semibold text-blue-600">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="leading-relaxed text-neutral-100">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="relative overflow-hidden bg-neutral-900 px-6 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="absolute inset-0 z-0">
            <Image
              src="/chili-truck-el-paso-downtown.png"
              alt="Pricing section background"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-neutral-900/80" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl">
            <div className="mb-14 py-10 text-center lg:mb-16">
              <h2 className="mb-4 text-4xl font-black tracking-tight uppercase sm:text-5xl lg:text-6xl">
                Fair and <span className="text-blue-600">Transparent</span> Pricing
              </h2>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3 md:gap-8 lg:gap-10">
              {pricingTiers.map((tier, idx) => (
                <Card
                  key={idx}
                  className={`relative flex flex-col ${
                    tier.popular
                      ? "scale-[1.03] border-blue-600 bg-neutral-900/95 shadow-xl ring-2 shadow-blue-600/20 ring-blue-600 hover:scale-[1.05]"
                      : "border-neutral-700 bg-neutral-900/90 hover:scale-[1.02]"
                  } backdrop-blur-sm transition-all duration-300 hover:shadow-2xl`}
                >
                  <CardHeader className="pt-8 pb-8">
                    <CardTitle className="text-2xl font-bold text-neutral-100">
                      {tier.name}
                    </CardTitle>
                    <CardDescription className="mt-2 text-base text-neutral-100">
                      {tier.description}
                    </CardDescription>
                    <div className="mt-6">
                      <span className="text-5xl font-extrabold text-neutral-100">{tier.price}</span>
                      <span className="ml-2 text-lg text-neutral-100">{tier.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col pb-8">
                    <ul className="mb-8 flex-1 space-y-4">
                      {tier.features.map((feature, fidx) => (
                        <li key={fidx} className="flex items-start gap-3">
                          <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center bg-blue-600/20">
                            <div className="h-2.5 w-2.5 bg-blue-600" />
                          </div>
                          <span className="text-base leading-relaxed text-neutral-100">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/sign-up" className="w-full">
                      <Button
                        className={`w-full py-6 text-base font-semibold ${
                          tier.popular
                            ? "bg-blue-600 text-neutral-100 shadow-lg hover:bg-blue-600"
                            : "bg-neutral-900 text-neutral-100 hover:bg-neutral-900"
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
  );
}
