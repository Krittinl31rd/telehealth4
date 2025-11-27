import { io } from "socket.io-client";

let socket = null;

export const getSocket = (token) => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SIGNALING_URL, {
      transports: ["websocket"],
      auth: {
        token,
      },
    });
  }

  return socket;
};
