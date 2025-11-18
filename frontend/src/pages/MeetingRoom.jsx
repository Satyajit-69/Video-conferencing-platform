import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

export default function MeetingRoom() {
  const { roomId } = useParams();

  const socketRef = useRef();
  const peerRef = useRef();

  const localVideo = useRef();
  const remoteVideo = useRef();

  const [stream, setStream] = useState(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:5000");

    async function setupMedia() {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      localVideo.current.srcObject = localStream;
      setStream(localStream);

      socketRef.current.emit("join-room", roomId);

      createPeerConnection(localStream);
    }

    setupMedia();

    socketRef.current.on("offer", handleReceiveOffer);
    socketRef.current.on("answer", handleReceiveAnswer);
    socketRef.current.on("ice-candidate", handleNewICECandidate);

    return () => socketRef.current.disconnect();
  }, []);

  function createPeerConnection(localStream) {
    peerRef.current = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
      ]
    });

    localStream.getTracks().forEach(track => {
      peerRef.current.addTrack(track, localStream);
    });

    peerRef.current.ontrack = (event) => {
      remoteVideo.current.srcObject = event.streams[0];
    };

    peerRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit("ice-candidate", {
          roomId,
          candidate: event.candidate
        });
      }
    };
  }

  async function handleReceiveOffer({ sender, offer }) {
    await peerRef.current.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await peerRef.current.createAnswer();
    await peerRef.current.setLocalDescription(answer);

    socketRef.current.emit("answer", { roomId, answer });
  }

  async function handleReceiveAnswer({ answer }) {
    await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
  }

  function handleNewICECandidate({ candidate }) {
    peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
  }

  return (
    <div className="text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Meeting Room: {roomId}
      </h1>

      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-slate-800 p-4 rounded-xl">
          <h2 className="font-bold mb-2">You</h2>
          <video ref={localVideo} autoPlay playsInline muted className="w-full rounded-lg" />
        </div>

        <div className="bg-slate-800 p-4 rounded-xl">
          <h2 className="font-bold mb-2">Connected User</h2>
          <video ref={remoteVideo} autoPlay playsInline className="w-full rounded-lg" />
        </div>

      </div>
    </div>
  );
}
