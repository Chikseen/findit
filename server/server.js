const { Server } = require("socket.io");
const JSONdb = require("simple-json-db");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const nodefetch = require("node-fetch");

const projectClusterData = require("./serverHandler/projectClusterData");
const databaseIntegrity = require("./serverHandler/databaseIntegrity");
const projcthandler = require("./serverHandler/projectHandler");
const auth = require("./authHandler");

let pathPreFix = "";
if (fs.existsSync("../localDebug.js")) {
  pathPreFix = ".";
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

app.post("/projectData/metaData", async (request, response) => {
  console.log("get Project Meta Data for ", request.body.user);
  console.log("authcheck", auth.checkUser(nodefetch, request.body));
  if (await auth.checkUser(nodefetch, request.body)) {
    response.json(
      await projectClusterData.getData(projectCluster, request.body.user)
    );
  } else {
    response.json({ status: "validation Error" });
  }
});

let userBinds = {};
//_____________________________________________________________________________________________________________________
// SOCKET
io.on("connection", (socket) => {
  console.log("CONNECTED", socket.id);

  /*   //REQUESTUSERDATA
  socket.on("requestProjectData", async (data) => {
    socket.emit(
      "getProjectData",
      await projectClusterData.getData(projectCluster, user, data.userName)
    );
  }); */

  //CREATEPROJECT
  socket.on("createProject", async (data) => {
    socket.emit(
      "projectData",
      projectClusterData.createProject(
        projectCluster,
        JSONdb,
        fs,
        pathPreFix,
        data.owner
      )
    );
  });

  //GETPROJECTDATA
  socket.on("getProject", async (data) => {
    socket.emit(
      "projectData",
      projectClusterData.getProject(
        projectCluster,
        JSONdb,
        fs,
        pathPreFix,
        data.projectID
      )
    );
  });

  //DELTEPROJECT
  socket.on("deleteProject", async (data) => {
    console.log("Try to delete Project", data);

    //const tset = io.of("/").sockets

    socket.emit(
      "response",
      projectClusterData.deleteProject(projectCluster, fs, pathPreFix, data)
    );
  });

  //SOCKECTHANDLING
  socket.on("bindUserConnection", (data) => {
    console.log("Bind User with Socket");
    const userName = data.userName;
    Object.assign(userBinds, {
      [userName]: { socketID: socket.id, name: data.userName },
    });
    console.log("User bindigs", userBinds);
  });

  socket.on("shareProject", async (data) => {
    console.log("ShareData", data);
    if (user.has(data.shareWith)) {
      const allData = projectCluster.get(data.shareBy);

      console.log(
        "allData.sharedWithProjects",
        allData.sharedWithProjects[data.projectID]
      );

      let hasFoundProj = false;
      allData.sharedWithProjects.forEach((project) => {
        if (Object.keys(project)[0] === data.projectID) {
          console.log("we have a match");
          const projectData = project[data.projectID];
          if (projectData.includes(data.shareWith)) {
            console.log("Allradey added");
            hasFoundProj = true;
          } else {
            projectData.push(data.shareWith);
            allData.sharedWithProjects[data.projectID] =
              (data.projectID, projectData);
            console.log("user not added");
          }
        }
      });
      console.log("hasFoundProj", hasFoundProj);
      if (hasFoundProj === false) {
        console.log("create new shared Project Entry");
        allData.sharedWithProjects.push({ [data.projectID]: [data.shareWith] });
        projectCluster.set(allData);
      }

      const userdata = projectCluster.get(data.shareBy, data.shareBy);
      projectCluster.set(data.shareBy, userdata);

      if (!projectCluster.has(data.shareWith)) {
        console.log("create User");
        projectCluster.set(data.shareWith, {
          ownProjects: [],
          sharedByProjects: [],
          sharedWithProjects: [],
        });
      }

      const setSharedBY = projectCluster.get(data.shareWith);
      console.log("setSharedBY", setSharedBY.sharedByProjects);
      let projectAllreadyExits = false;
      setSharedBY.sharedByProjects.forEach((proj) => {
        console.log("proj", proj);
        if (proj.projectID == data.projectID) {
          projectAllreadyExits = true;
        }
      });

      if (!projectAllreadyExits) {
        console.log("ADDDD");
        setSharedBY.sharedByProjects.push({
          projectID: data.projectID,
          shareBy: data.shareBy,
        });
        projectCluster.set(data.shareWith, setSharedBY);
      } else {
        console.log("data allready exits");
      }

      const UserDAta = await projectClusterData.getData(
        projectCluster,
        user,
        data.shareWith
      );
      socket
        .to(userBinds[data.shareWith].socketID)
        .emit("getProjectData", UserDAta);
      socket
        .to(userBinds[data.shareBy].socketID)
        .emit("getProjectData", UserDAta);
    } else {
      console.log("User not found");
    }
  });

  socket.on("addElementToParent", async (data) => {
    console.log("add Element ");
    const test = projcthandler.addElement(JSONdb, pathPreFix, data);
    console.log("test", test);
    socket.emit(
      "projectStructure",
      await projcthandler.addElement(JSONdb, pathPreFix, data)
    );
  });

  //REMOVE SOCKETDATA ON DISCONNECT
  socket.on("disconnect", (reason) => {
    console.log("DISCON", socket.id);
  });
});

io.listen(7080);
