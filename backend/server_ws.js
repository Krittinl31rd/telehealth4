require("dotenv").config();
const fs = require("fs");
const path = require("path");
const https = require("https");
const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");
const { loadDoctorsStatus } = require("./helper/doctor");

const {
  addWsClient,
  getWsClients,
  removeWsClientById,
  broadcastToLogInClients,
  sendToClientID,
} = require("./utils/wsClients");

const jwt = require("jsonwebtoken");
const { ws_cmd, user_role } = require("./constant/enum");
const {
  getDoctorStatus,
  doctorStatus,
  getAllOnlineDoctors,
  setDoctorStatus,
} = require("./cache/doctors");

// HTTPS options
const keyPath = path.resolve(__dirname, "certs/privateKey.key");
const certPath = path.resolve(__dirname, "certs/_.archismartsolution.com.pem");

const httpsOptions = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
};

// Create HTTPS server
const server = https.createServer(httpsOptions);

(async () => {
  // Create WebSocket server attached to HTTPS server
  const wss = new WebSocket.Server({
    server,
    path: "/echo",
  });

  // Start HTTPS server
  server.listen(process.env.WS_PORT, () => {
    loadDoctorsStatus();
    console.log(`[WS] running on port: ${process.env.WS_PORT}`);
  });

  wss.on("connection", (ws) => {
    console.log("[WS] Client connected");

    const infoClient = {
      id: uuidv4(),
      socket: ws,
      user: null,
      isLogin: false,
      ip: ws._socket.remoteAddress || null,
      lastTimestamp: Date.now(),
    };

    addWsClient(infoClient);

    ws.on("message", async (message) => {
      try {
        const { cmd, params } = JSON.parse(message);

        if (cmd == ws_cmd.login) {
          const { token } = params;

          if (infoClient.isLogin) {
            return ws.send(
              JSON.stringify({
                cmd: ws_cmd.login,
                params: { status: "success", message: "Already logged in" },
              })
            );
          }

          try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            infoClient.isLogin = true;
            infoClient.user = decoded;

            ws.send(
              JSON.stringify({
                cmd: ws_cmd.login,
                params: { status: "success", message: "Login successful" },
              })
            );

            return;
          } catch (err) {
            console.log(`Login failed: ${err.message}`);
            return ws.send(
              JSON.stringify({
                cmd: ws_cmd.login,
                params: { status: "error", message: err.message },
              })
            );
          }
        }
      } catch (err) {
        console.error("Error processing message:", err);
      }
    });

    ws.on("close", () => {
      console.log(`Client ${infoClient.id} disconnected`);

      if (infoClient.user?.role == user_role.d) {
        setDoctorStatus(infoClient.user.id, {
          status: 0,
          timestamp: Date.now(),
        });

        broadcastToLogInClients({
          cmd: ws_cmd.doctor_status,
          params: { doctor_id: infoClient.user.id, status: 0 },
        });
      }

      removeWsClientById(infoClient.id);
    });
  });

  module.exports = { wss };
})();
