import express from "express";
import cors from "cors";
import routes from "./routes/routes.js";
import i18n from "./i18n/messages.js";
import { jsonSyntaxMiddleware } from "./middlewares/jsonSyntaxMiddleware.js";
import "./database/index.js";
import cookieParser  from 'cookie-parser';

class App {
    constructor() {
        this.server = express();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.server.use(jsonSyntaxMiddleware);
        this.server.use(cors({ credentials: true, origin: process.env.URL_FRONTEND }));
        this.server.use(express.json());
        this.server.use(i18n.middleware);
        this.server.use(cookieParser());

        //this.server.use( function(_req,_res,next) { setTimeout(next,1500) } );

    }

    routes() {
        this.server.use(routes);
    }
}

export default new App().server;
