import Link from 'next/link';

import type { WrapCatalogItemContract } from '../../types/catalog';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type WrapCatalogListProps = {
  readonly wraps: readonly WrapCatalogItemContract[];
};

export function WrapCatalogList({ wraps }: WrapCatalogListProps) {
  if (wraps.length === 0) {
    return (
      <Card>
        <CardContent className='pt-5'>
          <p className='text-[color:var(--text-muted)]'>No wraps matched your current criteria.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ul className='grid list-none gap-4 p-0'>
      {wraps.map((wrap) => (
        <li key={wrap.id}>
          <Card>
            <CardHeader className='gap-3'>
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <CardTitle className='text-xl'>{wrap.name}</CardTitle>
                <Badge variant={wrap.isPublished ? 'secondary' : 'outline'}>
                  {wrap.isPublished ? 'Published' : 'Draft'}
                </Badge>
              </div>
              <CardDescription>{wrap.description ?? 'Details available on request.'}</CardDescription>
            </CardHeader>
            <CardContent className='pt-0'>
              <p className='text-lg font-semibold text-[color:var(--text)]'>${(wrap.priceCents / 100).toFixed(2)}</p>
            </CardContent>
            <CardFooter className='pt-0'>
              <Link className={buttonVariants({ variant: 'link' })} href={`/catalog/wraps/${wrap.id}`}>
                Review wrap
              </Link>
            </CardFooter>
          </Card>
        </li>
      ))}
    </ul>
  );
}
