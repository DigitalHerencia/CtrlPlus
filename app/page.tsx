import { SiteFooter } from '@/components/shared/site-footer'
import { SiteHeader } from '@/components/shared/site-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    BarChart3,
    Calendar,
    Car,
    CreditCard,
    MapPinned,
    Settings,
    Shield,
    Smartphone,
    Sparkles,
    TrendingUp,
    Users,
    Zap,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function HomePage() {
    const features = [
        {
            icon: Zap,
            title: 'See It Before You Wrap It',
            description: 'Upload a photo of your ride and preview your new look before you commit.',
        },
        {
            icon: Smartphone,
            title: 'Styles That Fit El Paso',
            description:
                'Choose bold colors, clean finishes, and standout designs built for Sun City streets.',
        },
        {
            icon: Calendar,
            title: 'Book in Minutes',
            description:
                'Pick a time that works for you and lock in your appointment without the back-and-forth.',
        },
        {
            icon: Users,
            title: 'Clear, Upfront Pricing',
            description:
                'Get transparent pricing so you know exactly what your project includes before install day.',
        },
        {
            icon: BarChart3,
            title: 'Built for Work Vehicles',
            description:
                'Turn trucks, vans, and fleets into rolling ads that get noticed all across El Paso.',
        },
        {
            icon: Shield,
            title: 'Secure Checkout',
            description:
                'Reserve your project with trusted payment processing and instant confirmation.',
        },
        {
            icon: CreditCard,
            title: 'Track Your Project',
            description:
                'Stay in the loop from booking to installation with clear progress updates.',
        },
        {
            icon: TrendingUp,
            title: 'Local Support, Fast Answers',
            description:
                'Need help? Get responsive support from a team that understands the El Paso market.',
        },
        {
            icon: Settings,
            title: 'Results That Turn Heads',
            description:
                'Drive away with a professional wrap finish built to stand out day and night.',
        },
    ]

    const pricingTiers = [
        {
            name: 'Window Tinting',
            price: '$189',
            period: '/vehicle',
            description: 'Beat the heat and protect your interior.',
            features: [
                'Ceramic, carbon, and dyed tint options',
                'Heat and UV rejection',
                'Warranty-backed installation',
                'Texas-compliant shades',
            ],
            popular: false,
            cta: 'Book Tint Consultation',
        },
        {
            name: 'Vehicle Wraps',
            price: '$2,499',
            period: '/project',
            description: 'Transform your ride or fleet with custom wraps.',
            features: [
                'Matte, gloss, satin, and color-change films',
                'Custom design mockups included',
                'Full or partial wrap packages',
                'Fleet branding available',
            ],
            popular: true,
            cta: 'Start Your Wrap Design',
        },
        {
            name: 'Custom Signage',
            price: '$299',
            period: '/project',
            description: 'High-impact signage for your business.',
            features: [
                'Banners, window graphics, and decals',
                'Indoor and outdoor materials',
                'Brand-consistent designs',
                'Fast turnaround',
            ],
            popular: false,
            cta: 'Get Custom Quote',
        },
    ]

    const mobileWhyItems = [
        {
            icon: Sparkles,
            title: 'Mobile preview in seconds',
        },
        {
            icon: Car,
            title: 'Built for trucks, vans, and fleets',
        },
        {
            icon: MapPinned,
            title: 'Local install, fast turnaround',
        },
    ]

    const currentYear = new Date().getFullYear()

    return (
        <>
            <div className="hidden md:block">
                <SiteHeader />
            </div>
            <div className="min-h-screen bg-neutral-900 text-neutral-100">
                <div className="supports-backdrop-filter:bg-neutral-950/90 sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur md:hidden">
                    <div className="mx-auto flex h-16 w-full max-w-7xl flex-row items-center justify-center gap-1 px-4">
                        <Link href="/" className="shrink-0" aria-label="CTRL+ Home">
                            <Image
                                src="/ctrlplus-logo.png"
                                alt="CTRL+"
                                width={100}
                                height={34}
                                className="h-6.5 w-auto"
                                priority
                            />
                        </Link>
                        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-100/95">
                            Tint <span className="text-neutral-500">|</span> Wraps{' '}
                            <span className="text-neutral-500">|</span> Signage
                        </p>
                    </div>
                </div>

                {/* Mobile Portrait Landing (matches bottom-bar breakpoint) */}
                <section className="relative min-h-dvh overflow-hidden bg-neutral-900 pb-[calc(7rem+env(safe-area-inset-bottom))] md:hidden">
                    <div className="absolute -top-5 z-0 ml-9 h-[55vh] w-screen overflow-hidden">
                        <Image
                            src="/features-bg.png"
                            alt="CTRL+ mobile vehicle wrap preview"
                            fill
                            sizes="100vw"
                            className="object-top-right"
                            priority
                        />
                    </div>

                    <div className="pointer-events-none absolute bottom-0 left-1/2 z-0 h-[36vh] w-screen -translate-x-1/2 overflow-hidden pt-10">
                        <Image
                            src="/wrapped-vehicles-night-star.png"
                            alt="Wrapped vehicles at night in El Paso"
                            fill
                            sizes="100vw"
                            className="object-bottom"
                            loading="lazy"
                        />
                        <div className="bg-linear-to-b -translate-y-15 absolute inset-x-0 top-0 h-[15vh] from-neutral-900 via-neutral-900/90 via-40% to-transparent" />
                    </div>

                    <div className="relative z-10 mx-auto mb-64 w-full max-w-7xl px-4 pt-16 sm:mb-72 sm:px-6 sm:pt-20">
                        <div className="mb-28 max-w-[60%] space-y-5 sm:mb-36 sm:max-w-[56%] sm:space-y-6">
                            <h1 className="text-3xl font-black uppercase leading-tight tracking-tight text-neutral-100 drop-shadow-lg">
                                See It On Your Ride{' '}
                                <span className="text-blue-600">Before You Wrap It</span>
                            </h1>
                            <p className="max-w-[85%] text-sm leading-relaxed text-neutral-100/95">
                                Browse our catalog and generate a preview of your car wrap in
                                seconds powered by AI.
                            </p>
                            <Link href="/visualizer" className="inline-block pt-2">
                                <Button className="bg-blue-600 px-6 py-3 text-sm font-semibold text-neutral-100 shadow-lg transition-all hover:border-2 hover:border-blue-600 hover:bg-transparent hover:text-blue-600">
                                    Try the Visualizer
                                </Button>
                            </Link>
                        </div>

                        <div className="mb-16 mt-24 space-y-6 sm:mb-20 sm:mt-36 sm:space-y-8">
                            <h2 className="text-center text-3xl font-black uppercase leading-tight tracking-tight text-neutral-100 drop-shadow-lg">
                                Simple
                                <span className="text-blue-600"> Transparent </span>
                                Pricing
                            </h2>

                            <div className="grid grid-cols-1 gap-4">
                                {pricingTiers.map((plan, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex flex-col border px-4 py-4 sm:px-5 sm:py-5 ${
                                            plan.popular
                                                ? 'border-blue-600 bg-neutral-950/90 shadow-[0_0_18px_rgba(37,99,235,0.45)]'
                                                : 'border-neutral-700 bg-neutral-950/75'
                                        }`}
                                    >
                                        <p
                                            className={`text-center text-lg font-black ${
                                                plan.popular ? 'text-blue-600' : 'text-neutral-100'
                                            }`}
                                        >
                                            {plan.name}
                                        </p>
                                        <p className="mt-1 text-center text-2xl font-black text-neutral-100">
                                            {plan.price}
                                        </p>
                                        <ul className="mt-3 flex-1 space-y-2 text-sm leading-relaxed text-neutral-200">
                                            {plan.features.map((feature, featureIdx) => (
                                                <li key={featureIdx}>✓ {feature}</li>
                                            ))}
                                        </ul>
                                        <Link href="/sign-up" className="mt-4 block">
                                            <Button className="min-h-10 w-full bg-blue-600 px-3 py-2 text-sm font-semibold text-neutral-100 shadow-lg transition-all hover:border-2 hover:border-blue-600 hover:bg-transparent hover:text-blue-600">
                                                {plan.cta}
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-12 space-y-6 sm:mt-14 sm:space-y-8">
                            <h2 className="text-center text-3xl font-black uppercase leading-tight tracking-tight text-neutral-100 drop-shadow-lg">
                                Command Your
                                <span className="text-blue-600"> Brand </span>
                            </h2>
                            <div className="grid grid-cols-3 gap-4 sm:gap-6">
                                {mobileWhyItems.map((item, idx) => {
                                    const Icon = item.icon
                                    return (
                                        <div
                                            key={idx}
                                            className="flex flex-col items-center gap-2.5 text-center"
                                        >
                                            <Icon
                                                className="drop-shadow-[0_0_18px_rgba(37, 100, 235, 0.522)] h-12 w-12 text-blue-600 sm:h-14 sm:w-14"
                                                strokeWidth={1.45}
                                            />
                                            <p className="text-[11px] font-semibold leading-snug text-neutral-100 sm:text-xs">
                                                {item.title}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>

                            <Link href="/sign-up" className="block pt-4 sm:pt-6">
                                <Button className="w-full bg-blue-600 py-3 text-base font-semibold text-neutral-100 shadow-lg transition-all hover:border-2 hover:border-blue-600 hover:bg-transparent hover:text-blue-600">
                                    Start Designing Your Wrap Today
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                <div className="supports-backdrop-filter:bg-neutral-950/90 fixed inset-x-0 bottom-0 z-40 border-t border-neutral-800 bg-neutral-950/90 backdrop-blur md:hidden">
                    <p className="px-4 py-3 text-center text-[11px] font-medium text-neutral-300">
                        © {currentYear} CTRL+ El Paso. All rights reserved.
                    </p>
                </div>

                <div className="hidden md:block">
                    {/* Hero Section */}
                    <section className="h-150 sm:h-175 lg:h-200 relative mb-16 flex w-full items-start justify-start overflow-hidden lg:mb-24">
                        {/* Background Image - Zoomed and positioned right */}
                        <div className="absolute inset-0 z-0">
                            <Image
                                src="/ctrlplus-fleet-night-showcase.png"
                                alt="CTRL+ vehicle wraps showcase"
                                fill
                                sizes="100vw"
                                className="object-cover"
                                priority
                            />
                            {/* Dark Overlay */}
                            <div className="absolute inset-0 bg-neutral-950/40" />
                        </div>

                        {/* Hero Content - Left aligned */}
                        <div className="sm:pt-30 relative z-10 mx-auto flex w-full max-w-7xl items-start px-4 pt-24 sm:px-6 lg:px-8 lg:pt-36">
                            <div className="max-w-2xl animate-fade-in">
                                <h1 className="mb-2 whitespace-nowrap text-3xl font-black uppercase leading-tight tracking-tight text-neutral-100 drop-shadow-lg sm:mb-3 sm:text-4xl lg:mb-4 lg:text-6xl">
                                    Command Your <span className="text-blue-600">Brand</span>
                                </h1>
                                <p className="mb-4 text-base font-semibold leading-snug text-neutral-100 drop-shadow-lg sm:mb-6 sm:text-lg lg:mb-8 lg:text-xl">
                                    Transform your ride with premium vehicle wraps. Visualize
                                    designs on your car, book your appointment, and drive in style.
                                </p>
                                <div>
                                    <Link href="/sign-up">
                                        <Button className="bg-blue-600 px-6 py-3 text-base font-semibold text-neutral-100 shadow-lg transition-all hover:border-2 hover:border-blue-600 hover:bg-transparent hover:text-blue-600 hover:shadow-xl sm:px-8 sm:py-4 sm:text-lg">
                                            Start Your New Project
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section className="relative -mt-24 bg-neutral-900 px-4 py-16 sm:-mt-32 sm:px-6 sm:py-20 lg:-mt-40 lg:px-8 lg:py-24">
                        <div className="mx-auto max-w-7xl">
                            <div className="mb-12 text-center sm:mb-14 lg:mb-16">
                                <h2 className="mb-3 whitespace-nowrap text-2xl font-black uppercase tracking-tight text-neutral-100 drop-shadow-lg sm:mb-4 sm:text-4xl lg:text-5xl">
                                    Built for El Paso Drivers Who Demand{' '}
                                    <span className="text-blue-600">More Than Ordinary</span>
                                </h2>
                            </div>

                            {/* Features Grid */}
                            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                                {features.map((feature, idx) => {
                                    const Icon = feature.icon
                                    return (
                                        <Card
                                            key={idx}
                                            className="animate-slide-in-up border-neutral-700 bg-neutral-950/80 transition-all duration-300 hover:scale-110 hover:border-blue-600/50 hover:shadow-lg hover:shadow-blue-600/10"
                                        >
                                            <CardHeader className="pb-4">
                                                <div className="mb-4 flex h-12 w-12 items-center justify-center border border-neutral-700 bg-blue-600/10 transition-colors duration-300 group-hover:bg-blue-600/20">
                                                    <Icon className="h-6 w-6 text-blue-600" />
                                                </div>
                                                <CardTitle className="text-lg font-bold text-blue-600 sm:text-xl">
                                                    {feature.title}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm leading-relaxed text-neutral-100 sm:text-base">
                                                    {feature.description}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        </div>
                    </section>

                    {/* Pricing Section */}
                    <section className="relative overflow-hidden bg-neutral-900 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
                        <div className="absolute inset-0 z-0">
                            <Image
                                src="/chili-truck-el-paso-downtown.png"
                                alt="Pricing section background"
                                fill
                                sizes="100vw"
                                className="object-cover"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-neutral-950/50" />
                        </div>

                        <div className="relative z-10 mx-auto max-w-7xl">
                            <div className="mb-12 text-center sm:mb-14 lg:mb-16">
                                <h2 className="mb-3 text-2xl font-black uppercase tracking-tight text-neutral-100 drop-shadow-lg sm:mb-4 sm:text-4xl lg:text-5xl">
                                    Fair and{' '}
                                    <span className="text-blue-600">Straight-Shooting</span> Pricing
                                </h2>
                            </div>

                            {/* Pricing Cards */}
                            <div className="grid grid-cols-1 items-stretch gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                                {pricingTiers.map((tier, idx) => (
                                    <Card
                                        key={idx}
                                        className={`relative flex animate-slide-in-up flex-col hover:scale-105 ${
                                            tier.popular
                                                ? 'scale-105 border-blue-600 bg-neutral-950/80 shadow-xl shadow-blue-600/20 ring-2 ring-blue-600 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-blue-600/30'
                                                : 'border-neutral-700 bg-neutral-950/80 transition-all duration-300 hover:scale-105 hover:border-blue-600/50 hover:shadow-lg hover:shadow-blue-600/10'
                                        } backdrop-blur-sm`}
                                    >
                                        {tier.popular && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-none border border-blue-600 bg-blue-600 px-3 py-1 text-xs font-bold uppercase tracking-widest text-neutral-100">
                                                Most Popular
                                            </div>
                                        )}
                                        <CardHeader className="pb-6 pt-8 sm:pb-8">
                                            <CardTitle className="text-xl font-bold text-neutral-100 sm:text-2xl">
                                                {tier.name}
                                            </CardTitle>
                                            <CardDescription className="mt-2 text-sm text-neutral-300 sm:text-base">
                                                {tier.description}
                                            </CardDescription>
                                            <div className="mt-6">
                                                <span className="text-4xl font-extrabold text-neutral-100 sm:text-5xl">
                                                    {tier.price}
                                                </span>
                                                <span className="ml-2 text-sm text-neutral-300 sm:text-base">
                                                    {tier.period}
                                                </span>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex flex-1 flex-col pb-8">
                                            <ul className="mb-8 flex-1 space-y-3 sm:space-y-4">
                                                {tier.features.map((feature, fidx) => (
                                                    <li
                                                        key={fidx}
                                                        className="flex items-start gap-3"
                                                    >
                                                        <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center bg-blue-600/20">
                                                            <div className="h-2.5 w-2.5 bg-blue-600" />
                                                        </div>
                                                        <span className="text-sm leading-relaxed text-neutral-100 sm:text-base">
                                                            {feature}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <Link href="/sign-up" className="w-full">
                                                <Button
                                                    className={`w-full py-3 text-sm font-semibold transition-all sm:py-4 sm:text-base ${
                                                        tier.popular
                                                            ? 'bg-blue-600 text-neutral-100 shadow-lg hover:border-2 hover:border-blue-600 hover:bg-transparent hover:text-blue-600'
                                                            : 'bg-blue-600 text-neutral-100 shadow-lg hover:border-2 hover:border-blue-600 hover:bg-transparent hover:text-blue-600'
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
            </div>
        </>
    )
}
