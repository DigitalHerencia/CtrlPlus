'use client';

import { RouteErrorBlock } from '../../components/shared/blocks/route-error-block';

export default function AuthError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorBlock
      title='Authentication page failed to load'
      message={error.message}
      onRetry={reset}
    />
  );
}
