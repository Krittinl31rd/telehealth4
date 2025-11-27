import React, {
  useEffect,
  useRef,
  useState,
  useReducer,
  useCallback,
} from "react";
import VideoGrid from "../../components/rtc/VideoGrid";
import ChatPanel from "../../components/rtc/ChatPanel";
import ControlButtons from "../../components/rtc/Controls";
import { getSocket } from "../../utilities/socket";
import { usePeerConnection } from "../../hooks/usePeerConnection";
import { peerReducer } from "../../reducers/peerReducer";
import ParticipantsPanel from "../../components/rtc/ParticipantsPanel";
import { Users, MessageCircle, Copy, CopyCheck } from "lucide-react";
import useAuthStore from "../../store/auth";

export default function Room({ roomId }) {
  const { token, user } = useAuthStore();
  const socket = getSocket(token);
  const [streamReady, setStreamReady] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [hasAudio, setHasAudio] = useState(true);
  const [hasVideo, setHasVideo] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [isCopy, setIsCopy] = useState(false);

  const [peers, dispatch] = useReducer(peerReducer, {});

  const localVideoRef = useRef();
  const streamRef = useRef(null);
  const peerConnections = useRef({});

  const { createPeer, addPeer, cleanupConnections } = usePeerConnection({
    socket,
    streamRef,
    peerConnections,
    dispatch,
  });
  useEffect(() => {
    async function initMedia() {
      try {
        const media = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = media;
        setHasAudio(media.getAudioTracks().some((t) => t.enabled));
        setHasVideo(media.getVideoTracks().some((t) => t.enabled));
      } catch {
        const fallbackStream = new MediaStream([
          getSilentAudioTrack(),
          getBlackVideoTrack(),
        ]);
        streamRef.current = fallbackStream;
        setHasAudio(false);
        setHasVideo(false);
      }
      setStreamReady(true);
    }

    const getSilentAudioTrack = () => {
      const ctx = new AudioContext();
      const oscillator = ctx.createOscillator();
      const dst = oscillator.connect(ctx.createMediaStreamDestination());
      oscillator.start();
      return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
    };

    const getBlackVideoTrack = () => {
      const canvas = Object.assign(document.createElement("canvas"), {
        width: 640,
        height: 480,
      });
      canvas.getContext("2d").fillRect(0, 0, canvas.width, canvas.height);
      const stream = canvas.captureStream();
      return Object.assign(stream.getVideoTracks()[0], { enabled: false });
    };

    initMedia();
    return cleanupConnections;
  }, [cleanupConnections]);

  useEffect(() => {
    if (localVideoRef.current && streamRef.current) {
      localVideoRef.current.srcObject = streamRef.current;
    }
  }, [streamReady, hasVideo]);

  const handleOffer = useCallback(
    async ({ sdp, caller }) => {
      let peer = peerConnections.current[caller];
      if (!peer) {
        peer = addPeer(caller);
        peerConnections.current[caller] = peer;
      }
      try {
        await peer.setRemoteDescription(new RTCSessionDescription(sdp));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        socket.emit("answer", { target: caller, sdp: peer.localDescription });
      } catch (err) {
        console.error("Error handling offer:", err);
      }
    },
    [addPeer]
  );

  useEffect(() => {
    if (!streamReady) return;

    socket.emit("join-room", { roomId, hasAudio, hasVideo }, (usersInRoom) => {
      console.log(usersInRoom);
      usersInRoom.forEach(({ id, username, hasAudio, hasVideo }) => {
        console.log(username);
        if (peerConnections.current[id]) return;
        const peer = createPeer(id);
        peerConnections.current[id] = peer;

        dispatch({ type: "ADD_PEER", id, hasAudio, hasVideo, username });

        peer
          .createOffer()
          .then((offer) => peer.setLocalDescription(offer))
          .then(() => {
            socket.emit("offer", { target: id, sdp: peer.localDescription });
          });
      });
    });

    socket.on("user-connected", ({ id, hasAudio, hasVideo, username }) => {
      if (peerConnections.current[id]) return;
      const peer = addPeer(id);
      peerConnections.current[id] = peer;
      dispatch({ type: "ADD_PEER", id, hasAudio, hasVideo, username });
    });

    socket.on("offer", handleOffer);

    socket.on("answer", async ({ sdp, caller }) => {
      const peer = peerConnections.current[caller];
      if (peer && peer.signalingState === "have-local-offer") {
        await peer.setRemoteDescription(new RTCSessionDescription(sdp));
      }
    });

    socket.on("ice-candidate", async ({ candidate, from }) => {
      const peer = peerConnections.current[from];
      if (peer && candidate) {
        await peer.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socket.on("user-disconnected", (id) => {
      if (peerConnections.current[id]) {
        peerConnections.current[id].close();
        delete peerConnections.current[id];
        dispatch({ type: "REMOVE_PEER", id });
      }
    });

    // socket.on("chat-message", ({ user, message }) => {
    //   setChatMessages((prev) => [...prev, { user, message }]);
    // });

    socket.on("peer-media-updated", ({ id, hasAudio, hasVideo }) => {
      dispatch({ type: "UPDATE_PEER_MEDIA", id, hasAudio, hasVideo });
    });

    return () => {
      socket.off("user-connected");
      socket.off("offer", handleOffer);
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("user-disconnected");
      // socket.off("chat-message");
      socket.off("peer-media-updated");
    };
  }, [streamReady, roomId, handleOffer]);

  useEffect(() => {
    socket.on("chat-message", ({ user, message, username }) => {
      setChatMessages((prev) => [...prev, { user, message, username }]);
    });
    return () => socket.off("chat-message");
  }, []);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden p-0">
      {/* Header */}
      <div className="flex items-center justify-between bg-base-100 px-4 py-2 rounded-t-md shadow-sm flex-wrap">
        <header className="flex-1 flex items-center gap-2 text-lg md:text-xl font-bold">
          Room: <span className="truncate max-w-16">{roomId}</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(roomId);
              setIsCopy(true);
              setTimeout(() => setIsCopy(false), 500);
            }}
            className="btn btn-soft"
            title={isCopy ? "Copied!" : "Copy room ID"}
          >
            {!isCopy ? <Copy size={16} /> : <CopyCheck size={16} />}
          </button>
        </header>
        <div className="flex gap-2">
          {/* Mobile Toggle Chat */}
          <button
            className="md:hidden btn-soft btn-primary"
            onClick={() => setShowChat(!showChat)}
          >
            <MessageCircle />
          </button>
          {/* Participants */}
          <button
            onClick={() => setShowParticipants(true)}
            className="btn btn-soft btn-primary"
          >
            <Users /> Participants
          </button>
        </div>
      </div>

      {/* Main Content */}
      {/* <div className="flex-1 flex flex-col md:flex-row overflow-hidden"> */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden md:space-x-2 space-y-2 md:space-y-0 bg-base-300">
        <div className="flex-1 overflow-hidden">
          <VideoGrid
            localID={socket.id}
            loaclName={user.name}
            localVideoRef={localVideoRef}
            stream={streamRef.current}
            peers={peers}
          />
        </div>

        {/* Chat Panel */}
        {showChat && (
          <div className="h-full max-h-[300px] md:max-h-none flex flex-col rounded-br-md">
            <ChatPanel
              socket={socket}
              loaclName={user.name}
              messages={chatMessages}
              roomId={roomId}
            />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="w-full flex items-center justify-center">
        <ControlButtons
          stream={streamRef.current}
          socket={socket}
          localVideoRef={localVideoRef}
          onLeave={() => {
            socket.disconnect();
            window.location.href = "/call";
          }}
        />
      </div>

      {/* Participants */}
      <ParticipantsPanel
        isOpen={showParticipants}
        onClose={() => setShowParticipants(false)}
        localID={socket.id}
        loaclName={user.name}
        peers={peers}
      />
    </div>
  );
}
