import { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * Express ne capture pas automatiquement les rejets de Promise dans les handlers
 * async. Ce wrapper évite d'écrire un try/catch dans chaque controller 
 * toute erreur (ou rejet) est transmise à `next()`, donc au middleware d'erreurs.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}