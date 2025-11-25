import React from "react";

const LoadinPacMan = () => {
  return (
    <div className="flex items-center justify-center gap-4">
      <div className="relative w-16 h-16">
        <div className="pacman w-full h-full rounded-full bg-yellow-400"></div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="dot w-3 h-3 rounded-full bg-slate-300"></div>
        <div className="dot w-3 h-3 rounded-full bg-slate-300"></div>
        <div className="dot w-3 h-3 rounded-full bg-slate-300"></div>
      </div>
    </div>
  );
};

export default LoadinPacMan;
