const fs = require("fs");
const path = require("path");
const http = require("http");
//const https = require("https");
require("dotenv").config();
const { mongoConnect } = require("./services/mongo");
const app = require("./app");

// const options = {
//   key: fs.readFileSync("key.pem"),
//   cert: fs.readFileSync("cert.pem"),
// };

//const server = https.createServer(options, app);
const server = http.createServer(app);

const PORT = process.env.PORT || 4246;

async function startServer() {
  await mongoConnect();
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer();
