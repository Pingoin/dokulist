import express from "express";
import bodyParser from "body-parser";
import path from "path";
import RestAPI from "./restAPI";
const app = express();
const port = 3070;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set("port", process.env.port || port);
app.use(express.static(path.join(__dirname,"../public")));


app.use("/api", RestAPI);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});