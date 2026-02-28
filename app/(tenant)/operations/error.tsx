'use client';

import { RouteErrorBlock } from '../../../components/shared-ui/blocks/route-error-block';

export default function OperationsError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorBlock
      title='Operations route failed to load'
      message={error.message}
      onRetry={reset}
    />
  );
}
