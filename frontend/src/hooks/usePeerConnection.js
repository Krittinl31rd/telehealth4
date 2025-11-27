import { useCallback } from "react";

export const usePeerConnection = ({
  socket,
  streamRef,
  peerConnections,
  dispatch,
}) => {
  const createPeer = useCallback(
    (peerId) => {
      const peer = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      // ส่ง stream ของตัวเองไปยัง peer
      streamRef.current.getTracks().forEach((track) => {
        peer.addTrack(track, streamRef.current);
      });

      // ส่ง ICE candidate ให้ peer ปลายทาง
      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            target: peerId,
            candidate: event.candidate,
          });
        }
      };

      // เมื่อได้รับ stream จาก peer
      peer.ontrack = (event) => {
        const [remoteStream] = event.streams;
        if (remoteStream) {
          dispatch({
            type: "SET_PEER_STREAM",
            id: peerId,
            stream: remoteStream,
          });
        }
      };

      // จัดการสถานะการเชื่อมต่อ
      peer.onconnectionstatechange = () => {
        if (
          ["disconnected", "failed", "closed"].includes(peer.connectionState)
        ) {
          peer.close();
          delete peerConnections.current[peerId];
          dispatch({ type: "REMOVE_PEER", id: peerId });
        }
      };

      return peer;
    },
    [socket, streamRef, peerConnections, dispatch]
  );

  const addPeer = useCallback((peerId) => createPeer(peerId), [createPeer]);

  const cleanupConnections = useCallback(() => {
    Object.values(peerConnections.current).forEach((peer) => peer.close());
    peerConnections.current = {};
  }, [peerConnections]);

  return {
    createPeer,
    addPeer,
    cleanupConnections,
  };
};
