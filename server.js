const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");

const app = express();
const server = http.createServer(app);

// netlify frontend
const io = new Server(server, {
  cors: {
    origin: "https://spamyourfkey.com"
  }
});

const file = "count.json";
let count = 0;

// check count
if (fs.existsSync(file)) {
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf-8"));
    if (typeof data.count === "number") {
      count = data.count;
    }
  } catch (err) {
    console.error("Error reading count.json:", err);
  }
}

// save count
function saveCount() {
  fs.writeFileSync(file, JSON.stringify({ count }));
}

// socket.io connections
io.on("connection", (socket) => {
  console.log("a user connected");

  // sent count
  socket.emit("countUpdate", count);

  // f
  socket.on("increment", () => {
    count++;
    saveCount(); // persist to file
    io.emit("countUpdate", count); // broadcast to all
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});

// bind to 0.0.0.0
const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
