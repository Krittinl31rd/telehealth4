import { useEffect, useRef, useState } from "react";
import { ws_cmd } from "../constant/enum";

export default function useWebSocket(url, onMessage, token) {
  const wsRef = useRef(null);
  const [statusWS, setStatus] = useState("connecting"); // "connecting" | "open" | "closed" | "error"

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;
    setStatus("connecting");

    ws.onopen = () => {
      setStatus("open");
      console.log("WebSocket connected");
      const data = { cmd: ws_cmd.login, params: { token: token } };
      send(data);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // console.log(data);
        onMessage(data);
      } catch (err) {
        console.error("Invalid JSON from WS", err);
      }
    };

    ws.onclose = () => {
      setStatus("closed");
      console.log("WebSocket disconnected");
    };

    ws.onerror = (err) => {
      setStatus("error");
      console.error("WebSocket error", err);
    };

    return () => {
      ws.close();
    };
  }, [url, token]);

  const send = (data) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  };

  return { wsRef, send, statusWS };
}

// user_login
// { "cmd": 1, "params": { "token": "" } }
