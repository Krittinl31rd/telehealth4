import Room from "./Room";
import { useState } from "react";

function Home() {
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);

  const handleJoin = () => {
    if (roomId.trim()) setJoined(true);
  };

  if (!joined) {
    return (
      <div className=" w-full h-full flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Join a Room</h1>
        <input
          className="input p-2"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter Room ID"
        />
        <button className="bg-primary px-4 py-2 rounded" onClick={handleJoin}>
          Join now!!!
        </button>
      </div>
    );
  }

  return <Room roomId={roomId} />;
}

export default Home;
