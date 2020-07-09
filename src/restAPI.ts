import express from "express";
import bodyParser from "body-parser";
import { Dokus } from "./docus";
import { promises as fileSystem } from "fs";
import dotenv from "dotenv";
import path from "path";

class RestApi {
    public express: express.Application;
    private docuDB: Dokus;
    constructor() {
        dotenv.config();
        this.express = express();
        this.middleware();
        this.routes();
        this.docuDB = new Dokus();
        const dokuPath:string=process.env.DOKU_ROOT;
        this.docuDB.init(dokuPath);
    }
    private middleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }
    private routes(): void {
        this.express.get("/files", (req, res) => {
            let page = 0;
            this.docuDB.getDoku(5);
            if (req.query.page) {
                page = parseInt(req.query.page.toString()) - 1;
            }
            this.docuDB.getDokus(25, page).then((resolve => {
                fileSystem.readFile(path.normalize(__dirname + "/../com/views/partials/dokuTable.ejs"))
                    .then((html) => {
                        resolve.template = html.toString();
                        res.json(resolve);
                    }).catch((reject) => {
                        console.log(reject);
                        res.send("Template nicht vorhanden: " + req.query.template);
                    });
            }));
        });
        this.express.get("/doku",(req,res)=>{
            let ID:number;
            if (req.query.ID) {
                ID = parseInt(req.query.page.toString()) - 1;
            }
        });
    }
}
export default new RestApi().express;