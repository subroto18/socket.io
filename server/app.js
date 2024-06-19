import http from "http";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";
const app = express();

const server = http.createServer(app);
// Use CORS middleware with default options (allows all origins)
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("user connected");
  socket.on("message", ({ message, room }) => {
    io.to(room).emit("receive-message", message);
  });

  socket.on("join-room", (room) => {
    console.log("join room", room);
    socket.join(room);
  });
  socket.on("disconnect", () => {});
});

app.get("/", (req, res) => {
  try {
    // Code that might throw an error

    res.send({
      message: "Welcome",
    });
  } catch (error) {
    // Handle the error
    res.status(500).send("Internal Server Error");
  }
});

// 404 Middleware to handle undefined routes
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

server.listen(3000, () => {
  console.log("Server is running port:", 3000);
});
