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
    origin: `https://${ip}:8080`,
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


io.on("disconnect", (socket) => {
  console.log("client disconnect")
});


io.engine.on("connection_error", (err) => {
  console.log(err.req);      // the request object
  console.log(err.code);     // the error code, for example 1
  console.log(err.message);  // the error message, for example "Session ID unknown"
  console.log(err.context);  // some additional error context
});

httpServer.listen(7080);