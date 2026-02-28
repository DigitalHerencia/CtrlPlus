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

const contactOptions = [
  {
    title: 'Call The Team',
    details: '(915) 999-2191',
    hint: 'Discuss project scope, scheduling windows, and vehicle fit directly.',
    link: 'tel:+19159992191',
    label: 'Contact Us',
  },
  {
    title: 'Service Area',
    details: 'El Paso, Texas',
    hint: 'Local support for personal vehicles, fleet branding, and signage projects.',
    link: '/about',
    label: 'About Us',
  },
  {
    title: 'Start Online',
    details: 'Create Account',
    hint: 'Set up your account to browse services and save booking details.',
    link: '/sign-up',
    label: 'Create Account',
  },
];

const nextSteps = [
  'Create Account and save your service selections.',
  'Review preview options and choose your preferred path.',
  'Select valid drop-off and pick-up windows.',
  'Complete secure checkout and receive confirmation.',
];

const projectReadiness = [
  'Vehicle year, make, and model',
  'Service type and finish preference',
  'Preferred scheduling window',
  'Contact number for booking updates',
];

export const metadata: Metadata = {
  title: 'Contact',
};

export default function ContactPage() {
  return (
    <PublicSiteShell activePath="/contact">
      <main
        className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-10 md:px-6 md:py-12"
        id="main-content"
      >
        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardHeader className="gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-(--text-muted)">
                Contact
              </p>
              <h1 className="text-4xl font-semibold tracking-[0.02em] text-(--text) md:text-5xl">
                Contact CTRL+ to plan your next wrap project.
              </h1>
              <CardDescription className="text-base">
                Whether you are planning one vehicle or a fleet project, the team can help you move
                from service selection to confirmed booking.
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
                <Link className={buttonVariants({ variant: 'outline' })} href="/features">
                  View Features
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardContent className="relative min-h-80 px-0 pb-0 pt-0">
              <Image
                alt="Contact and service planning collage"
                className="object-cover"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                src="/visuals/contact-service.png"
              />
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-5">
          <header className="grid gap-2">
            <Badge variant="outline">Reach Us</Badge>
            <h2 className="text-3xl font-semibold tracking-[0.02em] text-(--text)">
              Multiple ways to connect and keep your project moving.
            </h2>
          </header>

          <div className="grid gap-4 md:grid-cols-3">
            {contactOptions.map((contactOption) => (
              <Card key={contactOption.title}>
                <CardHeader>
                  <CardTitle className="text-xl">{contactOption.title}</CardTitle>
                  <p className="text-lg font-semibold text-(--text)">{contactOption.details}</p>
                  <CardDescription>{contactOption.hint}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Link className={buttonVariants({ variant: 'link' })} href={contactOption.link}>
                    {contactOption.label}
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <Badge variant="outline">What Happens Next</Badge>
              <CardTitle className="text-3xl">
                A straightforward workflow designed to turn interest into booked work.
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid list-none gap-2 p-0">
                {nextSteps.map((nextStep) => (
                  <li
                    className="rounded-lg border border-(--border) bg-(--surface-muted) px-3 py-2 text-sm text-(--text)"
                    key={nextStep}
                  >
                    {nextStep}
                  </li>
                ))}
              </ul>
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
            <CardContent className="relative min-h-90 px-0 pb-0 pt-0">
              <Image
                alt="Booking workflow visual composition"
                className="object-cover"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                src="/visuals/feature-scheduling.png"
              />
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <Badge variant="outline">Before You Contact Us</Badge>
              <CardTitle className="text-3xl">
                Gathering a few details helps us respond faster.
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid list-none gap-2 p-0">
                {projectReadiness.map((projectItem) => (
                  <li
                    className="rounded-lg border border-(--border) bg-(--surface-muted) px-3 py-2 text-sm text-(--text)"
                    key={projectItem}
                  >
                    {projectItem}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardContent className="relative min-h-90 px-0 pb-0 pt-0">
              <Image
                alt="Vehicle service details collage"
                className="object-cover"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                src="/visuals/feature-discovery.png"
              />
            </CardContent>
          </Card>
        </section>
      </main>
    </PublicSiteShell>
  );
}
