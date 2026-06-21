import { z } from "zod";

export const createVisitSchema = z.object({
  "cache_id": z.number().int().positive(),
  "found": z.boolean(),
  "comment": z.string().max(255).optional(),
  "visited_at": z.coerce.date(),
  "photo_url": z.url().optional()
});

export type CreateVisitDTO = z.infer<typeof createVisitSchema>;