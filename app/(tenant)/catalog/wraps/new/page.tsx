import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { WrapCatalogEditorForm } from '../../../../../components/catalog/wrap-catalog-editor-form';
import { createWrapDesign } from '../../../../../lib/server/actions/catalog';
import { getRequestTenant } from '../../../../../lib/tenancy/get-request-tenant';
import { Badge } from '../../../../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../../components/ui/card';

function toHeaderMap(requestHeaders: Headers): Record<string, string | undefined> {
  const values: Record<string, string | undefined> = {};

  for (const [key, value] of requestHeaders.entries()) {
    values[key] = value;
  }

  return values;
}

function readRequiredString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

function readOptionalString(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  if (typeof value !== 'string') {
    return undefined;
  }

  return value.trim().length > 0 ? value : undefined;
}

function readOptionalInteger(formData: FormData, key: string): number | undefined {
  const value = formData.get(key);
  if (typeof value !== 'string' || value.trim().length === 0) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : undefined;
}

export default async function NewWrapPage() {
  const tenantContext = await getRequestTenant();

  async function createWrapDesignAction(formData: FormData): Promise<void> {
    'use server';

    const requestHeaders = await headers();
    const created = await createWrapDesign({
      headers: toHeaderMap(requestHeaders),
      payload: {
        name: readRequiredString(formData, 'name'),
        description: readOptionalString(formData, 'description'),
        priceCents: readOptionalInteger(formData, 'priceCents')
      }
    });

    redirect(`/catalog/wraps/${created.id}`);
  }

  return (
    <main className='mx-auto grid w-full max-w-4xl gap-4 px-5 py-10 md:px-6'>
      <Card>
        <CardHeader className='gap-3'>
          <Badge variant='outline'>{tenantContext.tenantSlug.toUpperCase()} / Wraps</Badge>
          <CardTitle className='text-4xl'>Create wrap</CardTitle>
          <CardDescription>
            Add a new wrap entry and publish it later when details are approved.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className='pt-5'>
          <WrapCatalogEditorForm
            action={createWrapDesignAction}
            cancelHref='/catalog/wraps'
            defaults={{
              name: '',
              description: '',
              priceCents: '',
              isPublished: 'false',
            }}
            includePublishState={false}
            submitLabel='Save wrap'
          />
        </CardContent>
      </Card>
    </main>
  );
}
