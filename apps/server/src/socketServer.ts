import { Server } from "socket.io";

const io = new Server(5001, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("User connected", socket.id);
});
