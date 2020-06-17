import express from "express";
import bodyParser from "body-parser";
import path from "path";
import RestApi from "./restAPI";
import {Dokus} from "./docus";
const app = express();
const port = 3070;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set("port", process.env.port || port);
app.use(express.static(path.join(__dirname,"../../public")));
Dokus.getInstance();
app.use("/api", RestApi);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});