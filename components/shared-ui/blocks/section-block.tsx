import type { ReactNode } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '../../ui';

type SectionBlockProps = {
  readonly title: string;
  readonly children: ReactNode;
};

export function SectionBlock({ title, children }: SectionBlockProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
