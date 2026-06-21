import { NextFunction } from "express";
import jwt from "jsonwebtoken";

export const optionalAuth = async (req, res, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch {
        req.user = null;
    }

    next();
};