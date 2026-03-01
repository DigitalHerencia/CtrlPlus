import { z } from 'zod';

export const bookingSlotSchema = z.object({
  startIso: z.string().datetime(),
  endIso: z.string().datetime(),
  isAvailable: z.boolean()
});
