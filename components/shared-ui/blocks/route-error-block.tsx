'use client';

import { Button, Card, CardContent, CardHeader, CardTitle } from '../../ui';

type RouteErrorBlockProps = {
  readonly title: string;
  readonly message?: string;
  readonly onRetry: () => void;
};

export function RouteErrorBlock({ title, message, onRetry }: RouteErrorBlockProps) {
  return (
    <main className='mx-auto grid w-full max-w-3xl gap-4 px-5 py-10 md:px-6'>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-[color:var(--text-muted)]'>
            {message ?? 'An unexpected error occurred. Please try again.'}
          </p>
          <Button className='w-fit' onClick={onRetry} variant='outline'>
            Retry
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
