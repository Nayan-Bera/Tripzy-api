// src/validators/adminCreateHotel.ts
import { z } from "zod";

export const createHotelSchema = z.object({
  
  name: z.string().min(3),
  contact: z.string().min(5),
  ownerEmail: z.string().email(),
});
