import { SiteFooter } from '@/components/shared/site-footer'
import { SiteHeader } from '@/components/shared/site-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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

    return (
        <>
            <SiteHeader />
            <div className="min-h-screen bg-neutral-900 text-neutral-100">
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
                                Transform your ride with premium vehicle wraps. Visualize designs on
                                your car, book your appointment, and drive in style.
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
                                Built for El Paso Drivers Who Want to{' '}
                                <span className="text-blue-600">Stand Out</span>
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
                                Fair and <span className="text-blue-600">Transparent</span> Pricing
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
                                                <li key={fidx} className="flex items-start gap-3">
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
        </>
    )
}
