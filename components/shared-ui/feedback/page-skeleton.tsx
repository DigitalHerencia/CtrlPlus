import { Card, CardContent, CardHeader } from '../../ui';

type PageSkeletonProps = {
  readonly label: string;
};

export function PageSkeleton({ label }: PageSkeletonProps) {
  return (
    <main className='mx-auto grid w-full max-w-5xl gap-4 px-5 py-10 md:px-6'>
      <p aria-live='polite' className='text-sm uppercase tracking-[0.08em] text-[color:var(--text-muted)]'>
        {label}
      </p>
      <Card>
        <CardHeader>
          <div className='h-8 animate-pulse rounded-md bg-[color:var(--surface-muted)]' />
        </CardHeader>
        <CardContent>
          <div className='h-24 animate-pulse rounded-md bg-[color:var(--surface-muted)]' />
          <div className='h-24 animate-pulse rounded-md bg-[color:var(--surface-muted)]' />
        </CardContent>
      </Card>
    </main>
  );
}
