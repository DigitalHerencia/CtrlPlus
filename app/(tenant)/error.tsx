'use client';

import { RouteErrorBlock } from '../../components/shared/blocks/route-error-block';

export default function TenantError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorBlock
      title='Tenant workspace failed to load'
      message={error.message}
      onRetry={reset}
    />
  );
}
