import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError';
import { ErrorResponse } from '../types/types';

/**
 * Gère les erreurs et envoie une réponse appropriée au client.
 * @param err Erreur à traiter.
 * @param req Requête HTTP en cours.
 * @param res Réponse HTTP.
 * @param _next Middleware suivant, non utilisé.
 */
export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
): void {
    // AppError métier
    if (err instanceof AppError) {
        const response: ErrorResponse = {
            error: err.code,
            message: err.message
        };

        res.status(err.statusCode).json(response);
        return;
    }

    // Gestion des erreurs lié à un mauvais JSON reçu
    if (isJsonParseError(err)) {
        const response: ErrorResponse = {
            error: "INVALID_JSON",
            message: "Le corps de la requête contient un JSON mal formaté"
        };
        res.status(400).json(response);
        return;
    }

    // Erreurs SQL
    if (isSqlError(err)) {
        const sqlErr = err as any;

        if (sqlErr.errno === 1452) {
            const response: ErrorResponse = {
                error: "FOREIGN_KEY_CONSTRAINT",
                message: "Contrainte d'intégrité violée"
            };

            res.status(400).json(response);
            return;
        }

        if (sqlErr.errno === 1062) {
            const response: ErrorResponse = {
                error: "DUPLICATE_KEY",
                message: "Cette valeur existe déjà"
            };

            res.status(400).json(response);
            return;
        }
    }

    // Erreurs inconnues
    console.error(`[Erreur non gérée] ${req.method} ${req.originalUrl}`, err);

    const response: ErrorResponse = {
        error: "INTERNAL_SERVER_ERROR",
        message: "Erreur interne du serveur"
    };

    res.status(500).json(response);
}

/**
 * Vérifie si une erreur correspond à une erreur SQL MySQL.
 * @param err Erreur à vérifier.
 * @returns true si l'erreur est de type SQL, false sinon.
 */
function isSqlError(err: Error): boolean {
    return (err as any).errno !== undefined && (err as any).sqlMessage !== undefined;
}

/**
 * Vérifie si une erreur correspond à un JSON mal formé dans le corps de la requête.
 * @param err Erreur à vérifier.
 * @returns true si l'erreur provient du parsing JSON, false sinon.
 */
function isJsonParseError(err: Error): boolean {
  return (
    err instanceof SyntaxError &&
    (err as any).type === "entity.parse.failed" &&
    "body" in err
  );
}