import type { ReactNode } from 'react';

import styles from './auth-shell.module.css';

type AuthShellProps = {
  reverse?: boolean;
  children: ReactNode;
};

type AuthMarketingPanelProps = {
  eyebrow: string;
  title: string;
  description: string;
  highlights: string[];
  actions?: ReactNode;
  support?: ReactNode;
};

type AuthFormPanelProps = {
  eyebrow: string;
  title: string;
  children: ReactNode;
};

export function AuthShell({ reverse = false, children }: AuthShellProps) {
  const sectionClassName = reverse
    ? `${styles.authShellSection} ${styles.authShellSectionReverse}`
    : styles.authShellSection;

  return (
    <main className={styles.authShellMain} id="main-content">
      <section className={`section-shell ${sectionClassName}`}>{children}</section>
    </main>
  );
}

export function AuthMarketingPanel({
  eyebrow,
  title,
  description,
  highlights,
  actions,
  support
}: AuthMarketingPanelProps) {
  return (
    <article className={`card ${styles.marketingPanel}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h1 className={styles.marketingTitle}>{title}</h1>
      <p className={styles.marketingDescription}>{description}</p>

      <ul className={styles.marketingList}>
        {highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>

      {actions ? <div className={styles.marketingActions}>{actions}</div> : null}
      {support ? <p className={styles.marketingSupport}>{support}</p> : null}
    </article>
  );
}

export function AuthFormPanel({ eyebrow, title, children }: AuthFormPanelProps) {
  return (
    <aside className={`card ${styles.formPanel}`}>
      <div className={styles.formPanelContent}>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {children}
      </div>
    </aside>
  );
}
