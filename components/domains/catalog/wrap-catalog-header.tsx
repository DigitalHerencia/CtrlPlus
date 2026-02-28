import { Badge, Card, CardDescription, CardHeader, CardTitle } from '../../ui';

type WrapCatalogHeaderProps = {
  readonly tenantSlug: string;
  readonly title: string;
  readonly description: string;
};

export function WrapCatalogHeader({ tenantSlug, title, description }: WrapCatalogHeaderProps) {
  return (
    <Card>
      <CardHeader className='gap-3'>
        <Badge variant='outline'>{tenantSlug.toUpperCase()} / Wraps</Badge>
        <CardTitle className='text-4xl'>{title}</CardTitle>
        <CardDescription className='max-w-3xl text-base'>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}