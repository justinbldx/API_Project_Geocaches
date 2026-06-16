import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError';

/**
 * Doit être déclaré APRÈS toutes les routes dans app.ts.
 * - Erreurs connues (AppError) : on renvoie le message et le code prévus.
 * - Erreurs inconnues (bug, exception non gérée) : on logue le détail côté
 *   serveur mais on ne renvoie jamais la stack au client, et on répond 500.
 *
 * La signature à 4 paramètres est ce qui permet à Express de reconnaître
 * cette fonction comme middleware d'erreurs.
 */
export function errorHandler(
        err: Error,
        req: Request,
        res: Response,
        _next: NextFunction
    ): void {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
        status: 'error',
        message: err.message,
        });
        return;
    }

    console.error(`[Erreur non gérée] ${req.method} ${req.originalUrl}`, err);

    res.status(500).json({
        status: 'error',
        message: 'Erreur interne du serveur',
    });
}