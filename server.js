const express = require("express");
const http = require("http");
const fs = require("fs");
const path = require("path");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const messagesFile = path.join(__dirname, "messages.json");

app.use(express.static("public"));

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

io.on("connection", (socket) => {
    console.log("User connected");

    fs.readFile(messagesFile, "utf-8", (err, data) => {
        if (!err) {
            const messages = JSON.parse(data || "[]");
            socket.emit("loadMessages", messages);
        }
    });

    socket.on("newMessage", (msg) => {
        fs.readFile(messagesFile, "utf-8", (err, data) => {
            let messages = [];
            if (!err) {
                messages = JSON.parse(data || "[]");
            }

            messages.push(msg);
            fs.writeFile(messagesFile, JSON.stringify(messages), () => {
                io.emit("message", msg);
            });
        });
    });

    // Handle clear chat request
    socket.on("clearChat", () => {
      fs.writeFile(messagesFile, "[]", "utf8", (err) => {
          if (err) {
              console.error("Error clearing messages:", err);
              return;
          }
          console.log("Chat history cleared!");
          io.emit("chatCleared"); // Notify all clients
      });
  });
});

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
