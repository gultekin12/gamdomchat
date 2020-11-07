const express = require("express");
const socket = require("socket.io");
var messages ={meshistory: []  };

// App setup
const PORT = 8080;
const app = express();
const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

// Static files
app.use(express.static("public"));


// Socket setup
const io = socket(server);

const activeUsers = new Set();

io.on("connection", function (socket) {
  console.log("Made socket connection");
  io.emit("old messages", messages);
  

  socket.on("new user", function (data) {
    socket.userId = data;
    activeUsers.add(data);
    io.emit("new user", [...activeUsers]);



          

  });


  socket.on("disconnect", () => {
    activeUsers.delete(socket.userId);
    io.emit("user disconnected", socket.userId);
  });


  socket.on("chat message", function (data) {
    io.emit("chat message", data);
 messages.meshistory.push(data); 
 console.log(messages.meshistory);
  });
  
  socket.on("typing", function (data) {
    socket.broadcast.emit("typing", data);
    console.log(data.nick + " is typing!")
  });
});