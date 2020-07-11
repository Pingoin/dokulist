import express from "express";
import bodyParser from "body-parser";
import { Videos } from "./videos";
import { promises as fileSystem } from "fs";
import dotenv from "dotenv";
import path from "path";

class RestApi {
    public express: express.Application;
    private docuDB: Videos;
    constructor() {
        dotenv.config();
        this.express = express();
        this.middleware();
        this.routes();
        this.docuDB = new Videos();
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
            if (req.query.page) {
                page = parseInt(req.query.page.toString()) - 1;
            }
            this.docuDB.getDokus(25, page).then((resolve => {
                res.json(resolve);
            }));
        });
        this.express.get("/templates",(req,res)=>{
            let template;
            if(req.query.template){
                template=req.query.template;
            }else{
                template="videoTable";
            }
            fileSystem.readFile(path.normalize(__dirname+"/../com/views/partials/"+template+".ejs"))
                .then((html)=>{
                    res.send(html);
                }).catch((reject)=>{
                    console.log(reject);
                    res.send("Template nicht vorhanden: "+req.query.template);
                });
        });
        this.express.get("/doku",(req,res)=>{
            let ID:number;
            if (req.query.ID) {
                ID = parseInt(req.query.ID.toString());
            }else{
                ID=0;
            }

            this.docuDB.getDoku(ID).then((resolve)=>{
                res.json(resolve);
            });
        });
    }
}
export default new RestApi().express;