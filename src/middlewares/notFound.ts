import { NextFunction, Request, Response } from 'express';
import { NotFoundError } from '../errors/AppError';

/**
 * Gère les routes non trouvées.
 * @param req Requête HTTP en cours.
 * @param _res Réponse HTTP.
 * @param next Middleware suivant.
 */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} introuvable`));
}