require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { readdirSync } = require("fs");
const { wss } = require("./server_ws");

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

readdirSync("./routes/").map((c) => {
  app.use(require("./routes/" + c));
});

const port = process.env.EXPRESS_PORT;
app.listen(port, () => {
  console.log(`[Express] running on port: ${port}`);
});
