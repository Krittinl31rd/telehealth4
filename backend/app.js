require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { readdirSync } = require("fs");
const fs = require("fs");
const path = require("path");
const { wss } = require("./server_ws");
const { io } = require("./server_io");

const app = express();
app.use(cors({ origin: "*" }));
app.use(morgan("dev"));
app.use(express.json({ limit: "5mb" }));
app.use("/img", express.static(path.join(__dirname, "img")));

// Load routes
readdirSync("./routes/").map((c) => {
  app.use(require("./routes/" + c));
});

// HTTPS options
const keyPath = path.resolve(__dirname, "certs/privateKey.key");
const certPath = path.resolve(__dirname, "certs/_.archismartsolution.com.pem");

const httpsOptions = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
};

// Use https server
const https = require("https");
const port = process.env.EXPRESS_PORT;

const server = https.createServer(httpsOptions, app);

// Start server

server.listen(port, () => {
  console.log(`[Express HTTPS] running on port: ${port}`);
});
