import {  type NextFunction, type Request, type Response } from "express"
import { logger } from "../lib/logger.js"
import { AppErrors } from "../errors/AppErrors.js";

export function errorHandler(
    err: Error,
    _req: Request,
    res: Response,
    next: NextFunction
): void{
    if( err instanceof AppErrors){
        res.status(err.statusCode).json({
            success: false,
            message: err.message
        })
        return;
    }
    logger.error({err}, "Unhandler error");
    res.status(500).json({
        success: false,
        message: 'Inteval server error'
    })
}