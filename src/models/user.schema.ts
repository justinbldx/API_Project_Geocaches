import { z } from "zod";

export const createUserSchema = z.object({
    username: z.string().min(3).max(30),
    password: z.string().min(8).max(100),
    role: z.enum(["user", "admin"]).optional()
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
    username: z.string().min(3).max(30).optional(),
    password: z.string().min(8).max(100).optional(),
    role: z.enum(["user", "admin"]).optional()
});

export type UpdateUserDTO = z.infer<typeof updateUserSchema>;