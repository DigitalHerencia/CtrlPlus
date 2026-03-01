import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { PublicSiteShell } from '../../components/shared/layout/public-site-shell';
import { Badge } from '../../components/ui/badge';
import { buttonVariants } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '../../components/ui/card';

const featureRows = [
  {
    title: 'Catalog Discovery',
    description: 'Find wrap options by service type and keep your shortlist tied to one account.',
    points: [
      'Review options with practical descriptions and install expectations.',
      'Use one account to save and compare choices across visits.',
      'Move directly into preview and scheduling after selection.',
    ],
    image: '/visuals/feature-discovery.png',
    imageAlt: 'Vehicle lineup and wrap detail composition',
  },
  {
    title: 'Preview With Fallback',
    description:
      'Start with upload preview support, then switch to template-based preview when speed matters.',
    points: [
      'Keep the booking path active even if an upload preview is unavailable.',
      'Review wrap texture and placement before scheduling.',
      'Continue to next steps without restarting the project.',
    ],
    image: '/visuals/feature-preview.png',
    imageAlt: 'Wrap material and vehicle preview collage',
  },
  {
    title: 'Scheduling Controls',
    description:
      'Select valid drop-off and pick-up windows based on business hours and current capacity.',
    points: [
      'Present valid windows only for consistent booking decisions.',
      'Reduce manual back-and-forth with structured appointment steps.',
      'Keep booking details linked to the customer account.',
    ],
    image: '/visuals/feature-scheduling.png',
    imageAlt: 'Scheduling workflow visual composition',
  },
  {
    title: 'Invoice + Checkout',
    description:
      'Complete payment through secure checkout and keep invoice status connected to the booking.',
    points: [
      'Review payment context before submitting checkout.',
      'Receive confirmation in the same flow after payment.',
      'Track booking and invoice progress in one account.',
    ],
    image: '/visuals/contact-service.png',
    imageAlt: 'Customer booking and service visual collage',
  },
];

export const metadata: Metadata = {
  title: 'Features',
};

export default function FeaturesPage() {
  return (
    <PublicSiteShell activePath="/features">
      <main
        className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-10 md:px-6 md:py-12"
        id="main-content"
      >
        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardHeader className="gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-(--text-muted)">
                Platform Features
              </p>
              <h1 className="text-4xl font-semibold tracking-[0.02em] text-(--text) md:text-5xl">
                Customer-facing tools that keep wrap projects moving.
              </h1>
              <CardDescription className="text-base">
                Each feature supports the same goal: clear decisions, valid scheduling, and secure
                payment completion.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-2">
                <Link className={buttonVariants()} href="/sign-up">
                  Create Account
                </Link>
                <Link className={buttonVariants({ variant: 'outline' })} href="/sign-in">
                  Sign In
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardContent className="relative min-h-80 px-0 pb-0 pt-0">
              <Image
                alt="Feature overview collage"
                className="object-cover"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                src="/visuals/feature-discovery.png"
              />
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-5">
          <header className="grid gap-2">
            <Badge variant="outline">Feature Breakdown</Badge>
            <h2 className="text-3xl font-semibold tracking-[0.02em] text-(--text)">
              Designed to support the full customer journey from first click to payment.
            </h2>
          </header>

          <div className="grid gap-4">
            {featureRows.map((featureRow, index) => {
              const shouldReverse = index % 2 === 1;

              return (
                <Card key={featureRow.title}>
                  <CardContent className="grid gap-4 pt-5 lg:grid-cols-2">
                    <div className={shouldReverse ? 'grid gap-3 lg:order-2' : 'grid gap-3'}>
                      <h3 className="text-2xl font-semibold text-(--text)">{featureRow.title}</h3>
                      <p className="text-(--text-muted)">{featureRow.description}</p>
                      <ul className="grid list-none gap-2 p-0">
                        {featureRow.points.map((point) => (
                          <li
                            className="rounded-lg border border-(--border) bg-(--surface-muted) px-3 py-2 text-sm text-(--text)"
                            key={point}
                          >
                            {point}
                          </li>
                        ))}
                      </ul>
                      <Link className={buttonVariants({ variant: 'link' })} href="/sign-up">
                        Create Account
                      </Link>
                    </div>

                    <div
                      className={
                        shouldReverse
                          ? 'relative min-h-62.5 overflow-hidden rounded-lg border border-(--border) lg:order-1'
                          : 'relative min-h-62.5 overflow-hidden rounded-lg border border-(--border)'
                      }
                    >
                      <Image
                        alt={featureRow.imageAlt}
                        className="object-cover"
                        fill
                        sizes="(max-width: 1024px) 100vw, 42vw"
                        src={featureRow.image}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-5">
            <div className="grid gap-2">
              <Badge variant="outline">Next Step</Badge>
              <h2 className="text-2xl font-semibold text-(--text)">
                Create an account and launch your first project flow.
              </h2>
              <p className="text-(--text-muted)">
                Existing customers can sign in to continue active previews, bookings, and invoices.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link className={buttonVariants()} href="/sign-up">
                Create Account
              </Link>
              <Link className={buttonVariants({ variant: 'outline' })} href="/sign-in">
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </PublicSiteShell>
  );
}
