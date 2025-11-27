require("dotenv").config();
const fs = require("fs");
const path = require("path");
const https = require("https");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const PORT = process.env.IO_PORT;

// SSL Cert
const httpsOptions = {
  key: fs.readFileSync(path.resolve(__dirname, "certs/privateKey.key")),
  cert: fs.readFileSync(
    path.resolve(__dirname, "certs/_.archismartsolution.com.pem")
  ),
};

// Create HTTPS server
const server = https.createServer(httpsOptions);

// Attach socket.io
const io = new Server(server, { cors: { origin: "*" } });

// JWT Auth middleware
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Auth token missing"));

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    socket.user = payload;
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

const rooms = {}; // Track peers in each room

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", ({ roomId, hasAudio, hasVideo }, callback) => {
    socket.join(roomId);
    console.log(`${socket.user.name} join room ${roomId}`);

    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }

    rooms[roomId].push({
      id: socket.id,
      username: socket?.user?.name,
      hasAudio,
      hasVideo,
    });

    const others = rooms[roomId].filter((peer) => peer.id !== socket.id);

    // Also peers (ie audio/video status) go to new users.
    callback(others);

    // Notify the room that there are new participants.
    socket.to(roomId).emit("user-connected", {
      id: socket.id,
      username: socket?.user?.name,
      hasAudio,
      hasVideo,
    });

    socket.on("disconnect", () => {
      rooms[roomId] = rooms[roomId].filter((peer) => peer.id !== socket.id);
      socket.to(roomId).emit("user-disconnected", socket.id);
    });

    // Send an offer to a selected peer.
    socket.on("offer", (payload) => {
      io.to(payload.target).emit("offer", {
        sdp: payload.sdp,
        caller: socket.id,
      });
    });

    // Send the answer to the selected peer.
    socket.on("answer", (payload) => {
      io.to(payload.target).emit("answer", {
        sdp: payload.sdp,
        caller: socket.id,
      });
    });

    // Send ice-candidate to selected peers
    socket.on("ice-candidate", (incoming) => {
      io.to(incoming.target).emit("ice-candidate", {
        candidate: incoming.candidate,
        from: socket.id,
      });
    });

    // Send chat messages to members in the room.
    socket.on("chat-message", ({ roomId, user, username, message }) => {
      io.to(roomId).emit("chat-message", { user, username, message });
    });

    socket.on("media-toggle", ({ type, enabled }) => {
      if (!rooms[roomId]) return;

      const peer = rooms[roomId].find((p) => p.id === socket.id);
      if (peer) {
        if (type === "audio") peer.hasAudio = enabled;
        if (type === "video") peer.hasVideo = enabled;

        // Broadcast to others in room about the update
        socket.to(roomId).emit("peer-media-updated", {
          id: socket.id,
          hasAudio: peer.hasAudio,
          hasVideo: peer.hasVideo,
        });
      }
    });
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`[IO] WebRTC Signaling running on ${PORT}`);
});

module.exports = { io };
