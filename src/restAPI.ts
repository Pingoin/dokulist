import express from "express";
import bodyParser from "body-parser";
import {Dokus} from "./docus";
import { promises as fileSystem} from "fs";
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
            console.log(req.query);
            this.docuDB.getDokus().then((resolve=>{
                fileSystem.readFile(path.normalize(__dirname+"/../com/views/partials/dokuTable.ejs"))
                .then((html)=>{
                    resolve.template=html.toString();
                    res.json(resolve);
                }).catch((reject)=>{
                    console.log(reject);
                    res.send("Template nicht vorhanden: "+req.query.template);
                });
            })); 
        });

        this.express.get("/templates",(req,res)=>{
            let template;
            if(req.query.template){
                template=req.query.template;
            }else{
                template="dokuTable";
            }
            fileSystem.readFile(path.normalize(__dirname+"/../com/views/partials/"+template+".ejs"))
                .then((html)=>{
                    res.send(html);
                }).catch((reject)=>{
                    console.log(reject);
                    res.send("Template nicht vorhanden: "+req.query.template);
                });
        });
    } 
}
export default new RestApi().express;