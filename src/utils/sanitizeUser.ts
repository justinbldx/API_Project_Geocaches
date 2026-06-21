import { JWTUser } from "../types/types";

export function sanitizeUser(jwtUser: JWTUser) {
    return {
        id: jwtUser.id,
        role: jwtUser.role,
        username: jwtUser.username
    };
}