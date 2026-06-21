import { NextFunction, Request, Response } from 'express';
import { AppError, BadRequestError } from '../errors/AppError';

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

    // Handle SQL constraint errors (foreign key, unique constraints, etc.)
    if (isSqlError(err)) {
        const sqlErr = err as any;
        if (sqlErr.errno === 1452) { // Foreign key constraint fails
            const constraintMatch = sqlErr.sqlMessage?.match(/CONSTRAINT `([^`]+)`/);
            const constraintName = constraintMatch?.[1] || 'unknown';
            const message = `Contrainte d'intégrité violée : ${constraintName}. Vérifiez que les références existent.`;
            res.status(400).json({
                status: 'error',
                message,
            });
            return;
        }
        if (sqlErr.errno === 1062) { // Duplicate key error
            const message = 'Cette valeur existe déjà (violation de contrainte d\'unicité).';
            res.status(400).json({
                status: 'error',
                message,
            });
            return;
        }
    }

    console.error(`[Erreur non gérée] ${req.method} ${req.originalUrl}`, err);

    res.status(500).json({
        status: 'error',
        message: 'Erreur interne du serveur',
    });
}

function isSqlError(err: Error): boolean {
    return (err as any).errno !== undefined && (err as any).sqlMessage !== undefined;
}