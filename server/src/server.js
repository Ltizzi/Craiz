const fs = require("fs");
const path = require("path");
const http = require("http");
require("dotenv").config();
const { mongoConnect } = require("./services/mongo");
const app = require("./app");

const server = http.createServer(app);

const PORT = process.env.PORT || 2156;

async function startServer() {
  await mongoConnect();
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer();
