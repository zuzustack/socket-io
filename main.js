import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

let user = [];

io.of("/login").on("connection", (socket) => {
  console.log(socket.id);

  socket.on("login", (username) => {
    if (!user.find((e) => e.name == username)) {
      socket.emit("login", {
        id: socket.id,
        status: "Berhasil Login",
      });
      user.push({
        name: username,
        id: socket.id,
      });
    } else {
      socket.emit("login", {
        status: "Nama Sudah Dipakai",
      });
    }
  });
});

io.on("connection", (socket) => {
  const request = socket.handshake.query;

  socket.on(`roomId:${request.room}`, (data) => {
    console.log(data);
    socket.broadcast.emit(`roomId:${request.room}`, {
      username: data.username,
      message: data.message,
      timestamp: new Date(),
    });
  });

  socket.on("disconnect", () => {
    user.forEach((e, i) => {
      e.id === request.id ? user.splice(i, 1) : "";
    });

    console.log(user);
  });
});

httpServer.listen(3000);
console.log("has serve to http://localhost:3000");
