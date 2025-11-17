📹 ConferX – Video Conferencing Platform (Zoom Clone)

A modern, full-stack Zoom Clone built using React, Tailwind, Node.js, Express, MongoDB, WebRTC & Socket.io.
Real-time video meetings, secure authentication, and a smooth, beautiful UI.

🚀 Features
🔐 Authentication

User Login & Signup

Secure JWT Authentication

Protected Routes

Password Hashing

📹 Video Conferencing

Create Meetings

Join Meetings via Code

Real-time Video & Audio (WebRTC)

Multiple Participants

Mute / Unmute

Dynamic Video Layout

Auto Participant Handling

💬 Meeting Features

Real-time Chat (Socket.io)

Raise Hand (coming soon)

Screen Sharing (coming soon)

Meeting Recording (future upgrade)

🎨 UI / UX

Modern, glassmorphism UI

Smooth animations (Framer Motion)

Clean dashboard

Responsive design

🧩 Tech Stack
Frontend

React.js

Tailwind CSS

Framer Motion

React Router

Vite

Backend

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

Socket.io (real-time)

WebRTC (peer-to-peer video)

📁 Project Structure
conferx/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── config/
│   └── package.json
│
└── README.md

⚙️ Setup Instructions
🖥️ Frontend Setup
cd frontend
npm install
npm run dev

🛠️ Backend Setup

Create a .env file in /backend:

MONGO_URI=your_mongo_url
JWT_SECRET=your_jwt_secret


Run backend:

cd backend
npm install
npm run dev

🔒 Environment Variables

Your .env file (not pushed to GitHub) must contain:

MONGO_URI=
JWT_SECRET=
PORT=5000

🛠️ API Routes Overview
● Auth Routes

POST /api/auth/register

POST /api/auth/login

● Meeting Routes

POST /api/meetings/create

GET /api/meetings/:id

● Socket Events

join-room

user-connected

user-disconnected

message

📌 Todo Roadmap

 Landing Page

 Login Page

 Register Page

 Backend authentication

 Meeting dashboard

 WebRTC setup

 Chat system

 Screen share

 Deployment

🖼️ Screenshots (Add later)

(Place your UI screenshots here once ready)

🤝 Contributing

Pull requests are welcome.

📄 License

MIT License © 2025 Satyajit

🌟 Star ⭐ this repo if you find it useful!# Video-conferencing-platform
A full-stack Zoom Clone with video conferencing, authentication, meetings, and real-time communication.
