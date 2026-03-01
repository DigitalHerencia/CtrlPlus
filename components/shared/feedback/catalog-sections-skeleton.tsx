import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function CatalogListSectionSkeleton() {
  return (
    <div className='grid gap-4'>
      <Card>
        <CardContent className='pt-5'>
          <div className='grid gap-2'>
            <div className='h-5 w-28 animate-pulse rounded-md bg-[color:var(--surface-muted)]' />
            <div className='h-3 w-52 animate-pulse rounded-md bg-[color:var(--surface-muted)]' />
          </div>
        </CardContent>
      </Card>
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index}>
          <CardHeader className='gap-3'>
            <div className='h-6 w-48 animate-pulse rounded-md bg-[color:var(--surface-muted)]' />
            <div className='h-4 w-full animate-pulse rounded-md bg-[color:var(--surface-muted)]' />
          </CardHeader>
          <CardContent>
            <div className='h-6 w-24 animate-pulse rounded-md bg-[color:var(--surface-muted)]' />
          </CardContent>
        </Card>
      ))}
      <Card>
        <CardContent className='flex items-center justify-between gap-3 pt-5'>
          <div className='h-4 w-40 animate-pulse rounded-md bg-[color:var(--surface-muted)]' />
          <div className='h-8 w-32 animate-pulse rounded-md bg-[color:var(--surface-muted)]' />
        </CardContent>
      </Card>
    </div>
  );
}

export function CatalogDetailSectionSkeleton() {
  return (
    <Card>
      <CardHeader className='gap-3'>
        <div className='h-8 w-52 animate-pulse rounded-md bg-[color:var(--surface-muted)]' />
        <div className='h-5 w-full animate-pulse rounded-md bg-[color:var(--surface-muted)]' />
      </CardHeader>
      <CardContent>
        <div className='h-6 w-24 animate-pulse rounded-md bg-[color:var(--surface-muted)]' />
      </CardContent>
    </Card>
  );
}
