const { readFileSync } = require("fs");
const { Server } = require("socket.io");
const bcrypt = require("bcrypt");
const JSONdb = require("simple-json-db");
const fs = require("fs");
const path = require("path");
const loginValidation = require("./serverHandler/loginValidation");
const projectClusterData = require("./serverHandler/projectClusterData");
const databaseIntegrity = require("./serverHandler/databaseIntegrity");

let pathPreFix = "";
if (fs.existsSync("../localDebug.js")) {
  pathPreFix = ".";
}

databaseIntegrity.init(fs, pathPreFix);
databaseIntegrity.checkProjectCluster(fs, pathPreFix);

const user = new JSONdb(pathPreFix + "/database/user.json", {
  asyncWrite: true,
});
const projectCluster = new JSONdb(
  pathPreFix + "/database/projectCluster.json",
  { asyncWrite: true }
);

const io = new Server({
  cors: {
    origin: `*`,
    methods: ["GET", "POST"],
    allowedHeaders: ["*"], //Add sth
  },
});

let sessionIds = [];

io.on("connection", (socket) => {
  //CREATEUSER
  socket.on("createAccount", async (data) => {
    socket.emit(
      "response",
      await loginValidation.createUser(bcrypt, user, data)
    );
  });

  //VALIDATEUSER
  socket.on("validateLogin", async (data) => {
    const outPut = await loginValidation.validateLogin(bcrypt, user, data);
    socket.emit("response", outPut);
    if (outPut.msg === "Passwort is correct -> proceed") {
      const newSID = Math.floor(Math.random() * 999999999999);
      sessionIds.push(newSID);
      socket.emit("userDataValidated", { sessionID: newSID });
    }
  });

  //CHECKSESSION
  socket.on("checkSID", async (data) => {
    if (sessionIds.includes(parseInt(data.SID))) {
      socket.emit("respSID", { status: "valid" });
    } else {
      socket.emit("respSID", { status: "unvalid" });
    }
  });

  //DESTROYSESSION
  socket.on("destroySession", async (data) => {
    const index = sessionIds.indexOf(data.SID);
    if (index > -1) {
      sessionIds.splice(index, 1);
    }
  });

  //REQUESTUSERDATA
  socket.on("requestProjectData", async (data) => {
    socket.emit(
      "getProjectData",
      await projectClusterData.getData(projectCluster, user, data.userName)
    );
  });

  //REQUESTUSERDATA
  socket.on("createProject", async (data) => {
    socket.emit(
      "projectData",
      projectClusterData.createProject(projectCluster, JSONdb, fs, pathPreFix, data.owner)
    );
  });
  socket.on("getProject", async (data) => {
    socket.emit(
      "projectData",
      projectClusterData.getProject(projectCluster, JSONdb, fs, pathPreFix, data.projectID)
    );
  });
});

io.listen(7080);
