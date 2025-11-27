import React from "react";
import LocalVideo from "./LocalVideo";
import PeerVideo from "./PeerVideo";

const VideoGrid = ({ localID, loaclName, localVideoRef, stream, peers }) => {
  const peerEntries = Object.entries(peers);
  const totalParticipants = peerEntries.length + 1;

  let gridCols = "grid-cols-1";

  if (totalParticipants === 1) {
    gridCols = "grid-cols-2";
  } else if (totalParticipants === 2) {
    gridCols = "grid-cols-2";
  } else if (totalParticipants <= 4) {
    gridCols = "grid-cols-2 md:grid-cols-2";
  } else if (totalParticipants <= 6) {
    gridCols = "grid-cols-2 md:grid-cols-3";
  } else if (totalParticipants <= 9) {
    gridCols = "grid-cols-2 md:grid-cols-3 lg:grid-cols-3";
  } else {
    gridCols = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5";
  }

  return (
    <div
      className={`w-full h-full grid ${gridCols} gap-2 p-0 bg-base-300 transition-all duration-300 items-center justify-center`}
    >
      <LocalVideo
        localID={localID}
        loaclName={loaclName}
        videoRef={localVideoRef}
        stream={stream}
      />
      {peerEntries.map(([id, peer]) => (
        <PeerVideo
          key={id}
          peerID={id}
          peerUsername={peer.username}
          stream={peer.stream}
          hasAudio={peer.hasAudio}
          hasVideo={peer.hasVideo}
        />
      ))}
    </div>
  );
};

export default VideoGrid;
