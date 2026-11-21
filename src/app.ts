import express, { urlencoded } from "express"
import cors from "cors"
import { errorHandler } from "./middlewares/errorHandler.js";
import { NotFound } from "./middlewares/NotFound.js";
import { apiRouter } from "./routes/index.js";
export function createApp(){
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    app.use("/api", apiRouter);
    
    app.use(NotFound);
    app.use(errorHandler);
    
    return app;
}