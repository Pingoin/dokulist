import express from "express";
import bodyParser from "body-parser";
import path from "path";
import RestApi from "./restAPI";
const app = express();
const port = 3070;
app.set( "views", path.join( __dirname, "../com/views" ) );
app.set( "view engine", "ejs" );
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set("port", process.env.port || port);
app.use(express.static(path.join(__dirname,"../com/public")));
app.use("/views",express.static(path.join(__dirname,"../com/views")));

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
  // render the index template
  res.render( "index" );
} );

app.use("/api", RestApi);

app.get("*", function (req, res) {
  res.render( "index" );
});
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});