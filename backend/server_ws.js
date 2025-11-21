require("dotenv").config();
const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");
const {
  addWsClient,
  getWsClients,
  removeWsClientById,
  broadcastToLogInClients,
  sendToClientID,
} = require("./utils/wsClients");
const jwt = require("jsonwebtoken");

const { ws_cmd } = require("./constant/enum");

(async () => {
  const wss = new WebSocket.Server({
    port: process.env.WS_PORT,
    path: "/echo",
  });
  console.log(`[WS] running on port: ${process.env.WS_PORT}`);

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
            const decoded = await jwt.verify(token, process.env.JWT_SECRET);
            infoClient.isLogin = true;
            infoClient.user = decoded;
            const clientUser = getWsClients().find(
              (c) => c.user?.id == decoded.id
            );
            console.log(
              `[WS] Clients now: [${clientUser?.user?.id}]${clientUser?.user?.name}`
            );
            ws.send(
              JSON.stringify({
                cmd: ws_cmd.login,
                params: {
                  status: "success",
                  message: "Login successful",
                },
              })
            );
            return;
          } catch (err) {
            console.log(`Client ${infoClient.id} login failed: ${err.message}`);
            return ws.send(
              JSON.stringify({
                cmd: ws_cmd.login,
                params: { status: "error", message: err.message },
              })
            );
          }
        } else if (cmd == "test") {
          if (infoClient.isLogin == true) {
            const {} = params;
          }
        }
      } catch (err) {
        console.error("Error processing message:", err);
      }
    });

    ws.on("close", () => {
      console.log(`Client ${infoClient.id} disconnected`);
      removeWsClientById(infoClient.id);
    });
  });

  module.exports = {
    wss,
  };
})();
