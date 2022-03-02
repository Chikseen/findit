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

let pathPreFix;
let authCall;

if (process.env.NODE_ENV === "development") {
  console.log("server is running in Dev mode");
  authCall = "http://192.168.2.100:6080/";
  pathPreFix = ".";
} else {
  console.log("server is running in Prod mode");
  authCall = "https://auth.drunc.net/";
  pathPreFix = "";
}

// DATAINIT
databaseIntegrity.init(fs, pathPreFix);
databaseIntegrity.checkProjectCluster(fs, pathPreFix);

const projectCluster = new JSONdb(pathPreFix + "/database/projectCluster.json");
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

app.post("/home/projectData/metaData", async (request, response) => {
  console.log("get Project Meta Data for ", request.body);
  if (!projectCluster.has(request.body)) {
    console.log("Create Projectcluster for user")
    projectCluster.set(request.body, {
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
  console.log("load Project", request.body);
  if (await auth.checkUser(authCall, "session/checkUser", request.body)) {
    if (request.body.projectID == "-1") {
      console.log("create Proj");
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
  console.log("delete Project", request.body);
  response.json(await projectClusterData.deleteProject(JSONdb, fs, pathPreFix, request.body));
});

app.post("/projects/load", async (request, response) => {
  console.log("load Project", request.body);
  //Validate if user can load thisProject here !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  response.json(await projectClusterData.getProject(JSONdb, pathPreFix, request.body.projectID));
});

app.post("/projects/sendInvite", async (request, response) => {
  response.json(await projectClusterData.sendInvite(JSONdb, fs, pathPreFix, request.body, authCall, io, userBinds));
});
//_____________________________________________________________________________________________________________________
// SOCKET
io.on("connection", (socket) => {
  console.log("CONNECTED", socket.id);

  //DELTEPROJECT
  socket.on("deleteProject", async (data) => {
    console.log("Try to delete Project", data);
    socket.emit("response", projectClusterData.deleteProject(projectCluster, fs, pathPreFix, data));
  });

  socket.on("shareProject", async (data) => {});

  socket.on("addElementToParent", async (data) => {
    console.log("add Element ");
    const test = projcthandler.addElement(JSONdb, pathPreFix, data);
    console.log("test", test);
    socket.emit("projectStructure", await projcthandler.addElement(JSONdb, pathPreFix, data));
  });

  //REMOVE SOCKETDATA ON DISCONNECT
  socket.on("disconnect", (reason) => {
    console.log("DISCON", socket.id);
  });
});

io.listen(7080);
