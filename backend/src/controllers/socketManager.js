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
    socket.on("join-room", async (roomId, username) => {
      if (!connections[roomId]) connections[roomId] = [];

      const isInitiator = connections[roomId].length === 0;

      const user = {
        socketId: socket.id,
        username: username || "User",
      };

      connections[roomId].push(user);
      socket.join(roomId);

      socket.roomId = roomId;
      socket.username = user.username;

      socket.emit("joined-room", { isInitiator });

      // Load previous chat messages
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

      // Notify others (NOT self)
      socket.to(roomId).emit("user-joined", {
        userId: socket.id,
        username: socket.username,
      });

      console.log(`📥 ${socket.id} joined room ${roomId}`);
    });

    // ---------------------------------------------------
    // CHAT
    // ---------------------------------------------------
    socket.on("chat-message", async ({ roomId, message }) => {
      const savedMessage = await Message.create({
        roomId,
        sender: message.sender,
        text: message.text,
        timestamp: new Date(),
      });

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
    });

    // ---------------------------------------------------
    // WEBRTC SIGNALING (SAFE)
    // ---------------------------------------------------

    socket.on("offer", ({ roomId, offer }) => {
      socket.to(roomId).emit("offer", {
        from: socket.id,
        offer,
      });
    });

    socket.on("answer", ({ roomId, answer, to }) => {
      io.to(to).emit("answer", {
        from: socket.id,
        answer,
      });
    });

    socket.on("ice-candidate", ({ roomId, candidate, to }) => {
      io.to(to).emit("ice-candidate", {
        from: socket.id,
        candidate,
      });
    });

    // ---------------------------------------------------
    // DISCONNECT
    // ---------------------------------------------------
    socket.on("disconnect", () => {
      const roomId = socket.roomId;

      if (roomId && connections[roomId]) {
        connections[roomId] = connections[roomId].filter(
          (u) => u.socketId !== socket.id
        );

        socket.to(roomId).emit("user-left", { userId: socket.id });

        if (connections[roomId].length === 0) {
          delete connections[roomId];
          console.log(`🗑️ Room ${roomId} cleaned`);
        }
      }

      console.log("❌ User disconnected:", socket.id);
    });
  });
};
