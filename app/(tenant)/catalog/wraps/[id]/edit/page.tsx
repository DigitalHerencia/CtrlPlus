import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

import { WrapCatalogEditorForm } from '../../../../../../components/catalog/wrap-catalog-editor-form';
import { updateWrapDesign } from '../../../../../../lib/server/actions/catalog';
import { getWrapDesign } from '../../../../../../lib/server/fetchers/catalog';
import { getRequestTenant } from '../../../../../../lib/tenancy/get-request-tenant';
import { Badge } from '../../../../../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../../../components/ui/card';

type EditWrapPageProps = {
  readonly params: {
    readonly id: string;
  };
};

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

  return value.trim().length > 0 ? value : '';
}

function readOptionalInteger(formData: FormData, key: string): number | undefined {
  const value = formData.get(key);
  if (typeof value !== 'string' || value.trim().length === 0) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : undefined;
}

function readPublishedState(formData: FormData): boolean {
  return formData.get('isPublished') === 'true';
}

export default async function EditWrapPage({ params }: EditWrapPageProps) {
  const requestHeaders = await headers();
  const headerMap = toHeaderMap(requestHeaders);
  const tenantContext = await getRequestTenant();
  const wrap = await getWrapDesign({
    headers: headerMap,
    query: {
      tenantId: tenantContext.tenantId,
      id: params.id
    }
  });

  if (!wrap) {
    notFound();
  }

  async function updateWrapDesignAction(formData: FormData): Promise<void> {
    'use server';

    const actionHeaders = await headers();
    const result = await updateWrapDesign({
      headers: toHeaderMap(actionHeaders),
      payload: {
        id: params.id,
        name: readRequiredString(formData, 'name'),
        description: readOptionalString(formData, 'description'),
        priceCents: readOptionalInteger(formData, 'priceCents'),
        isPublished: readPublishedState(formData)
      }
    });

    if (!result) {
      redirect('/catalog/wraps');
    }

    redirect(`/catalog/wraps/${params.id}`);
  }

  return (
    <main className='mx-auto grid w-full max-w-4xl gap-4 px-5 py-10 md:px-6'>
      <Card>
        <CardHeader className='gap-3'>
          <Badge variant='outline'>{tenantContext.tenantSlug.toUpperCase()} / Wraps</Badge>
          <CardTitle className='text-4xl'>Edit wrap</CardTitle>
          <CardDescription>Update this catalog item and adjust publication state.</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className='pt-5'>
          <WrapCatalogEditorForm
            action={updateWrapDesignAction}
            cancelHref={`/catalog/wraps/${params.id}`}
            defaults={{
              name: wrap.name,
              description: wrap.description ?? '',
              priceCents: wrap.priceCents.toString(),
              isPublished: wrap.isPublished ? 'true' : 'false',
            }}
            includePublishState={true}
            submitLabel='Save changes'
          />
        </CardContent>
      </Card>
    </main>
  );
}
