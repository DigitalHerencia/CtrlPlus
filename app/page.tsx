import Image from 'next/image';
import Link from 'next/link';

import { PublicSiteShell } from '../components/public/public-site-shell';

const performanceStats = [
  {
    value: '10–20s',
    label: 'Typical preview target for upload-based mockups.'
  },
  {
    value: '<1s',
    label: 'Template fallback path to keep booking momentum.'
  },
  {
    value: '1 Flow',
    label: 'Browse, visualize, schedule, and pay in one session.'
  },
  {
    value: '100%',
    label: 'Server-side tenant isolation and secure checkout posture.'
  }
];

const funnelFeatures = [
  {
    title: 'Wrap Catalog Discovery',
    description:
      'Show customers high-converting wrap options with clear pricing, estimated install time, and finish details.',
    cta: 'Create an account to save favorites and start booking.'
  },
  {
    title: 'Visualizer That Sells',
    description:
      'Use upload-based previews first, then immediately offer model templates so no lead drops when a preview fails.',
    cta: 'Sign up to launch your first “Try on my vehicle” flow.'
  },
  {
    title: 'Scheduling That Converts',
    description:
      'Capture drop-off and pick-up windows with built-in availability rules so teams can confirm jobs confidently.',
    cta: 'Sign up to unlock booking windows and faster approvals.'
  },
  {
    title: 'Invoice + Stripe Checkout',
    description:
      'Move from quote to paid booking with a guided payment experience and webhook-confirmed status updates.',
    cta: 'Create your account to turn interest into paid appointments.'
  }
];

const conversionFlow = [
  'Browse premium wraps by style, finish, and vehicle compatibility.',
  'Visualize on an uploaded photo or fast model template.',
  'Choose drop-off and pick-up windows based on real availability.',
  'Pay via secure checkout and receive immediate confirmation.'
];

const conversionReasons = [
  'The visualizer is front-and-center to reduce hesitation and increase confidence.',
  'Fallback preview paths keep users moving even when upload previews fail.',
  'Clear scheduling + payment removes friction between interest and purchase.',
  'Sign-up and sign-in CTAs are present on every major decision point.'
];

export default function HomePage() {
  return (
    <PublicSiteShell activePath="/">
      <main className="landing-main" id="main-content">
        <section className="hero section-shell">
          <div className="hero__content">
            <p className="eyebrow">Command Your Brand · El Paso, Texas</p>
            <h1 className="hero__title">
              Premium Vehicle Wraps, Tint &amp; Signage with a conversion-focused booking experience.
            </h1>
            <p className="hero__description">
              CTRL+ helps customers move from inspiration to purchase in one guided journey:
              discover wraps, preview on their vehicle, schedule install windows, and complete
              secure payment.
            </p>

            <ul className="hero__checklist">
              <li>Built around the “Try on my vehicle” differentiator.</li>
              <li>Fast template fallback keeps the funnel moving.</li>
              <li>Clear pricing and scheduling for fewer drop-offs.</li>
            </ul>

            <div className="hero__actions">
              <Link className="button button--primary" href="/sign-up">
                Start Free Sign Up
              </Link>
              <Link className="button button--ghost" href="/sign-in">
                Sign In to Continue
              </Link>
              <Link className="button button--secondary" href="/features">
                Explore Features
              </Link>
            </div>

            <p className="hero__contact">
              Need help choosing a wrap? Call <a href="tel:+19159992191">(915) 999-2191</a>
            </p>
          </div>

          <div className="hero__visuals">
            <figure className="media-card media-card--primary">
              <Image
                src="/0001-7280563191036061234.png"
                alt="CTRL+ premium wrap showcase"
                fill
                priority
                sizes="(max-width: 980px) 100vw, 52vw"
              />
              <figcaption className="media-card__overlay">
                Premium wraps presented with high-impact visuals.
              </figcaption>
            </figure>

            <div className="hero__visual-grid">
              <figure className="media-card media-card--secondary">
                <Image
                  src="/0001-1137653301909815874.png"
                  alt="Vehicle wrap detail shot"
                  fill
                  sizes="(max-width: 980px) 50vw, 26vw"
                />
              </figure>
              <figure className="media-card media-card--secondary">
                <Image
                  src="/0001-8036042029217284237.png"
                  alt="CTRL+ brand hero composition"
                  fill
                  sizes="(max-width: 980px) 50vw, 26vw"
                />
              </figure>
            </div>
          </div>
        </section>

        <section aria-label="Performance proof points" className="section-shell stats-section">
          <div className="stats-grid">
            {performanceStats.map((stat) => (
              <article className="card stat-card" key={stat.value}>
                <p className="stat-card__value">{stat.value}</p>
                <p className="stat-card__label">{stat.label}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell landing-section" id="features-overview">
          <header className="section-head">
            <p className="eyebrow">Main Features That Convert</p>
            <h2>Each section is designed to move visitors toward sign-up and checkout.</h2>
            <p>
              The experience mirrors the PRD flow and keeps users advancing from discovery to
              payment with clear calls-to-action.
            </p>
          </header>

          <div className="funnel-grid">
            {funnelFeatures.map((funnelFeature) => (
              <article className="card feature-card" key={funnelFeature.title}>
                <h3>{funnelFeature.title}</h3>
                <p>{funnelFeature.description}</p>
                <p className="feature-card__hook">{funnelFeature.cta}</p>
                <Link className="inline-link" href="/sign-up">
                  Sign Up Now
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell landing-section" id="how-it-works">
          <header className="section-head">
            <p className="eyebrow">Browse → Visualize → Schedule → Pay</p>
            <h2>A guided conversion funnel built for real booking outcomes.</h2>
          </header>

          <ol className="flow-grid">
            {conversionFlow.map((step, index) => (
              <li className="card flow-card" key={step}>
                <span className="flow-card__number">0{index + 1}</span>
                <p>{step}</p>
                <Link className="inline-link" href="/sign-up">
                  Continue with Sign Up
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <section className="section-shell split-section">
          <div className="card split-section__content">
            <p className="eyebrow">Why this landing page converts</p>
            <h2>Conversion intent is reinforced in every major section.</h2>
            <ul className="split-section__list">
              {conversionReasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
            <div className="split-section__actions">
              <Link className="button button--primary" href="/sign-up">
                Create Your Account
              </Link>
              <Link className="button button--ghost" href="/about">
                Learn About CTRL+
              </Link>
            </div>
          </div>

          <figure className="media-card media-card--tall">
            <Image
              src="/0001-5948623603194756924.png"
              alt="CTRL+ El Paso fleet lineup"
              fill
              sizes="(max-width: 980px) 100vw, 44vw"
            />
          </figure>
        </section>

        <section className="section-shell cta-panel">
          <div>
            <p className="eyebrow">Ready to transform your ride?</p>
            <h2>Sign up now to launch your first wrap preview and booking flow.</h2>
            <p>
              Already registered? Sign in to continue where you left off and finalize your next
              appointment.
            </p>
          </div>
          <div className="cta-panel__actions">
            <Link className="button button--primary" href="/sign-up">
              Sign Up
            </Link>
            <Link className="button button--ghost" href="/sign-in">
              Sign In
            </Link>
          </div>
        </section>
      </main>
    </PublicSiteShell>
  );
}
