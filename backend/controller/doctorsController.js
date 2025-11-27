const { QueryTypes } = require("sequelize");
const runQuery = require("../helper/queryHelper");
const {
  sendToClientID,
  broadcastToLogInClients,
} = require("../utils/wsClients");
const { measurement_types, sectionList, ws_cmd } = require("../constant/enum");

exports.GetDoctors = async (req, res) => {
  try {
    return res.status(200).json({});
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
