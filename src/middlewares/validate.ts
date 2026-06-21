import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const validate =
    (schema: z.ZodType) =>
        (req: Request, res: Response, next: NextFunction) => {
            const result = schema.safeParse(req.body);

            if (!result.success) {
                return res.status(400).json({ 
                    error: "VALIDATION_ERROR",
                    message: result.error.issues.map((issue) => `${issue.path.join('.')} - ${issue.message}`).join('; ')
                });
            }

            req.body = result.data;
            next();
        };