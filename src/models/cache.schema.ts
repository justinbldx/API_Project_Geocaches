import { z } from "zod";

export const createCacheSchema = z.object({
    description: z.string().max(255),
    description_technique: z.string().max(255).optional(),
    description_libre: z.string().max(255).nullable().optional(),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    type_id: z.number().int().positive(),
    state_id: z.number().int().positive().optional(),
    network_id: z.number().int().positive()
});

export type CreateCacheDTO = z.infer<typeof createCacheSchema>;

export const updateCacheSchema = z.object({
    description: z.string().max(255).optional(),
    description_technique: z.string().max(255).optional(),
    description_libre: z.string().max(255).nullable().optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    type_id: z.number().int().positive().optional(),
    state_id: z.number().int().positive().optional()
});

export type UpdateCacheDTO = z.infer<typeof updateCacheSchema>;

export const addMemberSchema = z.object({
    user_id: z.number().int().positive()
});

export type AddMemberDTO = z.infer<typeof addMemberSchema>;