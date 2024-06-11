import { z } from 'zod';

export const VehicleSchema = z.object({
  licensePlate: z.string(),
  model: z.string(),
  color: z.string(),
});

export type VehicleDTO = z.infer<typeof VehicleSchema>;
