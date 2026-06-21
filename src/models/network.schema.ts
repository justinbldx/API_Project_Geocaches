import { z } from "zod";

export const createNetworkSchema = z.object({
    "name": z.string().min(1).max(100)
});

export type CreateNetworkDTO = z.infer<typeof createNetworkSchema>;

export const updateNetworkSchema = z.object({
    "name": z.string().min(1).max(100).optional()
});

export type UpdateNetworkDTO = z.infer<typeof updateNetworkSchema>;