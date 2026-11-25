import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";

// main root file
const app = createApp()

app.listen(env.port, ()=>{
    logger.info(`Server is running on http://localhost:${env.port}`)
});
 