const { readFileSync } = require("fs");
const { createServer } = require("https");
const { Server } = require("socket.io");
const rawip = require('ip');
const ip = rawip.address()

const httpServer = createServer({
  key: readFileSync('cert.key'),
  cert: readFileSync('cert.crt'),
});

const io = new Server(httpServer, {
  cors: {
    origin: `*`,
    methods: ["GET", "POST"],
    allowedHeaders: '*'
  }
});
io.on("connection", (socket) => {
  io.emit("hello", "New User");

  socket.on("newNumber", () => {

    console.log("New Number will be Generaed")
    const n = Math.floor(Math.random() * 9999999)
    console.log("number: ", n)

    io.emit("Number", { number: n })
  })
});

httpServer.listen(7080);