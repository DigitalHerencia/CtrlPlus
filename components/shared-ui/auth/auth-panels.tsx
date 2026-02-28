import type { ReactNode } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../ui';

type AuthPageFrameProps = {
  readonly reverse?: boolean;
  readonly children: ReactNode;
};

type AuthMarketingPanelProps = {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly highlights: readonly string[];
  readonly actions?: ReactNode;
  readonly support?: ReactNode;
};

type AuthFormPanelProps = {
  readonly eyebrow: string;
  readonly title: string;
  readonly children: ReactNode;
};

export function AuthPageFrame({ reverse = false, children }: AuthPageFrameProps) {
  return (
    <main className='mx-auto w-full max-w-6xl px-4 py-10 md:px-6'>
      <section
        className={`grid items-start gap-4 lg:grid-cols-2 ${reverse ? '[&>*:first-child]:lg:order-2 [&>*:last-child]:lg:order-1' : ''}`}
      >
        {children}
      </section>
    </main>
  );
}

export function AuthMarketingPanel({
  eyebrow,
  title,
  description,
  highlights,
  actions,
  support,
}: AuthMarketingPanelProps) {
  return (
    <Card>
      <CardHeader className='gap-3'>
        <p className='text-xs font-semibold uppercase tracking-[0.08em] text-[color:var(--text-muted)]'>
          {eyebrow}
        </p>
        <h1 className='text-4xl font-semibold tracking-[0.02em] text-[color:var(--text)]'>{title}</h1>
        <CardDescription className='text-base'>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <ul className='grid list-none gap-2'>
          {highlights.map((highlight) => (
            <li
              className='rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-muted)] px-3 py-2 text-sm text-[color:var(--text)]'
              key={highlight}
            >
              {highlight}
            </li>
          ))}
        </ul>
      </CardContent>

      {actions ? <CardFooter className='pt-0'>{actions}</CardFooter> : null}
      {support ? <CardFooter className='pt-0 text-sm text-[color:var(--text-muted)]'>{support}</CardFooter> : null}
    </Card>
  );
}

export function AuthFormPanel({ eyebrow, title, children }: AuthFormPanelProps) {
  return (
    <Card>
      <CardHeader className='gap-3'>
        <p className='text-xs font-semibold uppercase tracking-[0.08em] text-[color:var(--text-muted)]'>
          {eyebrow}
        </p>
        <CardTitle className='text-2xl'>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}