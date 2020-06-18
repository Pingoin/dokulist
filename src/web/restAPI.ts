import express from "express";
import bodyParser from "body-parser";
import {Dokus} from "./docus";

class RestApi {
    public express: express.Application;
    private docuDB:Dokus;
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        this.docuDB=new Dokus();
        this.docuDB.init("N:\\");
    }
    private middleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }
    private routes(): void {

        this.express.get("/files", (req, res) => {
            this.docuDB.getDokus().then((resolve=>{
                res.json(resolve);
            }));
        });
    }
}
export default new RestApi().express;