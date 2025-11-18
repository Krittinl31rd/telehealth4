const { Low } = require("lowdb");
const { JSONFile } = require("lowdb/node");
const path = require("path");

const facedbPath = path.join(__dirname, "../facedb.json");

const adapter = new JSONFile(facedbPath);

const dbface = new Low(adapter, []);


module.exports = { dbface };
