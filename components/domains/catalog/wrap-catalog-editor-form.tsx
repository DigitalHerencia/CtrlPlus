'use client';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { wrapCatalogEditorFormSchema } from '../../../lib/shared/schemas/catalog/schema';
import { buttonVariants, Input, Select } from '../../ui';

type WrapCatalogEditorFormDefaults = {
  readonly name: string;
  readonly description: string;
  readonly priceCents: string;
  readonly isPublished?: 'true' | 'false';
};

type WrapCatalogEditorFormProps = {
  readonly action: (formData: FormData) => Promise<void>;
  readonly cancelHref: string;
  readonly defaults: WrapCatalogEditorFormDefaults;
  readonly includePublishState: boolean;
  readonly submitLabel: string;
};

type WrapCatalogEditorFormValues = z.infer<typeof wrapCatalogEditorFormSchema>;

function toFormData(values: WrapCatalogEditorFormValues, includePublishState: boolean): FormData {
  const formData = new FormData();
  formData.set('name', values.name);
  formData.set('description', values.description);
  formData.set('priceCents', values.priceCents);

  if (includePublishState && values.isPublished) {
    formData.set('isPublished', values.isPublished);
  }

  return formData;
}

function toErrorMessage(error: unknown): string {
  if (typeof error === 'string' && error.trim().length > 0) {
    return error;
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return 'Validation error';
}

export function WrapCatalogEditorForm({
  action,
  cancelHref,
  defaults,
  includePublishState,
  submitLabel,
}: WrapCatalogEditorFormProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<WrapCatalogEditorFormValues>({
    resolver: zodResolver(wrapCatalogEditorFormSchema),
    defaultValues: {
      name: defaults.name,
      description: defaults.description,
      priceCents: defaults.priceCents,
      isPublished: defaults.isPublished,
    },
  });
  const submitHandler = form.handleSubmit((values) => {
    const formData = toFormData(values, includePublishState);

    startTransition(() => {
      void action(formData);
    });
  });

  return (
    <form
      className='grid gap-4'
      onSubmit={(event) => {
        void submitHandler(event);
      }}
    >
      <label className='grid gap-2'>
        <span className='text-sm font-medium text-[color:var(--text)]'>Name</span>
        <Input {...form.register('name')} required />
        {form.formState.errors.name ? (
          <span className='text-xs text-red-500'>{toErrorMessage(form.formState.errors.name.message)}</span>
        ) : null}
      </label>

      <label className='grid gap-2'>
        <span className='text-sm font-medium text-[color:var(--text)]'>Description</span>
        <textarea
          className='min-h-32 w-full rounded-md border border-[color:var(--border)] bg-[color:var(--surface-card)] px-3 py-2 text-sm text-[color:var(--text)]'
          {...form.register('description')}
        />
        {form.formState.errors.description ? (
          <span className='text-xs text-red-500'>
            {toErrorMessage(form.formState.errors.description.message)}
          </span>
        ) : null}
      </label>

      <label className='grid gap-2'>
        <span className='text-sm font-medium text-[color:var(--text)]'>Price (cents)</span>
        <Input
          inputMode='numeric'
          min={0}
          step={1}
          type='number'
          {...form.register('priceCents')}
        />
        {form.formState.errors.priceCents ? (
          <span className='text-xs text-red-500'>{toErrorMessage(form.formState.errors.priceCents.message)}</span>
        ) : null}
      </label>

      {includePublishState ? (
        <label className='grid gap-2'>
          <span className='text-sm font-medium text-[color:var(--text)]'>Status</span>
          <Select {...form.register('isPublished')}>
            <option value='false'>Draft</option>
            <option value='true'>Published</option>
          </Select>
          {form.formState.errors.isPublished ? (
            <span className='text-xs text-red-500'>
              {toErrorMessage(form.formState.errors.isPublished.message)}
            </span>
          ) : null}
        </label>
      ) : null}

      <div className='flex items-center gap-2'>
        <button className={buttonVariants()} disabled={isPending} type='submit'>
          {isPending ? 'Saving...' : submitLabel}
        </button>
        <Link className={buttonVariants({ variant: 'outline' })} href={cancelHref}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
