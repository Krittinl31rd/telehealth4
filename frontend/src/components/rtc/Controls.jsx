import { useState } from "react";
import { PhoneOff, Video, VideoOff, Mic, MicOff } from "lucide-react";

export default function Controls({ stream, socket, localVideoRef, onLeave }) {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);

  const toggleMute = () => {
    const enabled = stream.getAudioTracks().some((t) => t.enabled);
    stream.getAudioTracks().forEach((track) => (track.enabled = !enabled));
    socket.emit("media-toggle", { type: "audio", enabled: !enabled });
    setIsMicOn(!enabled);
  };

  const toggleVideo = () => {
    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      socket.emit("media-toggle", {
        type: "video",
        enabled: videoTrack.enabled,
      });
      setIsVideoOn(videoTrack.enabled);
    }

    if (localVideoRef.current && localVideoRef.current.srcObject !== stream) {
      localVideoRef.current.srcObject = stream;
    }
  };

  const handleLeave = () => {
    if (onLeave) onLeave();
  };

  return (
    <>
      <div className="w-full flex justify-center items-center gap-4 py-2 px-4 shadow flex-wrap bg-base-100 rounded-b-md">
        <button
          onClick={toggleMute}
          className={`${
            isMicOn
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          } p-3 md:p-4 rounded-full shadow-lg text-white cursor-pointer`}
          title="Toggle Microphone"
        >
          {isMicOn ? (
            <Mic className="w-5 h-5" />
          ) : (
            <MicOff className="w-5 h-5" />
          )}
        </button>

        <button
          onClick={toggleVideo}
          className={`${
            isVideoOn
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-500 hover:bg-gray-600"
          } p-3 md:p-4 rounded-full shadow-lg text-white cursor-pointer`}
          title="Toggle Camera"
        >
          {isVideoOn ? (
            <Video className="w-5 h-5" />
          ) : (
            <VideoOff className="w-5 h-5" />
          )}
        </button>

        <button
          onClick={handleLeave}
          className="bg-red-700 hover:bg-red-800 p-3 md:p-4 rounded-full shadow-lg text-white cursor-pointer"
          title="Leave Call"
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>
    </>
  );
}
