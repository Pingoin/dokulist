import express from "express";
import bodyParser from "body-parser";

class App {

    public express: express.Application;

    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }

    private routes(): void {
        
        this.express.use("/", (req,res,next) => {
            res.send("Typescript App works!!!");
        });
    }
}

export default new App().express;