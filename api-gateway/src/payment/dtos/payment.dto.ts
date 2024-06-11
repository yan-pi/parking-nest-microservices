import { z } from 'zod';

export const CreatePaymentSchema = z.object({
  licensePlate: z.string().nonempty('License plate cannot be empty'),
  amount: z.number().positive('Amount must be a positive number'),
});

export type CreatePaymentDto = z.infer<typeof CreatePaymentSchema>;
