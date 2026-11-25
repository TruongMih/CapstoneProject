import { env } from "../config/env.js";
import type { TokenPayLoad } from "../types/users.js";
import jwt, {type SignOptions} from  'jsonwebtoken'
export function signAccessToken(payload: TokenPayLoad): string{
    const options:SignOptions = {
        expiresIn: env.jwtAccessExpiresIn as SignOptions["expiresIn"] ?? "30m",
    }
    return jwt.sign(payload,env.jwtAccessSecret, options);
}   