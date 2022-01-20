const { readFileSync } = require("fs");
const { Server } = require("socket.io");
const rawip = require('ip');
const ip = rawip.address();
const bcrypt = require('bcrypt');
const path = require('path');
var bodyParser = require('body-parser');
const JSONdb = require('simple-json-db');
var fs = require('fs');

if (!fs.existsSync("./database")) {
  console.log("creating folder")
  fs.mkdirSync("./database")
}

if (!fs.existsSync("./database/user.json")) {
  console.log("creating folder")
  fs.appendFile("./database/user.json")
}

const user = new JSONdb('/database/user.json', { asyncWrite: true });

const io = new Server( {
  cors: {
    origin: `*`,
    methods: ["GET", "POST"],
    allowedHeaders: ['*'],
    credentials: true,
    extraHeaders: {
      "my-custom-header": "abcd"
    }
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
    io.emit("response", { error: false, msg: "try create user" })

    if (!user.has(data.userName)) {
      console.log("create user: ", data.userName)

      const salt = await bcrypt.genSalt()
      data.passwort = await bcrypt.hash(data.passwort, salt)

      user.set(data.userName, data)
      io.emit("response", { error: false, msg: "created user" })
    }
    else {
      console.log("User allrady exits")
      io.emit("response", { error: true, msg: "userexists" })
    }
  })

  socket.on("checkUser", async (data) => {
    io.emit("response", { error: false, msg: "Check Data" })
    if (user.has(data.userName)) {
      io.emit("response", { error: false, msg: "Check passwort" })
      const userdata = user.get(data.userName)

      if (await bcrypt.compare(data.passwort, userdata.passwort)) {
        io.emit("response", { error: false, msg: "Passwort is correct -> proceed" })
      }
      else {
        io.emit("response", { error: true, msg: "wrong passwort" })
      }
    }
    else {
      io.emit("response", { error: true, msg: "User not exits" })
    }
  });
})

io.listen(7080);
