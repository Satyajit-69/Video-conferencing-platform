// controllers/socketManager.js

let connections = {};   // roomId → [socketIds]
let messages = {};      // roomId → [ { sender, text, timestamp } ]

export const socketManager = (io) => {

  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

    // JOIN ROOM
    socket.on("join-room", (roomId, username) => {
      console.log(`📥 User ${socket.id} joining: ${roomId}`);

      if (!connections[roomId]) connections[roomId] = [];
      if (!messages[roomId]) messages[roomId] = [];

      const isInitiator = connections[roomId].length === 0;

      connections[roomId].push(socket.id);
      socket.join(roomId);

      socket.roomId = roomId;
      socket.username = username || "User";

      socket.emit("joined-room", { isInitiator });

      socket.emit("previous-messages", messages[roomId]);

      if (!isInitiator) {
        socket.to(roomId).emit("user-joined", {
          userId: socket.id,
          username: socket.username,
        });
      }
    });

    // ==========================================
    // CHAT MESSAGE — FIXED FOR YOUR FRONTEND
    // ==========================================

    socket.on("chat-message", ({ roomId, message }) => {
      console.log("💬 Chat message received:", message);

      if (!messages[roomId]) messages[roomId] = [];

      // Store
      messages[roomId].push(message);

      // Send to others
      socket.to(roomId).emit("chat-message", {
        message
      });
    });

    // ==========================================
    // WEBRTC SIGNALS
    // ==========================================
    socket.on("offer", ({ roomId, offer }) => {
      socket.to(roomId).emit("offer", { userId: socket.id, offer });
    });

    socket.on("answer", ({ roomId, answer }) => {
      socket.to(roomId).emit("answer", { userId: socket.id, answer });
    });

    socket.on("ice-candidate", ({ roomId, candidate }) => {
      socket.to(roomId).emit("ice-candidate", { userId: socket.id, candidate });
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      const room = socket.roomId;

      if (room && connections[room]) {
        socket.to(room).emit("user-left", { userId: socket.id });

        connections[room] = connections[room].filter(id => id !== socket.id);

        if (connections[room].length === 0) {
          delete connections[room];
          delete messages[room];

          console.log(`🗑️ Cleaned empty room: ${room}`);
        }
      }
    });

  });
};
