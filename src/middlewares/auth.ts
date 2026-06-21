import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json(
            { 
                error: "AUTHENTICATION_ERROR",
                message: "Token d'authentification manquant ou mal formé"
            }
        );

        return;
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json(
            { 
                error: "AUTHENTICATION_ERROR",
                message: "Token invalide ou expiré"
            }
        );
    }
}