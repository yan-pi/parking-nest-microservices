import { z } from 'zod';

export const CreateEntryExitSchema = z.object({
  licensePlate: z.string().nonempty('License plate cannot be empty'),
  model: z.string().nonempty('Model cannot be empty'),
  color: z.string().nonempty('Color cannot be empty'),
});

export type CreateEntryExitDto = z.infer<typeof CreateEntryExitSchema>;
