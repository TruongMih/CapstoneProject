import {  type NextFunction, type Request, type Response } from "express"
import { logger } from "../lib/logger.js"

export function errorHandler(
    err: Error,
    _req: Request,
    res: Response,
    next: NextFunction
): void{
    logger.error({err}, "Unhandler error");
    res.status(500).json({
        success: false,
        message: 'Inteval server error'
    })
}