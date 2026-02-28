import type { WrapCatalogItemContract } from '../../../types/catalog';
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui';

type WrapCatalogDetailProps = {
  readonly wrap: WrapCatalogItemContract;
};

export function WrapCatalogDetail({ wrap }: WrapCatalogDetailProps) {
  return (
    <Card>
      <CardHeader className='gap-3'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <CardTitle className='text-3xl'>{wrap.name}</CardTitle>
          <Badge variant={wrap.isPublished ? 'accent' : 'outline'}>
            {wrap.isPublished ? 'Published' : 'Draft'}
          </Badge>
        </div>
        <CardDescription className='text-base'>
          {wrap.description ?? 'Details available on request.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className='text-lg font-semibold text-[color:var(--text)]'>${(wrap.priceCents / 100).toFixed(2)}</p>
      </CardContent>
    </Card>
  );
}