const wsClients = [];

function addWsClient(client) {
  wsClients.push(client);
}

function getWsClients() {
  return wsClients;
}

function removeWsClientById(id) {
  const index = wsClients.findIndex((c) => c.id == id);
  if (index !== -1) {
    wsClients.splice(index, 1);
    console.log(`[WS] Removed client id=${id}`);
    return true;
  }
  return false;
}

async function broadcastToLogInClients(message) {
  const msg = JSON.stringify(message);
  const clients = getWsClients();

  for (const client of clients) {
    if (client.isLogin && client.socket.readyState == WebSocket.OPEN) {
      await new Promise((resolve, reject) => {
        client.socket.send(msg, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      await new Promise((r) => setTimeout(r, 50));
    }
  }
}

async function sendToClientID(id, message) {
  const msg = JSON.stringify(message);
  const client = wsClients.find((c) => c.user?.id == id);
  if (client) {
    if (client.isLogin && client.socket.readyState == WebSocket.OPEN) {
      await new Promise((resolve, reject) => {
        client.socket.send(msg, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      await new Promise((r) => setTimeout(r, 50));
    }
  }
}

module.exports = {
  addWsClient,
  getWsClients,
  removeWsClientById,
  broadcastToLogInClients,
  sendToClientID,
};
