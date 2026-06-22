import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

/**
 * Interface qui représente les options de configuration du middleware d'authentification.
 */
interface AuthOptions {
    required?: boolean;
}

/**
 * Middleware d'authentification JWT pour valider les tokens Bearer.
 * @param options - Options de configuration du middleware
 * @param options.required - Si true, retourne une erreur 401 si le token est manquant. Par défaut: true
 * @returns Fonction middleware Express qui valide le token JWT
 */
export function auth({ required = true }: AuthOptions = {}) {
    return (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : null;

        if (!token) {
            if (required) {
                return res.status(401).json({
                    error: "AUTHENTICATION_ERROR",
                    message: "Token d'authentification manquant ou mal formé"
                });
            }

            req.user = undefined;
            return next();
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!);
            req.user = decoded;
            next();
        } catch {
            if (required) {
                return res.status(403).json({
                    error: "AUTHENTICATION_ERROR",
                    message: "Token invalide ou expiré"
                });
            }

            req.user = undefined;
            next();
        }
    };
}