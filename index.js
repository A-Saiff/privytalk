const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server);

app.use(express.static("public"));

let users = [];

io.on("connection", (socket) => {
  socket.on("username", (username) => {
    users.push(username);
    socket.username = username;
    io.emit("user joined", { username, users });
  });

  socket.on("chat message", (data) => {
    socket.broadcast.emit("chat message", data);
  });

  socket.on("disconnect", () => {
    if (socket.username) {
      users.splice(users.indexOf(socket.username), 1);
      io.emit("user left", { username: socket.username, users });
    }
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

server.listen(3000, () => {
  console.log(`Listening http://localhost:3000`);
});
