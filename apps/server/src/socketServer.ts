      // Step 4: Countdown broadcast
      socket.on("start_countdown", async (roomId) => {
        // Countdown sequence
        for (let i = 3; i > 0; i--) {
          io.to(roomId).emit("countdown", i);
          await new Promise((res) => setTimeout(res, 1000));
        }
        io.to(roomId).emit("countdown", "Go!");
        // Optionally, emit start_match after countdown
        io.to(roomId).emit("start_match");
        console.log(`Countdown finished and match started in room ${roomId}`);
      });
    // Step 3: Start Match
    socket.on("start_match", (roomId) => {
      // Emit to all users in the room
      io.to(roomId).emit("start_match");
      console.log(`Match started in room ${roomId}`);
    });
  // Step 2: Join Room
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
    // Optionally, emit confirmation to the client
    socket.emit("room_joined", roomId);
  });
import { Server } from "socket.io";

const io = new Server(5001, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  // Step 1: Create Room
  socket.on("create_room", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} created and joined room ${roomId}`);
    // Optionally, emit confirmation to the client
    socket.emit("room_created", roomId);
  });
});
