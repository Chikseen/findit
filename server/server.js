const { readFileSync } = require("fs");
const { createServer } = require("https");
const { Server } = require("socket.io");
const rawip = require('ip');
const ip = rawip.address()
const bcrypt = require('bcrypt')
const path = require('path');
var bodyParser = require('body-parser')
const JSONdb = require('simple-json-db');

const user = new JSONdb('/var/lib/docker/volumes/findit_database/user.json', { asyncWrite: true });

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
  socket.on("newNumber", () => {

    console.log("New Number will be Generaed")
    const n = Math.floor(Math.random() * 9999999)
    console.log("number: ", n)

    io.emit("Number", { number: n })
  })

  socket.on("createUser", async (data) => {

    if (!user.has(data.userName)) {
      console.log("create user: ", data.userName)
      
      const salt = await bcrypt.genSalt()
      data.passwort = await bcrypt.hash(data.passwort, salt)
    
      user.set(data.userName, data)
    }
    else {
      console.log("User allrady exits")
      socket.emit("response", { error: true, msg: "userexists" })
    }
  })
});


httpServer.listen(7080);