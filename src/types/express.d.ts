import { JWTUser } from "./types";

declare global {
  namespace Express {
    interface Request {
      user?: JWTUser;
    }
  }
}