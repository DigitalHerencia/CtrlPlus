'use client';

import { RouteErrorBlock } from '../components/shared-ui/blocks/route-error-block';

export default function PublicError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorBlock
      title='Unable to load this public page'
      message={error.message}
      onRetry={reset}
    />
  );
}
