import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const SOCKET_SERVER = "http://localhost:5000";

export default function VideoMeeting() {
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);
  const peerRef = useRef(null);
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);
  const isCreatingPeer = useRef(false);
  const remoteStreamRef = useRef(null);

  const roomId = window.location.pathname.split("/")[2] || "default-room";

  const [isMicOn, setMicOn] = useState(true);
  const [isCameraOn, setCameraOn] = useState(true);
  const [username] = useState("User");
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("Initializing...");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [hasRemoteStream, setHasRemoteStream] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    startMeeting();
    
    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const cleanup = () => {
    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
      localStreamRef.current = null;
    }
    remoteStreamRef.current = null;
    setHasRemoteStream(false);
    isCreatingPeer.current = false;
  };

  const startMeeting = async () => {
    try {
      setConnectionStatus("Getting camera access...");
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;
      if (localVideo.current) {
        localVideo.current.srcObject = stream;
      }

      setConnectionStatus("Connecting to server...");
      socketRef.current = io(SOCKET_SERVER, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5
      });

      socketRef.current.on("connect", () => {
        console.log("✅ Socket connected:", socketRef.current.id);
        setConnectionStatus("Joining room...");
        socketRef.current.emit("join-room", roomId);
      });

      socketRef.current.on("joined-room", (data) => {
        console.log("✅ Joined room. Initiator?", data.isInitiator);
        if (data.isInitiator) {
          setConnectionStatus("Waiting for other user...");
        } else {
          setConnectionStatus("Connecting to peer...");
        }
      });

      socketRef.current.on("user-joined", (data) => {
        console.log("🟢 User joined:", data.userId);
        setConnectionStatus("Creating connection...");
        // When a new user joins, the existing user (initiator) sends the offer
        setTimeout(() => {
          if (!peerRef.current && !isCreatingPeer.current) {
            console.log("📞 Initiating call as first user");
            createOffer();
          }
        }, 1000);
      });

      socketRef.current.on("offer", handleReceiveOffer);
      socketRef.current.on("answer", handleAnswer);
      socketRef.current.on("ice-candidate", handleNewICECandidate);
      
      socketRef.current.on("chat-message", (data) => {
        setMessages(prev => [...prev, { ...data.message, isOwn: false }]);
      });
      
      socketRef.current.on("user-left", () => {
        console.log("❌ User left");
        setIsConnected(false);
        setHasRemoteStream(false);
        setConnectionStatus("User disconnected");
        if (remoteVideo.current) {
          remoteVideo.current.srcObject = null;
        }
        remoteStreamRef.current = null;
        if (peerRef.current) {
          peerRef.current.close();
          peerRef.current = null;
        }
        isCreatingPeer.current = false;
      });

      socketRef.current.on("connect_error", (error) => {
        console.error("❌ Socket connection error:", error);
        setConnectionStatus("Connection failed - Check server");
      });

      socketRef.current.on("disconnect", () => {
        console.log("🔌 Socket disconnected");
        setConnectionStatus("Disconnected from server");
      });

    } catch (err) {
      console.error("❌ Error:", err);
      setConnectionStatus("Camera access denied");
    }
  };

  const createPeer = () => {
    if (peerRef.current || isCreatingPeer.current) {
      console.log("⚠️ Peer already exists or is being created");
      return null;
    }

    isCreatingPeer.current = true;
    console.log("🔧 Creating peer connection");
    
    const peer = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
      ],
    });

    peer.onconnectionstatechange = () => {
      console.log("🔗 Connection state:", peer.connectionState);
      setConnectionStatus(peer.connectionState);
      
      if (peer.connectionState === "connected") {
        setIsConnected(true);
        isCreatingPeer.current = false;
        
        if (remoteStreamRef.current && remoteVideo.current) {
          remoteVideo.current.srcObject = remoteStreamRef.current;
          setHasRemoteStream(true);
        }
      } else if (peer.connectionState === "failed" || peer.connectionState === "disconnected") {
        setHasRemoteStream(false);
        isCreatingPeer.current = false;
        if (peer.connectionState === "failed") {
          setConnectionStatus("Connection failed - Retrying...");
        }
      }
    };

    peer.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        console.log("🧊 Sending ICE candidate");
        socketRef.current.emit("ice-candidate", {
          roomId,
          candidate: event.candidate,
        });
      }
    };

    peer.ontrack = (event) => {
      console.log("📹 Remote stream received!");
      const remoteStream = event.streams[0];
      remoteStreamRef.current = remoteStream;
      
      // Immediately set the video source
      if (remoteVideo.current) {
        remoteVideo.current.srcObject = remoteStream;
        
        // Force play in case autoplay doesn't work
        remoteVideo.current.play().then(() => {
          console.log("✅ Remote video playing");
        }).catch(err => {
          console.log("⚠️ Autoplay issue:", err);
        });
        
        console.log("✅ Remote video element updated");
      }
      
      // Update states
      setHasRemoteStream(true);
      setIsConnected(true);
      setConnectionStatus("Connected!");
      
      // Force a re-render to hide the placeholder
      setTimeout(() => {
        if (remoteVideo.current && remoteVideo.current.srcObject) {
          console.log("✅ Video should be visible now");
          console.log("Video readyState:", remoteVideo.current.readyState);
          console.log("Video paused:", remoteVideo.current.paused);
        }
      }, 100);
    };

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        peer.addTrack(track, localStreamRef.current);
      });
    }

    peerRef.current = peer;
    isCreatingPeer.current = false;
    return peer;
  };

  const createOffer = async () => {
    try {
      const peer = createPeer();
      if (!peer) {
        console.log("⚠️ Failed to create peer for offer");
        return;
      }
      
      console.log("📤 Creating offer...");
      
      const offer = await peer.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      await peer.setLocalDescription(offer);

      console.log("📤 Sending offer to room:", roomId);
      socketRef.current.emit("offer", { roomId, offer });
    } catch (error) {
      console.error("❌ Error creating offer:", error);
      isCreatingPeer.current = false;
    }
  };

  const createOfferFromPeer = async () => {
    try {
      if (!peerRef.current) return;
      
      console.log("📤 Creating offer from existing peer...");
      
      const offer = await peerRef.current.createOffer();
      await peerRef.current.setLocalDescription(offer);

      console.log("📤 Sending offer");
      socketRef.current.emit("offer", { roomId, offer });
    } catch (error) {
      console.error("❌ Error creating offer from peer:", error);
    }
  };

  const handleReceiveOffer = async (data) => {
    try {
      console.log("📥 Received offer from:", data.userId);
      console.log("📥 Offer details:", data.offer);
      
      // Create peer if doesn't exist
      if (!peerRef.current && !isCreatingPeer.current) {
        console.log("Creating new peer to handle offer");
        const peer = createPeer();
        if (!peer) {
          console.log("⚠️ Failed to create peer");
          return;
        }
      }

      // Wait a bit if peer is still being created
      let attempts = 0;
      while (isCreatingPeer.current && attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      if (!peerRef.current) {
        console.log("⚠️ No peer available after waiting");
        return;
      }

      console.log("Current signaling state before setting remote:", peerRef.current.signalingState);

      await peerRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
      console.log("✅ Remote description set");

      console.log("📤 Creating answer...");
      const answer = await peerRef.current.createAnswer();
      await peerRef.current.setLocalDescription(answer);

      console.log("📤 Sending answer to room:", roomId);
      socketRef.current.emit("answer", { roomId, answer });
    } catch (error) {
      console.error("❌ Error handling offer:", error);
      console.error("Error details:", error.message);
    }
  };

  const handleAnswer = async (data) => {
    try {
      console.log("📥 Received answer from:", data.userId);
      console.log("📥 Answer details:", data.answer);
      
      if (!peerRef.current) {
        console.log("⚠️ No peer connection exists to receive answer");
        return;
      }
      
      console.log("Current signaling state:", peerRef.current.signalingState);
      
      if (peerRef.current.signalingState === "have-local-offer") {
        await peerRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
        console.log("✅ Answer applied successfully");
      } else if (peerRef.current.signalingState === "stable") {
        console.log("⚠️ Already in stable state, ignoring answer");
      } else {
        console.log("⚠️ Unexpected state for answer:", peerRef.current.signalingState);
      }
    } catch (error) {
      console.error("❌ Error handling answer:", error);
      console.error("Error details:", error.message);
    }
  };

  const handleNewICECandidate = async (data) => {
    try {
      console.log("🧊 Received ICE candidate from:", data.userId);
      
      if (!peerRef.current) {
        console.log("⚠️ No peer connection for ICE candidate");
        return;
      }
      
      if (!peerRef.current.remoteDescription) {
        console.log("⚠️ No remote description yet, queueing ICE candidate");
        // You might want to queue candidates here
        return;
      }
      
      await peerRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
      console.log("✅ ICE candidate added");
    } catch (error) {
      console.error("❌ ICE candidate error:", error);
      console.error("Error details:", error.message);
    }
  };

  const toggleMic = () => {
    const audioTrack = localStreamRef.current?.getTracks().find((track) => track.kind === "audio");
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setMicOn(audioTrack.enabled);
    }
  };

  const toggleCamera = () => {
    const videoTrack = localStreamRef.current?.getTracks().find((track) => track.kind === "video");
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setCameraOn(videoTrack.enabled);
    }
  };

  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenTrack = screenStream.getVideoTracks()[0];
      const sender = peerRef.current?.getSenders().find((s) => s.track?.kind === "video");

      if (sender) {
        sender.replaceTrack(screenTrack);
        if (localVideo.current) {
          localVideo.current.srcObject = screenStream;
        }

        screenTrack.onended = () => {
          const videoTrack = localStreamRef.current?.getVideoTracks()[0];
          if (videoTrack && sender) {
            sender.replaceTrack(videoTrack);
          }
          if (localVideo.current && localStreamRef.current) {
            localVideo.current.srcObject = localStreamRef.current;
          }
        };
      }
    } catch (err) {
      console.log("Screen share error:", err);
    }
  };

  const sendMessage = () => {
    if (messageInput.trim() && socketRef.current) {
      const message = {
        text: messageInput,
        sender: username,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      socketRef.current.emit("chat-message", { roomId, message });
      setMessages(prev => [...prev, { ...message, isOwn: true }]);
      setMessageInput("");
    }
  };

  const endCall = () => {
    cleanup();
    window.location.href = "/";
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex overflow-hidden">
      
      {/* Sidebar */}
      <div className="w-72 bg-slate-950 border-r border-slate-700 flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold">ConferX</h1>
              <p className="text-xs text-slate-400">Video Conference</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center text-xl font-bold">
              {username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-semibold">{username}</h2>
              <p className="text-xs text-slate-400">Room: {roomId}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Participants ({isConnected ? '2' : '1'})
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-sm font-semibold relative">
                {username.charAt(0).toUpperCase()}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-slate-800 rounded-full"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">You</p>
                <p className="text-xs text-slate-400">Host</p>
              </div>
              {isMicOn ? (
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </div>
            
            {isConnected && (
              <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-sm font-semibold relative">
                  P
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-slate-800 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Participant</p>
                  <p className="text-xs text-slate-400">Guest</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-700 bg-slate-900">
          <div className="text-xs">
            <p className="text-slate-400 mb-1">Status:</p>
            <p className={`font-mono text-xs ${isConnected ? 'text-green-400' : 'text-yellow-400'}`}>
              {connectionStatus}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        
        {/* Top Bar */}
        <div className="h-16 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-6">
          <div>
            <h2 className="text-lg font-semibold">Meeting Room</h2>
            <p className="text-xs text-slate-400">{roomId}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500 bg-opacity-20 rounded-full">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-red-400">Live</span>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="h-full flex items-center justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full max-w-7xl">
              
              {/* Local Video */}
              <div className="relative">
                <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 h-full min-h-[400px]">
                  <video
                    ref={localVideo}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                    <p className="text-sm font-medium">You</p>
                  </div>
                </div>
              </div>

              {/* Remote Video */}
              <div className="relative">
                <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 h-full min-h-[400px] relative">
                  <video
                    ref={remoteVideo}
                    autoPlay
                    playsInline
                    muted={false}
                    className="w-full h-full object-cover"
                    style={{ display: hasRemoteStream ? 'block' : 'none' }}
                  />
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 backdrop-blur-sm px-3 py-1.5 rounded-lg z-10">
                    <p className="text-sm font-medium">Participant</p>
                  </div>
                  
                  {!hasRemoteStream && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-0">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg className="w-8 h-8 text-slate-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <p className="text-slate-400 text-sm">{connectionStatus}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Control Bar */}
        <div className="h-20 bg-slate-900 border-t border-slate-700 flex items-center justify-center">
          <div className="flex items-center gap-3">
            
            <button 
              onClick={toggleMic}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
                isMicOn ? 'bg-slate-700 hover:bg-slate-600' : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {isMicOn ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </button>

            <button 
              onClick={toggleCamera}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
                isCameraOn ? 'bg-slate-700 hover:bg-slate-600' : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {isCameraOn ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              )}
            </button>

            <button 
              onClick={startScreenShare}
              className="w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-all hover:scale-110"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>

            <div className="w-px h-8 bg-slate-700 mx-2"></div>

            <button 
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-all hover:scale-110 relative"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {messages.filter(m => !m.isOwn).length > 0 && !isChatOpen && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
                  {messages.filter(m => !m.isOwn).length}
                </div>
              )}
            </button>

            <div className="w-px h-8 bg-slate-700 mx-2"></div>

            <button 
              onClick={endCall}
              className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all hover:scale-110"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
              </svg>
            </button>

          </div>
        </div>

      </div>

      {/* Chat Panel */}
      {isChatOpen && (
        <div className="w-80 bg-slate-950 border-l border-slate-700 flex flex-col">
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <h3 className="font-semibold">Chat</h3>
            <button 
              onClick={() => setIsChatOpen(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-slate-400 text-sm mt-8">
                <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p>No messages yet</p>
                <p className="text-xs mt-1">Start a conversation!</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${msg.isOwn ? 'bg-blue-600' : 'bg-slate-800'} rounded-lg p-3`}>
                    <p className="text-xs font-semibold mb-1 opacity-80">{msg.sender}</p>
                    <p className="text-sm break-words">{msg.text}</p>
                    <p className="text-xs opacity-60 mt-1">{msg.timestamp}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-slate-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                disabled={!messageInput.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg px-4 py-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}