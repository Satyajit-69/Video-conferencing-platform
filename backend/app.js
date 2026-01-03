import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";

import { socketManager } from "./src/controllers/socketManager.js";
import user_routes from "./src/routes/user_routes.js";
import vector_routes from "./src/routes/vector_routes.js";
import assistantRoutes from "./src/routes/assistant_routes.js";


const app = express();
const server = createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://video-conferencing-platform-nine.vercel.app",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"], // 🔥 REQUIRED
  })
);

app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

// Test route
app.get("/home", (req, res) => {
  res.send("Hi! Welcome to your Zoom project home page 🚀");
});

// Routes
app.use("/api/users", user_routes);
app.use("/api/vector", vector_routes);
app.use("/api/assistant", assistantRoutes);
// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("🟢 MongoDB Connected Successfully"))
  .catch((err) => console.error("🔴 MongoDB Connection Error:", err));

// Socket logic
socketManager(io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Backend is running on port ${PORT}`);
});
