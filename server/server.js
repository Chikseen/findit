require("dotenv").config();

const { Server } = require("socket.io");
const JSONdb = require("simple-json-db");
const fs = require("fs");
const express = require("express");
const cors = require("cors");

const projectClusterData = require("./serverHandler/projectClusterData");
const databaseIntegrity = require("./serverHandler/databaseIntegrity");
const projcthandler = require("./serverHandler/projectHandler");
const auth = require("./serverHandler/authHandler");
const projectHandler = require("./serverHandler/projectHandler");

let pathPreFix;
let authCall;

if (process.env.NODE_ENV === "development") {
  console.log("server is running in Dev mode");
  authCall = "http://192.168.2.100:6080/";
  pathPreFix = ".";
} else {
  authCall = "https://auth.drunc.net/";
  pathPreFix = "";
}

// DATAINIT
databaseIntegrity.init(fs, pathPreFix);
//databaseIntegrity.checkProjectCluster(fs, pathPreFix);

const io = new Server({
  cors: {
    origin: `*`,
    methods: ["GET", "POST"],
    allowedHeaders: ["*"], //Add sth
  },
});

// EXPRESS SETUP
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 7081;
app.listen(port, () => console.log("Connecet with Port: " + port));

app.get("/", (req, res) => {
  res.json({ status: "success" });
});

let userBinds = {};
let userInProj = {};

app.post("/home/projectData/metaData", async (request, response) => {
  const projectCluster = new JSONdb(pathPreFix + "/database/projectCluster.json");
  console.log("get Project Meta Data for ", request.body);
  console.log("storage keys", projectCluster.has(request.body.user));
  if (!projectCluster.has(request.body.user)) {
    console.log("Create Projectcluster for user");
    projectCluster.set(request.body.user, {
      ownProjects: [],
      sharedByProjects: [],
      sharedWithProjects: [],
    });
  }
  if (await auth.checkUser(authCall, "session/checkUser", request.body)) {
    response.json(await projectClusterData.getData(JSONdb, pathPreFix, request.body.user));
  } else {
    response.json({ status: "validation Error", msg: "validation Error" });
  }
});

app.post("/home/projectData/bindUserConnection", async (request, response) => {
  const userName = request.body.userName;
  Object.assign(userBinds, {
    [userName]: { socketID: request.body.socketID, name: userName },
  });
  console.log("User bindigs", userBinds);
  response.end();
});

app.post("/projects/getID", async (request, response) => {
  const projectCluster = new JSONdb(pathPreFix + "/database/projectCluster.json");
  console.log("load Project", request.body);
  if (await auth.checkUser(authCall, "session/checkUser", request.body)) {
    if (request.body.projectID == "-1") {
      console.log("check loading permissons");
      response.json(await projectClusterData.createProject(JSONdb, fs, pathPreFix, request.body.user));
    } else {
      console.log("load Proj");
      response.json(await projectClusterData.getProjectMeta(JSONdb, pathPreFix, request.body.projectID));
    }
  } else {
    response.json({ status: "validation Error", msg: "validation Error" });
  }
  response.end();
});

app.post("/projects/delete", async (request, response) => {
  if (checkUserPermissions(request.body.user, request.body.projectID) >= 4) {
    const projectCluster = new JSONdb(pathPreFix + "/database/projectCluster.json");
    console.log("delete Project", request.body);
    response.json(await projectClusterData.deleteProject(JSONdb, fs, pathPreFix, request.body));
  } else
    response.json({
      isError: true,
      succes: false,
      errormsg: "permissionerror",
      msg: "Only user with level 4 access or higher are able to make this operation",
    });
});

app.post("/projects/load", async (request, response) => {
  const projectCluster = new JSONdb(pathPreFix + "/database/projectCluster.json");
  console.log("load Project", request.body);
  //Validate if user can load thisProject here !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  if (checkUserPermissions(request.body.user, request.body.projectID) >= 0) {
    response.json(await projectClusterData.getProject(JSONdb, pathPreFix, request.body.projectID));
  } else
    response.json({
      isError: true,
      succes: false,
      errormsg: "loadingerror",
      msg: "You either have no permisons for this project or this project dosent exits!",
    });
});

app.post("/projects/sendInvite", async (request, response) => {
  if (checkUserPermissions(request.body.shareBy, request.body.projectID) >= 3) {
    const projectCluster = new JSONdb(pathPreFix + "/database/projectCluster.json");
    response.json(await projectClusterData.sendInvite(JSONdb, fs, pathPreFix, request.body, authCall, io, userBinds));
    sendUserData(request.body.projectID);
  } else {
    response.json({
      isError: true,
      succes: false,
      errormsg: "permissionerror",
      msg: "Only user with level 3 access or higher are able to make this operation",
    });
  }
});

app.post("/projects/changeAccess", async (request, response) => {
  if (checkUserPermissions(request.body.user, request.body.projectID) >= 3) {
    const projectCluster = new JSONdb(pathPreFix + "/database/projectCluster.json");
    response.json(await projectClusterData.changeAccess(JSONdb, fs, pathPreFix, request.body, authCall, io, userBinds));
    sendUserData(request.body.projectID);
  } else {
    response.json({
      isError: true,
      succes: false,
      errormsg: "permissionerror",
      msg: "Only user with level 3 access or higher are able to make this operation",
    });
  }
});

app.post("/projects/addElement", async (request, response) => {
  if (checkUserPermissions(request.body.user, request.body.projectID) >= 2) {
    response.json(await projcthandler.addElement(JSONdb, pathPreFix, request.body));
    sendNewDataToWatcher(request.body.projectID);
  } else
    response.json({
      isError: true,
      succes: false,
      errormsg: "permissionerror",
      msg: "Only user with level 2 access or higher are able to make this operation",
    });
});

app.post("/projects/removeElement", async (request, response) => {
  if (checkUserPermissions(request.body.user, request.body.projectID) >= 2) {
    response.json(await projcthandler.removeElement(JSONdb, pathPreFix, request.body));
    sendNewDataToWatcher(request.body.projectID);
  } else
    response.json({
      isError: true,
      succes: false,
      errormsg: "permissionerror",
      msg: "Only user with level 2 access or higher are able to make this operation",
    });
});

app.post("/projects/setNewName", async (request, response) => {
  if (checkUserPermissions(request.body.user, request.body.projectID) >= 2) {
    const proj = new JSONdb(pathPreFix + "/database/projects/" + request.body.projectID + ".json");
    proj.set("name", request.body.name);
    console.log("set new Name", request.body.name);
    response.json({ name: proj.get("name") });
    sendUserData(request.body.projectID);
  } else
    response.json({
      isError: true,
      succes: false,
      errormsg: "permissionerror",
      msg: "Only user with level 2 access or higher are able to make this operation",
    });
});

app.post("/projects/adduserInProj", async (request, response) => {
  console.log("add user as watcher", request.body);
  if (userInProj[request.body.projectID] == undefined) userInProj[request.body.projectID] = [];
  userInProj[request.body.projectID].push(request.body.socketID);
  console.log("userInProj", userInProj);
  sendUserData(request.body.projectID);
  response.end();
});

app.post("/projects/changePosition", async (request, response) => {
  if (checkUserPermissions(request.body.user, request.body.projectID) >= 2) {
    try {
      console.log("change posisiotn of: ", request.body);
      const proj = new JSONdb(pathPreFix + "/database/projects/" + request.body.projectID + ".json");
      const data = proj.get("main");
      data.pcr[request.body.element].position = request.body.position;
      proj.set("main", data);
      response.json(await projcthandler.getMain(JSONdb, pathPreFix, request.body.projectID));
      sendNewDataToWatcher(request.body.projectID);
    } catch (error) {
      response.json({
        isError: true,
        succes: false,
        errormsg: "sthwentwrong",
        msg: "Something went Wrong",
      });
    }
  } else
    response.json({
      isError: true,
      succes: false,
      errormsg: "permissionerror",
      msg: "Only user with level 2 access or higher are able to make this operation",
    });
});
app.post("/projects/changeScale", async (request, response) => {
  if (checkUserPermissions(request.body.user, request.body.projectID) >= 2) {
    try {
      console.log("change scale of: ", request.body);
      const proj = new JSONdb(pathPreFix + "/database/projects/" + request.body.projectID + ".json");
      const data = proj.get("main");
      data.pcr[request.body.element].scale = request.body.scale;
      proj.set("main", data);
      response.json(await projcthandler.getMain(JSONdb, pathPreFix, request.body.projectID));
      sendNewDataToWatcher(request.body.projectID);
    } catch (error) {
      response.json({
        isError: true,
        succes: false,
        errormsg: "sthwentwrong",
        msg: "Something went Wrong",
      });
    }
  } else
    response.json({
      isError: true,
      succes: false,
      errormsg: "permissionerror",
      msg: "Only user with level 2 access or higher are able to make this operation",
    });
});

app.post("/projects/removeuserInProj", async (request, response) => {
  console.log("remove user as watcher", request.body);
  userInProj[request.body.projectID].splice(userInProj[request.body.projectID].indexOf(request.body.socketID), 2);
  sendUserData(request.body.projectID);
  response.end();
});

//_____________________________________________________________________________________________________________________
// SOCKET
io.on("connection", (socket) => {
  console.log("CONNECTED", socket.id);

  socket.on("disconnect", (reason) => {
    console.log("DISCON", socket.id);
  });
});

io.listen(7080);

async function sendNewDataToWatcher(id) {
  console.log("send new data to all watcher of", id);

  const data = await projectHandler.getMain(JSONdb, pathPreFix, id);
  userInProj[id].forEach((user) => {
    console.log("for ", user);
    io.sockets.to(user).emit("newProjData", data);
  });
}

async function sendUserData(id) {
  console.log("is this proj id", id);
  const proj = new JSONdb(pathPreFix + "/database/projects/" + id + ".json");
  userInProj[id].forEach((user) => {
    console.log("for ", user);
    io.sockets.to(user).emit("newUserData", { user: userInProj[id].length, access: proj.get("access") });
  });
}

function checkUserPermissions(user, id) {
  const proj = new JSONdb(pathPreFix + "/database/projects/" + id + ".json");
  const access = proj.get("access");
  if (access != null || access != undefined) {
    if (user == null || user == undefined) {
      if (access.everyone) return 0;
      else return -1;
    } else {
      if (proj.get("owner") == user) return 4;
      else if (access.admin.includes(user)) return 3;
      else if (access.full.includes(user)) return 2;
      else if (access.readOnly.includes(user)) return 1;
      else if (access.everyone) return 0;
      else return -1;
    }
  } else return -1;
}
