import type { ReactNode } from 'react';

type AuthShellProps = {
  readonly children: ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className='mx-auto flex w-full max-w-6xl items-center px-4 py-10 md:px-6'>
      <div className='w-full'>{children}</div>
    </div>
  );
}
