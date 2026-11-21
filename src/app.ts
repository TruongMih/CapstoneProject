import express, { urlencoded } from "express"
import { errorHandler } from "./middlewares/errorHandler.js";
import { NotFound } from "./middlewares/NotFound.js";
export function createApp(){
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    app.use(errorHandler);
    app.use(NotFound);
    return app;
}