const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const path = require("path")

const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server);

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

let users = [];

io.on("connection", (socket) => {
  socket.on("username", (username) => {
    users.push(username);
    io.emit("user joined", { username, users });
  });

  socket.on("chat message", (data) => {
    socket.broadcast.emit("chat message", data);
  });

  socket.on("user left", (username) => {
    users.splice(users.indexOf(username), 1);
    socket.broadcast.emit("user left", { username, users });
  });
});

app.get("/", (req, res) => {
  res.render("index");
});

server.listen(3000, () => {
  console.log(`Listening http://localhost:3000`);
});
