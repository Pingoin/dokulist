import express from "express";
import bodyParser from "body-parser";
import Dokus from "./docus";

class RestApi {
    public express: express.Application;
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();

    }
    private middleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }
    private routes(): void {

        this.express.get("/files", (req, res, next) => {
            res.json(Dokus.getDokus());
        });
    }
}
export default new RestApi().express;