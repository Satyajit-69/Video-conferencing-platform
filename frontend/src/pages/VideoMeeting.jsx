import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const SOCKET_SERVER = "http://localhost:5000"; // backend socket server

export default function VideoMeeting() {
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);

  const peerRef = useRef(null);
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);

  const roomId = window.location.pathname.split("/")[2]; // /meeting/{id}

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER);

    // 1️⃣ Join room
    socketRef.current.emit("join-room", roomId);

    // 2️⃣ Get user media
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      localStreamRef.current = stream;
      localVideo.current.srcObject = stream;

      // 3️⃣ When another user joins, create offer
      socketRef.current.on("user-joined", () => {
        createOffer();
      });
    });

    // 4️⃣ Receive offer
    socketRef.current.on("offer", handleReceiveOffer);

    // 5️⃣ Receive answer
    socketRef.current.on("answer", handleAnswer);

    // 6️⃣ Receive ICE candidate
    socketRef.current.on("ice-candidate", handleNewICECandidate);

  }, []);

  // WebRTC — create peer connection
  const createPeer = () => {
    peerRef.current = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
      ]
    });

    // send ICE to peer
    peerRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit("ice-candidate", {
          roomId,
          candidate: event.candidate,
        });
      }
    };

    // remote stream
    peerRef.current.ontrack = (event) => {
      remoteVideo.current.srcObject = event.streams[0];
    };

    // add tracks
    localStreamRef.current.getTracks().forEach((track) => {
      peerRef.current.addTrack(track, localStreamRef.current);
    });
  };

  // Create offer
  const createOffer = async () => {
    createPeer();

    const offer = await peerRef.current.createOffer();
    await peerRef.current.setLocalDescription(offer);

    socketRef.current.emit("offer", {
      roomId,
      offer,
    });
  };

  // Receive offer & send answer
  const handleReceiveOffer = async (data) => {
    createPeer();

    await peerRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));

    const answer = await peerRef.current.createAnswer();
    await peerRef.current.setLocalDescription(answer);

    socketRef.current.emit("answer", {
      roomId,
      answer,
    });
  };

  // Handle answer
  const handleAnswer = async (data) => {
    await peerRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
  };

  const handleNewICECandidate = async (data) => {
    try {
      await peerRef.current.addIceCandidate(new RTCIceCandidate(data));
    } catch (e) {
      console.error("ICE error", e);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center pt-10">

      <h1 className="text-2xl font-bold mb-6">Meeting Room: {roomId}</h1>

      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Your Video */}
        <div className="bg-slate-800 rounded-xl p-3">
          <h2 className="text-lg mb-2">You</h2>
          <video ref={localVideo} autoPlay playsInline muted className="rounded-lg w-80 h-56 bg-black" />
        </div>

        {/* Remote Video */}
        <div className="bg-slate-800 rounded-xl p-3">
          <h2 className="text-lg mb-2">Connected User</h2>
          <video ref={remoteVideo} autoPlay playsInline className="rounded-lg w-80 h-56 bg-black" />
        </div>

      </div>
    </div>
  );
}
