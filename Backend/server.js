const http = require("http");
const app = require("./app");
const { Server } = require("socket.io");
const { initializeSocket } = require("./socket/socket");
const port = process.env.PORT || 3300;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Initialize socket handlers
initializeSocket(io);

// Start server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
