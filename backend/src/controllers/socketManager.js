// controllers/socketManager.js

import Message from "../models/message.js";

// roomId -> [{ socketId, username }]
let connections = {};

export const socketManager = (io) => {
  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

    // ---------------------------------------------------
    // JOIN ROOM
    // ---------------------------------------------------
    socket.on("join-room", async (roomId) => {
      console.log(`📥 Join room request: ${roomId} from ${socket.id}`);
      
      if (!connections[roomId]) {
        connections[roomId] = [];
      }

      const isInitiator = connections[roomId].length === 0;

      const user = {
        socketId: socket.id,
        username: "User", // You can pass this from frontend if needed
      };

      connections[roomId].push(user);
      socket.join(roomId);

      // Store roomId in socket for later use
      socket.roomId = roomId;
      socket.username = user.username;

      // Tell the user if they're the initiator
      socket.emit("joined-room", { isInitiator });
      console.log(`✅ ${socket.id} joined room ${roomId} (Initiator: ${isInitiator})`);

      // Load previous chat messages
      try {
        const previousMessages = await Message.find({ roomId }).sort({
          timestamp: 1,
        });

        socket.emit(
          "previous-messages",
          previousMessages.map((msg) => ({
            text: msg.text,
            sender: msg.sender,
            timestamp: msg.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }))
        );
        console.log(`📚 Sent ${previousMessages.length} previous messages to ${socket.id}`);
      } catch (err) {
        console.error("❌ Error loading messages:", err);
      }

      // Notify others in the room (NOT self)
      socket.to(roomId).emit("user-joined", {
        userId: socket.id,
        username: socket.username,
      });
      console.log(`📢 Notified room ${roomId} about new user ${socket.id}`);
    });

    // ---------------------------------------------------
    // CHAT MESSAGES
    // ---------------------------------------------------
    socket.on("chat-message", async ({ roomId, message }) => {
      console.log(`💬 Chat message in ${roomId} from ${socket.id}:`, message.text);
      
      try {
        const savedMessage = await Message.create({
          roomId,
          sender: message.sender,
          text: message.text,
          timestamp: new Date(),
        });

        // Broadcast to others in the room (NOT self)
        socket.to(roomId).emit("chat-message", {
          message: {
            text: savedMessage.text,
            sender: savedMessage.sender,
            timestamp: savedMessage.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        });
        console.log(`✅ Message saved and broadcast to room ${roomId}`);
      } catch (err) {
        console.error("❌ Error saving message:", err);
      }
    });

    // ---------------------------------------------------
    // WEBRTC SIGNALING - FIXED
    // ---------------------------------------------------

    socket.on("offer", ({ roomId, offer }) => {
      console.log(`📤 Received offer from ${socket.id} for room ${roomId}`);
      console.log(`   Offer type: ${offer.type}, SDP length: ${offer.sdp?.length || 0}`);
      
      // Broadcast offer to all others in the room
      socket.to(roomId).emit("offer", {
        userId: socket.id,  // ✅ Frontend expects 'userId'
        offer,
      });
      console.log(`✅ Offer forwarded to room ${roomId}`);
    });

    socket.on("answer", ({ roomId, answer }) => {
      console.log(`📤 Received answer from ${socket.id} for room ${roomId}`);
      console.log(`   Answer type: ${answer.type}, SDP length: ${answer.sdp?.length || 0}`);
      
      // Broadcast answer to all others in the room
      socket.to(roomId).emit("answer", {
        userId: socket.id,  // ✅ Frontend expects 'userId'
        answer,
      });
      console.log(`✅ Answer forwarded to room ${roomId}`);
    });

    socket.on("ice-candidate", ({ roomId, candidate }) => {
      console.log(`🧊 Received ICE candidate from ${socket.id} for room ${roomId}`);
      console.log(`   Candidate: ${candidate.candidate?.substring(0, 50)}...`);
      
      // Broadcast ICE candidate to all others in the room
      socket.to(roomId).emit("ice-candidate", {
        userId: socket.id,  // ✅ Frontend expects 'userId'
        candidate,
      });
      console.log(`✅ ICE candidate forwarded to room ${roomId}`);
    });

    // ---------------------------------------------------
    // DISCONNECT
    // ---------------------------------------------------
    socket.on("disconnect", () => {
      console.log(`❌ User disconnecting: ${socket.id}`);
      
      const roomId = socket.roomId;

      if (roomId && connections[roomId]) {
        // Remove user from connections
        connections[roomId] = connections[roomId].filter(
          (u) => u.socketId !== socket.id
        );

        // Notify others in the room
        socket.to(roomId).emit("user-left", { 
          userId: socket.id 
        });
        console.log(`📢 Notified room ${roomId} that ${socket.id} left`);

        // Clean up empty rooms
        if (connections[roomId].length === 0) {
          delete connections[roomId];
          console.log(`🗑️ Room ${roomId} is now empty and cleaned up`);
        } else {
          console.log(`👥 Room ${roomId} still has ${connections[roomId].length} user(s)`);
        }
      }

      console.log(`✅ User ${socket.id} disconnected and cleaned up`);
    });

    // ---------------------------------------------------
    // ERROR HANDLING
    // ---------------------------------------------------
    socket.on("error", (error) => {
      console.error(`❌ Socket error from ${socket.id}:`, error);
    });
  });

  // ---------------------------------------------------
  // SERVER-LEVEL ERROR HANDLING
  // ---------------------------------------------------
  io.on("error", (error) => {
    console.error("❌ Socket.IO server error:", error);
  });

  console.log("✅ Socket.IO server initialized");
};