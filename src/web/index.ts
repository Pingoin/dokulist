import App from "./app";
import http from "http";

const port = 3070;

  App.set("port", port);
  const server = http.createServer(App);
  server.listen(port);
  
server.on("listening", function(): void {
    const addr = server.address();
    const bind = (typeof addr === "string") ? `pipe ${addr}` : `port ${addr.port}`;
    console.log(`Listening on ${bind}`);
 });

module.exports = App;