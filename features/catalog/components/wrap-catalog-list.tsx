import Link from 'next/link';

import type { WrapDesign } from '../types';

export interface WrapCatalogListProps {
  readonly wraps: readonly WrapDesign[];
}

export function WrapCatalogList({ wraps }: WrapCatalogListProps) {
  if (wraps.length === 0) {
    return <p>No published wraps found.</p>;
  }

  return (
    <ul>
      {wraps.map((wrap) => (
        <li key={wrap.id}>
          <h2>{wrap.name}</h2>
          <p>{wrap.description ?? 'No description provided.'}</p>
          <p>${(wrap.priceCents / 100).toFixed(2)}</p>
          <Link href={`/wraps/${wrap.id}`}>View details</Link>
        </li>
      ))}
    </ul>
  );
}

