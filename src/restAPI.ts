import express from "express";
import bodyParser from "body-parser";
import {Dokus} from "./docus";
import { promises as fileSystem, PathLike } from "fs";
import path from "path";

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

        this.express.get("/fileCount", (req, res) => {
            this.docuDB.getDokuCount().then((resolve=>{
                res.sendStatus(resolve);
            })); 
        });

        this.express.get("/templates/dokuTable",(req,res)=>{
            fileSystem.readFile(path.normalize(__dirname+"/../com/views/partials/dokuTable.ejs"))
                .then((html)=>{
                    res.send(html);
                });
        });
    } 
}
export default new RestApi().express;