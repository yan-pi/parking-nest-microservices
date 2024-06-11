import { z } from 'zod';

export const VehicleSchema = z.object({
  id: z.number(),
  licensePlate: z.string(),
  model: z.string(),
  color: z.string(),
});

export type VehicleDTO = z.infer<typeof VehicleSchema>;
