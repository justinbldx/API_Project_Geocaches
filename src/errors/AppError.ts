/**
 * Erreur "métier" connue et volontaire (par opposition à un bug inattendu).
 * Le middleware d'erreurs s'appuie sur `statusCode` pour formater la réponse HTTP.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Requête invalide') {
    super(message, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Ressource introuvable') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflit avec une ressource existante') {
    super(message, 409);
  }
}
// 403 - Droits insuffisants (Celle qui te manque !)
export class ForbiddenError extends AppError {
  constructor(message: string = 'Droits insuffisants') {
    super(message, 403);
  }
}