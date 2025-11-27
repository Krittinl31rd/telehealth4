import React, { useRef, useEffect, memo } from "react";
import { User } from "lucide-react";

const LocalVideo = ({ localID = "", loaclName = "", videoRef, stream }) => {
  const hasAudio = stream?.getAudioTracks().some((t) => t.enabled);
  const hasVideo = stream?.getVideoTracks().some((t) => t.enabled);

  useEffect(() => {
    if (videoRef.current && stream && videoRef.current.srcObject !== stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, videoRef]);

  return (
    <div className="relative aspect-video rounded-md">
      {/* <div className="relative w-full h-full rounded-md"> */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        // className={`w-full h-full object-contain rounded-md bg-black ${
        //   !hasVideo ? "opacity-0" : ""
        // }`}
        className={`rounded-md object-cover w-full h-full bg-black ${
          !hasVideo ? "opacity-0" : ""
        }`}
      />
      <div className="flex items-center gap-1 absolute bottom-0 left-0 text-xs p-1 min-h-[35px] text-white bg-black/50 rounded-tr-md z-20">
        {loaclName.slice(0, 5)} (Me)
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
};

export default memo(LocalVideo);
