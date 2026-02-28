import { Card, CardContent } from '../../ui';

export function OperationsSnapshotSkeleton() {
  return (
    <Card>
      <CardContent className='pt-5'>
        <div className='grid gap-3 sm:grid-cols-2'>
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className='grid gap-2 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-3'
            >
              <div className='h-3 w-32 animate-pulse rounded-md bg-[color:var(--surface-card)]' />
              <div className='h-8 w-20 animate-pulse rounded-md bg-[color:var(--surface-card)]' />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
