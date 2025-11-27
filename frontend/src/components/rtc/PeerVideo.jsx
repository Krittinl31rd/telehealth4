import { MicOff, VideoOff, User } from "lucide-react";
import React, { useRef, useEffect, memo } from "react";

export default function PeerVideo({
  peerID = "",
  peerUsername = "",
  stream,
  hasAudio,
  hasVideo,
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream && videoRef.current.srcObject !== stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative aspect-video rounded-md">
      {/* // <div className="relative w-full h-full rounded-md"> */}
      <video
        playsInline
        autoPlay
        // ref={(video) => {
        //   if (video && stream) video.srcObject = stream;
        // }}
        ref={videoRef}
        // className={`w-full h-full object-contain rounded-md bg-black ${
        //   !hasVideo ? "opacity-0" : ""
        // }`}
        className={`rounded-md object-cover w-full h-full bg-black ${
          !hasVideo ? "opacity-0" : ""
        }`}
      />
      <div className="flex items-center gap-1 absolute bottom-0 left-0 text-xs p-1 min-h-[35px] text-white bg-black/50 rounded-tr-md z-20">
        {peerUsername.slice(0, 5)}
        {!hasAudio && (
          <div className="bg-black/60 p-1 rounded-full">
            <MicOff className="w-4 h-4 text-white" />
          </div>
        )}
        {!hasVideo && (
          <div className="bg-black/60 p-1 rounded-full">
            <VideoOff className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
      {!hasVideo && (
        <div className="w-full h-full absolute inset-0 flex items-center justify-center bg-black text-white text-4xl mb-4 rounded-md">
          <div className="bg-gray-200/60 p-4 rounded-full">
            <User size={32} className=" text-white" />
          </div>
        </div>
      )}
    </div>
  );
}
