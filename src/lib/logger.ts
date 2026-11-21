import pino from "pino"
import { env } from "../config/env.js";

export const logger = env.isProduction
    ? pino({level : env.logLevel})
    : pino({
        level: env.logLevel,
        transport: {
            target: "pino-pretty",
            options: {
                colorize: true,
                translateTime: "SYS:standard"
            }
        }
    })