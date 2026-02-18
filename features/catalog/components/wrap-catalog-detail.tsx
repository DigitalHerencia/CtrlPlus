import type { WrapDesign } from '../types';

export interface WrapCatalogDetailProps {
  readonly wrap: WrapDesign;
}

export function WrapCatalogDetail({ wrap }: WrapCatalogDetailProps) {
  return (
    <article>
      <h1>{wrap.name}</h1>
      <p>{wrap.description ?? 'No description provided.'}</p>
      <p>${(wrap.priceCents / 100).toFixed(2)}</p>
      <p>{wrap.isPublished ? 'Published' : 'Draft'}</p>
    </article>
  );
}

