// controllers/socketManager.js

// Store which users are in which room
let connections = {};   // { roomId: [socketIds] }

// Store messages room-wise
let messages = {};      // { roomId: [{ sender, message, time }] }

export const socketManager = (io) => {
  
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // =============================
    // JOIN ROOM
    // =============================
    socket.on("join-room", (roomId) => {

      // Save connection
      if (!connections[roomId]) connections[roomId] = [];
      connections[roomId].push(socket.id);

      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);

      // Send chat history to the new user
      socket.emit("previous-messages", messages[roomId] || []);

      // Notify others
      socket.to(roomId).emit("user-joined", socket.id);
    });

    // =============================
    // CHAT MESSAGE TRACKING
    // =============================
    socket.on("chat-message", (data, sender) => {

      // STEP 1 → find which room this socket belongs to
      const [matchingRoom, found] = Object.entries(connections).reduce(
        ([room, isFound], [roomKey, roomValue]) => {

          if (!isFound && roomValue.includes(socket.id)) {
            return [roomKey, true];
          }

          return [room, isFound];
        },
        ["", false]
      );

      // If room found
      if (found === true) {

        // If no previous messages exist → create empty array
        if (messages[matchingRoom] === undefined) {
          messages[matchingRoom] = [];
        }

        // Push new message with time
        const msg = {
          sender,
          data,
          time: Date.now()
        };

        messages[matchingRoom].push(msg);

        // Broadcast message to others
        socket.to(matchingRoom).emit("receive-message", msg);
      }
    });

    // =============================
    // WEBRTC SIGNALS
    // =============================
    socket.on("offer", ({ roomId, offer }) => {
      socket.to(roomId).emit("offer", { sender: socket.id, offer });
    });

    socket.on("answer", ({ roomId, answer }) => {
      socket.to(roomId).emit("answer", { sender: socket.id, answer });
    });

    socket.on("ice-candidate", ({ roomId, candidate }) => {
      socket.to(roomId).emit("ice-candidate", { sender: socket.id, candidate });
    });

    // =============================
    // DISCONNECT
    // =============================
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      // Remove user from all rooms
      for (let room in connections) {
        connections[room] = connections[room].filter(id => id !== socket.id);
      }
    });

  });
};
