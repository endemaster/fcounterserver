// zesty ahh code
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs"); // used in singleplayer mode, but not used anywhere here

const app = express();
const server = http.createServer(app);

// netlify frontend
const io = new Server(server, {
  cors: {
    origin: "https://spamyourfkey.com"
  }
});

const { Pool } = require("pg"); // add at top with your other requires

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

let count = 0;

// counter
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS counter (
        id SERIAL PRIMARY KEY,
        count INT DEFAULT 0
      )
    `);

      const res = await pool.query(`
      INSERT INTO counter(id, count) VALUES (1, 0)
      ON CONFLICT (id) DO NOTHING
      RETURNING count
    `);
    if (res.rows[0]) {
      count = res.rows[0].count;
    } else {
      const { rows } = await pool.query("SELECT count FROM counter WHERE id = 1");
      count = rows[0].count;
    }


    console.log("Current count:", count);
  } catch (err) {
    console.error("error:", err);
  }
})();



// socket.io connections
io.on("connection", (socket) => {
  console.log("a user connected");

  // sent count
  socket.emit("countUpdate", count);

  // socket.onnnnnnn
socket.on("increment", async () => {
  const res = await pool.query("SELECT count, click_value FROM counter WHERE id = 1");
  const { count: currentCount, click_value } = res.rows[0];
  const newCount = currentCount + click_value;

  await pool.query("UPDATE counter SET count = $1 WHERE id = 1", [newCount]);
  io.emit("countUpdate", newCount);
});

  } catch (err) {
    console.error("error:", err);
  }
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
