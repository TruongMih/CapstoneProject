import { error } from 'console';
import dotenv from 'dotenv';

dotenv.config();

function CheckEnvVariables(key:string):string{
    const value = process.env[key];

    if(!value){
        throw new Error(`Missing env variable for ${key}`)
    }
    return value;
}


export const env = {
    port: Number(process.env.PORT ?? 3001),
    isProduction: (process.env.NODE_ENV ?? "development") === "production",
    nodeEnv: process.env.NODE_ENV ?? "development",
    logLevel: process.env.LOG_LEVEL ?? "info",
    databaseUrl: CheckEnvVariables('DATABASE_URL'),
    jwtAccessSecret: CheckEnvVariables('JWT_SECRET'),
    jwtAccessExpiresIn: CheckEnvVariables('JWT_ACCESS_EXPIRES_IN')
} as const;
