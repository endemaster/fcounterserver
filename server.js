const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let globalCount = 0;

io.on("connection", (socket) => {
  // hutrix is only three but this hopefully more lol
  socket.emit("countUpdate", globalCount);

  // upupup its our momentttt
  socket.on("increment", () => {
    globalCount++;
    io.emit("countUpdate", globalCount);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT);
