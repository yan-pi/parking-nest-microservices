import { z } from 'zod';

export const PaymentSchema = z.object({
  vehicleId: z.number(),
  amount: z.number().positive(),
  method: z.enum(['cash', 'pix', 'credit_card']),
});

export type CreatePaymentDto = z.infer<typeof PaymentSchema>;
