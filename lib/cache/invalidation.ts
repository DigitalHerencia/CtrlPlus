import { revalidatePath, revalidateTag } from 'next/cache';

function isUnsupportedRevalidationRuntimeError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  return message.includes('incrementalcache missing')
    || message.includes('static generation store missing')
    || message.includes('server action or route handler');
}

export function safeRevalidateTag(tag: string): void {
  try {
    revalidateTag(tag, 'max');
  } catch (error) {
    if (!isUnsupportedRevalidationRuntimeError(error)) {
      throw error;
    }
  }
}

export function safeRevalidatePath(path: string): void {
  try {
    revalidatePath(path);
  } catch (error) {
    if (!isUnsupportedRevalidationRuntimeError(error)) {
      throw error;
    }
  }
}
