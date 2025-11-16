import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { socketManager } from "./src/controllers/socketManager.js";
import user_routes from "./src/routes/user_routes.js";

dotenv.config();

const app = express();
const server = createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

// Routes
app.get("/home", (req, res) => {
  res.send("Hi! Welcome to your Zoom project home page 🚀");
});

// ✅ Add this line to mount user routes
app.use("/api/users", user_routes);

// MongoDB connection
const mongoURI = process.env.MONGO_URL;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("🟢 MongoDB Connected Successfully"))
.catch((err) => console.error("🔴 MongoDB Connection Error:", err));

// Socket logic (delegated to controller)
socketManager(io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Backend is running 🏃‍♂️💨 on port 📍 ${PORT}`);
});
