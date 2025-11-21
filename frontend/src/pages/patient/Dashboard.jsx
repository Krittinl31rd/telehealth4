import React, { useEffect, useState } from "react";
import useWebSocket from "../../hooks/useWebsocket";
import useAuthStore from "../../store/auth";

const Dashboard = () => {
  const { token, user } = useAuthStore();
  const [message, setMessage] = useState(null);

  const { send, statusWS } = useWebSocket(
    import.meta.env.VITE_WS_URL,
    setMessage,
    token
  );

  useEffect(() => {
    if (!message) return;
    const { cmd, params } = message;
    console.log({ cmd, params });
    switch (cmd) {
      default:
        break;
    }
  }, [message]);

  return (
    <div className="w-full h-full p-4 bg-base-200 overflow-auto">
      <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
    </div>
  );
};

export default Dashboard;
