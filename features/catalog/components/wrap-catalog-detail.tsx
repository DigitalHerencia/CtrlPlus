import type { WrapDesign } from '../types';

export interface WrapCatalogDetailProps {
  readonly wrap: WrapDesign;
}

export function WrapCatalogDetail({ wrap }: WrapCatalogDetailProps) {
  return (
    <article className="grid gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
      <h1 className="text-3xl font-semibold text-[color:var(--text)]">{wrap.name}</h1>
      <p className="text-[color:var(--text-muted)]">{wrap.description ?? 'No description provided.'}</p>
      <p className="text-lg font-semibold text-[color:var(--text)]">${(wrap.priceCents / 100).toFixed(2)}</p>
      <p className="text-sm font-medium text-[color:var(--text-muted)]">
        Status: {wrap.isPublished ? 'Published' : 'Draft'}
      </p>
    </article>
  );
}

