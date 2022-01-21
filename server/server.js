const { readFileSync } = require("fs");
const { Server } = require("socket.io");
const bcrypt = require('bcrypt');
const JSONdb = require('simple-json-db');
var fs = require('fs');

// "" for Docker Buiuld
//"." for DevBuild
let pathPreFix = ""
if (fs.existsSync("../localDebug.js")) {
  pathPreFix = "."
}


// UNUSED
/* const path = require('path');
const rawip = require('ip');
var bodyParser = require('body-parser');
const ip = rawip.address(); */

//Init Data
if (!fs.existsSync(pathPreFix + "/database")) {
  console.log("creating folder")
  fs.mkdirSync(pathPreFix + "/database")
}

if (!fs.existsSync(pathPreFix + "/database/user.json")) {
  console.log("creating folder")
  fs.appendFile(pathPreFix + "/database/user.json")
}

const user = new JSONdb(pathPreFix + '/database/user.json', { asyncWrite: true });

const io = new Server({
  cors: {
    origin: `*`,
    methods: ["GET", "POST"],
    allowedHeaders: ['*'], //Add sth
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
    io.emit("response", { error: null, msg: "try create user" })

    if (!user.has(data.userName)) {
      console.log("create user: ", data.userName)

      const salt = await bcrypt.genSalt()
      data.passwort = await bcrypt.hash(data.passwort, salt)

      user.set(data.userName, data)
      io.emit("response", { error: null, msg: "created user" })
    }
    else {
      console.log("User allrady exits")
      io.emit("response", { error: true, msg: "userexists" })
    }
  })

  socket.on("validateLogin", async (data) => {
    console.log("Check Data")
    socket.emit("response", { isError: false, errormsg: "", msg: "Check Data" })

    //validate userdate
    if (user.has(data.userName)) {
      const userdata = user.get(data.userName)

      if (await bcrypt.compare(data.passwort, userdata.passwort)) {
        socket.emit("response", { isError: false, errormsg: "", msg: "Passwort is correct -> proceed" })
        socket.emit("userDataValidated", { hereisYouruserdata: "tetetehihihihihihi"})
      }
      else {
        socket.emit("response", { isError: true, errormsg: "wrongUserdata", msg: "Wrong username or passwort" })
      }
    }
    else {
      socket.emit("response", { isError: true, errormsg: "wrongUserdata", msg: "Wrong username or passwort" })
    }
  });

  socket.on("createAccount", async (data) => {
    console.log("Create user")
    socket.emit("response", { isError: false, errormsg: "", msg: "Validate Input" })
    if (data.userName.length < 8) {
      console.log("userName to short")
      socket.emit("response", { isError: true, errormsg: "usernameToShort", msg: "Your username needs to be at least 8 characters long" })
    }
    else if (data.passwort.length < 8) {
      console.log("passwort to short")
      socket.emit("response", { isError: true, errormsg: "passwortToShort", msg: "Your passwort needs to be at least 8 characters long" })
    }
    else if (data.passwort != data.repeatPasswort) {
      console.log("passwort is not the same")
      socket.emit("response", { isError: true, errormsg: "passwortNotSame", msg: "You have diffrent passworts" })
    }
    else {
      try {
        console.log("Validation correct")
        socket.emit("response", { isError: false, errormsg: "", msg: "Validation correct" })
        if (!user.has(data.userName)) {
          console.log("create user: ", data.userName)

          const salt = await bcrypt.genSalt()
          data.passwort = await bcrypt.hash(data.passwort, salt)

          user.set(data.userName, data)
          socket.emit("response", { isError: false, errormsg: "", msg: "User created successfully" })
        }
        else {
          console.log("User allrady exits")
          socket.emit("response", { isError: true, errormsg: "userExits", msg: "The username allrady exits" })
        }
      } catch (e) {
        socket.emit("response", { isError: true, errormsg: "unexpected", msg: "Something unexepted happend" })
      }
    }
  });
})

io.listen(7080);
