import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors : {
    origin: "*",
  }
});

io.on("connection", (socket) => {
  const request =  socket.handshake.query

  socket.on(`roomId:${request.room}`, (data) => {
    console.log(data);
    socket.broadcast.emit(`roomId:${request.room}`, data);
  })

});

httpServer.listen(3000);
console.log("has serve to http://localhost:3000");