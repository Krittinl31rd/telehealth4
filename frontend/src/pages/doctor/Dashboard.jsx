import React, { useEffect, useState } from "react";
import useWebSocket from "../../hooks/useWebsocket";
import useAuthStore from "../../store/auth";
const Dashboard = () => {
  const { token, user } = useAuthStore();
  return (
    <div className="w-full h-full p-4 bg-base-200 overflow-auto">
      {" "}
      <h1 className="text-2xl font-bold ">Welcome back, Dr.{user?.name}!</h1>
    </div>
  );
};

export default Dashboard;
