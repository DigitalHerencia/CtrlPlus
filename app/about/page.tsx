import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { PublicSiteShell } from '../../components/shared-ui/layout/public-site-shell';
import {
  Badge,
  buttonVariants,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui';

const operatingPrinciples = [
  {
    title: 'Clear Planning',
    description: 'Customers can see the full booking path before committing to an install date.',
  },
  {
    title: 'Structured Operations',
    description:
      'Scheduling, invoicing, and payment are connected so projects move through one workflow.',
  },
  {
    title: 'Reliable Service',
    description: 'Local support keeps communication direct for personal vehicles and fleet work.',
  },
];

const serviceStandards = [
  'Keep customer decisions focused on practical next steps.',
  'Support preview-first planning with fallback coverage.',
  'Use clear appointment windows and secure payment confirmation.',
  'Maintain direct communication from intake through booking.',
];

const customerFocus = [
  'Drivers who want a fast path from wrap selection to booking.',
  'Business owners managing repeat or multi-vehicle work.',
  'Teams that need clear timing, approval, and payment steps.',
];

export const metadata: Metadata = {
  title: 'About',
};

export default function AboutPage() {
  return (
    <PublicSiteShell activePath="/about">
      <main
        className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-10 md:px-6 md:py-12"
        id="main-content"
      >
        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardHeader className="gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-(--text-muted)">
                About CTRL+
              </p>
              <h1 className="text-4xl font-semibold tracking-[0.02em] text-(--text) md:text-5xl">
                Vehicle wrap services built around clear planning and dependable execution.
              </h1>
              <CardDescription className="text-base">
                CTRL+ supports customers and businesses with a customer-facing booking flow that
                keeps decisions practical from first visit through confirmation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-2">
                <Link className={buttonVariants()} href="/sign-up">
                  Create Account
                </Link>
                <Link className={buttonVariants({ variant: 'outline' })} href="/features">
                  View Features
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardContent className="relative min-h-80 px-0 pb-0 pt-0">
              <Image
                alt="Wrap service operations collage"
                className="object-cover"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                src="/visuals/about-operations.png"
              />
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-5">
          <header className="grid gap-2">
            <Badge variant="outline">How We Operate</Badge>
            <h2 className="text-3xl font-semibold tracking-[0.02em] text-(--text)">
              Built around operational clarity and consistent customer communication.
            </h2>
          </header>

          <div className="grid gap-4 md:grid-cols-3">
            {operatingPrinciples.map((operatingPrinciple) => (
              <Card key={operatingPrinciple.title}>
                <CardHeader>
                  <CardTitle className="text-xl">{operatingPrinciple.title}</CardTitle>
                  <CardDescription>{operatingPrinciple.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <Badge variant="outline">Service Standards</Badge>
              <CardTitle className="text-3xl">
                Every project is guided by the same practical workflow rules.
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid list-none gap-2 p-0">
                {serviceStandards.map((serviceStandard) => (
                  <li
                    className="rounded-lg border border-(--border) bg-(--surface-muted) px-3 py-2 text-sm text-(--text)"
                    key={serviceStandard}
                  >
                    {serviceStandard}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardContent className="relative min-h-90 px-0 pb-0 pt-0">
              <Image
                alt="Vehicle wrap discovery composition"
                className="object-cover"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                src="/visuals/feature-discovery.png"
              />
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <Badge variant="outline">Who We Serve</Badge>
              <CardTitle className="text-3xl">
                Designed for customers who need a direct path to booking.
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid list-none gap-2 p-0">
                {customerFocus.map((focusArea) => (
                  <li
                    className="rounded-lg border border-(--border) bg-(--surface-muted) px-3 py-2 text-sm text-(--text)"
                    key={focusArea}
                  >
                    {focusArea}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center gap-2">
                <Link className={buttonVariants()} href="/sign-up">
                  Create Account
                </Link>
                <Link className={buttonVariants({ variant: 'outline' })} href="/contact">
                  Contact Us
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardContent className="relative min-h-90 px-0 pb-0 pt-0">
              <Image
                alt="Customer preview workflow collage"
                className="object-cover"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                src="/visuals/feature-preview.png"
              />
            </CardContent>
          </Card>
        </section>
      </main>
    </PublicSiteShell>
  );
}
