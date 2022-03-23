const authhandler = require("../serverHandler/authHandler");
module.exports = {
  async getData(JSONdb, pathPreFix, data) {
    const projectCluster = new JSONdb(pathPreFix + "/database/projectCluster.json");
    console.log("get Data for", data);
    if (!projectCluster.has(data)) {
      console.log("init new user");
      projectCluster.set(data, {
        ownProjects: [],
        sharedByProjects: [],
        sharedWithProjects: [],
      });
    }
    console.log("Data for User", projectCluster.get(data));

    console.log("check for deleted Projects");

    // Construct OwnData
    let ownData = [];
    projectCluster.get(data).ownProjects.forEach((projid) => {
      const proj = new JSONdb(pathPreFix + "/database/projects/" + projid + ".json");
      ownData.push({ projectID: projid, name: proj.get("name") });
    });

    // Construct SharedWith
    let sharedWith = [];
    projectCluster.get(data).sharedWithProjects.forEach((projid) => {
      const proj = new JSONdb(pathPreFix + "/database/projects/" + Object.keys(projid)[0] + ".json");
      if (Object.keys(proj.JSON()).length == 0) {
        const temp = projectCluster.get(data);
        const i = temp.sharedWithProjects.findIndex((x) => x.projectID === Object.keys(projid)[0]);
        temp.sharedWithProjects.splice(i, 1);
        projectCluster.set(data, temp);
      } else {
        proj.name = sharedWith.push({ projectID: Object.keys(projid)[0], name: proj.get("name"), sharedWith: projid[Object.keys(projid)[0]] });
      }
    });

    // Construct Sharedby
    let sharedBy = [];
    projectCluster.get(data).sharedByProjects.forEach((projid) => {
      const proj = new JSONdb(pathPreFix + "/database/projects/" + projid.projectID + ".json");
      if (Object.keys(proj.JSON()).length == 0) {
        const temp = projectCluster.get(data);
        const i = temp.sharedByProjects.findIndex((x) => x.projectID === projid.projectID);
        temp.sharedByProjects.splice(i, 1);
        projectCluster.set(data, temp);
      } else {
        sharedBy.push({ projectID: proj.get("id"), name: proj.get("name"), sharedBy: projid.shareBy });
      }
    });

    return { ownData, sharedWith, sharedBy };
  },

  createProject(JSONdb, fs, pathPreFix, owner) {
    const projectCluster = new JSONdb(pathPreFix + "/database/projectCluster.json");
    const projectID = Math.floor(Math.random() * 999999999999);
    fs.writeFile(pathPreFix + "/database/projects/" + projectID + ".json", "", "utf8", function (err) {});

    const newProj = new JSONdb(pathPreFix + "/database/projects/" + projectID + ".json");
    newProj.set("owner", owner);
    newProj.set("name", "Untiteld");
    newProj.set("created", new Date());
    newProj.set("id", projectID);
    newProj.set("access", { full: [], readOnly: [], admin: [], everyone: false });
    newProj.set("main", { pcr: {}, data: { maxLevel: 0 } });

    if (!projectCluster.get(owner).ownProjects.includes(projectID)) {
      projectCluster.set(owner + ".ownProjects", projectCluster.get(owner).ownProjects.push(projectID));
    }

    return newProj.storage.id;
  },

  getProject(JSONdb, pathPreFix, projectID) {
    console.log("get Project Data", projectID);
    const newProj = new JSONdb(pathPreFix + "/database/projects/" + projectID + ".json");
    if (newProj.has("main")) {
      const allSharedWith = new JSONdb(pathPreFix + "/database/projectCluster.json");

      const sharedwitharr = allSharedWith.get(newProj.get("owner"));
      const indexOfObj = sharedwitharr.sharedWithProjects.findIndex((obj) => {
        return obj[projectID];
      });

      if (sharedwitharr.sharedWithProjects[indexOfObj]) {
        newProj.storage.sharedWith = sharedwitharr.sharedWithProjects[indexOfObj][projectID];
      }
      return newProj.storage;
    } else {
      return {
        isError: true,
        succes: false,
        errormsg: "rojNotExits",
        msg: "This Project does not exits or you have no readAccess on it",
      };
    }
  },

  getProjectMeta(JSONdb, pathPreFix, projectID) {
    console.log("get Project Data", projectID);
    const newProj = new JSONdb(pathPreFix + "/database/projects/" + projectID + ".json");
    return newProj.storage.id;
  },

  deleteProject(JSONdb, fs, pathPreFix, data) {
    const projectCluster = new JSONdb(pathPreFix + "/database/projectCluster.json");
    if (projectCluster.get(data.user).ownProjects.includes(parseInt(data.projectID))) {
      fs.unlinkSync(pathPreFix + "/database/projects/" + data.projectID + ".json");
      const index = projectCluster.get(data.user).ownProjects.indexOf(parseInt(data.projectID));
      if (index > -1) {
        let temp = projectCluster.get(data.user);
        temp.ownProjects.splice(index, 1);
        projectCluster.set(data.user, temp);
        return {
          isError: false,
          errormsg: "projectremovesuccess",
          msg: "Project deleted successfully",
        };
      }
    } else {
      return {
        isError: true,
        errormsg: "errordeletingError",
        msg: "You may have not the permissions to delete this Project",
      };
    }
  },
  async sendInvite(JSONdb, fs, pathPreFix, data, call, io, userBinds) {
    const projectCluster = new JSONdb(pathPreFix + "/database/projectCluster.json");

    try {
      console.log("data.shareWith", data.shareWith);
      console.log("data.shareBy", data.shareBy);
      if (data.shareWith != undefined && data.shareBy != undefined) {
        const getOwnMail = await authhandler.checkUser(call, "session/getMail", { userName: data.shareBy });
        console.log("email from sending user", getOwnMail);

        if (getOwnMail.result != data.shareWith) {
          const emailExits = await authhandler.checkUser(call, "session/checkMail", { email: data.shareWith });
          console.log("does invited user exits", emailExits);

          if (emailExits.result) {
            //____________________

            const shareWithjson = await authhandler.checkUser(call, "session/getUser", { email: data.shareWith });
            const shareWith = shareWithjson.result;
            if (!projectCluster.has(shareWith)) {
              console.log("Create Projectcluster for user");
              projectCluster.set(shareWith, {
                ownProjects: [],
                sharedByProjects: [],
                sharedWithProjects: [],
              });
            }

            const allData = projectCluster.get(data.shareBy);

            let hasFoundProj = false;
            let foundOn;
            for (let i = 0; i < allData.sharedWithProjects.length; i++) {
              const project = allData.sharedWithProjects[i];
              if (Object.keys(project)[0] === data.projectID) {
                console.log("we have a match");
                hasFoundProj = true;
                foundOn = i;
              }
            }
            console.log("hasFoundProj", hasFoundProj);
            if (!hasFoundProj) {
              console.log("create new shared Project Entry");
              allData.sharedWithProjects.push({ [data.projectID]: [shareWith] });
              const projectData = new JSONdb(pathPreFix + "/database/projects/" + data.projectID + ".json");
              const access = projectData.get("access");
              if (data.accessLevel == 0) access.readOnly.push(shareWith);
              if (data.accessLevel == 1) access.full.push(shareWith);
              if (data.accessLevel == 2) access.admin.push(shareWith);
              projectData.set("access", access);
            } else {
              if (allData.sharedWithProjects[foundOn][data.projectID].includes(shareWith)) {
                console.log("Allradey added");
                return {
                  isError: false,
                  status: true,
                  msg: "You allrady invited this user",
                  err: "userallradyinvited",
                };
              } else {
                allData.sharedWithProjects[foundOn][data.projectID].push(shareWith);
                allData.sharedWithProjects[data.projectID] = (data.projectID, allData.sharedWithProjects[foundOn][data.projectID]);
                console.log("user not added");
              }
              console.log("projectdata", allData.sharedWithProjects[foundOn][data.projectID]);
            }
            projectCluster.set(allData);

            if (projectCluster.has(shareWith)) {
              console.log("user exits in clusterdta");
              const userdata = projectCluster.get(data.shareBy, data.shareBy);
              projectCluster.set(data.shareBy, userdata);

              const setSharedBY = projectCluster.get(shareWith);
              let projectAllreadyExits = false;
              setSharedBY.sharedByProjects.forEach((proj) => {
                console.log("proj", proj);
                if (proj.projectID == data.projectID) {
                  projectAllreadyExits = true;
                }
              });

              if (!projectAllreadyExits) {
                setSharedBY.sharedByProjects.push({
                  projectID: data.projectID,
                  shareBy: data.shareBy,
                });
                projectCluster.set(shareWith, setSharedBY);
              } else {
                console.log("data allready exits");
              }

              const UserDAta = await this.getData(JSONdb, pathPreFix, shareWith);
              console.log("userbinds", userBinds);
              try {
                io.sockets.to(userBinds[shareWith].socketID).emit("newProjData", UserDAta);
              } catch (error) {
                console.log("nothing to wory about");
                console.log(error);
              }
              //send mail to infom inveted person about invite
              authhandler.checkUser(call, "session/sendMailForInvite", { email: data.shareWith });
              return {
                isError: false,
                status: true,
                msg: "Invitation send successfull",
                err: "Invitationsendsuccessfull",
              };
            } else {
              console.log("user dident logedin yet try to resend later");
              return {
                isError: false,
                status: true,
                msg: "Invitation send successfull",
                err: "Invitationsendsuccessfull",
              };
            }
          }
        } else {
          console.log("email does not exits");
        }
      } else {
        return {
          isError: true,
          status: false,
          msg: "You cant invite your own Account",
          err: "sameEmail",
        };
      }
    } catch (error) {
      console.log("exeption", error);
      return {
        isError: true,
        succes: false,
        errormsg: "unexpected",
        msg: "Something unexepted happend",
      };
    }
  },

  async changeAccess(JSONdb, fs, pathPreFix, data, call, io, userBinds) {
    console.log("Change Access level for " + data.userToChange + " to " + data.toLevel);
    const project = new JSONdb(pathPreFix + "/database/projects/" + data.projectID + ".json");
    let access = project.get("access");
    switch (data.toLevel) {
      case 0:
        const indexfull0 = access.full.indexOf(data.userToChange);
        if (indexfull0 > -1) access.full.splice(indexfull0, 1);
        const indexadmin0 = access.admin.indexOf(data.userToChange);
        if (indexadmin0 > -1) access.admin.splice(indexadmin0, 1);

        access.readOnly.push(data.userToChange);
        project.set("access", access);

        break;
      case 1:
        const indexreadOnly1 = access.readOnly.indexOf(data.userToChange);
        if (indexreadOnly1 > -1) access.readOnly.splice(indexreadOnly1, 1);
        const indexadmin1 = access.admin.indexOf(data.userToChange);
        if (indexadmin1 > -1) access.admin.splice(indexadmin1, 1);

        access.full.push(data.userToChange);
        project.set("access", access);

        break;
      case 2:
        const indexreadOnly2 = access.readOnly.indexOf(data.userToChange);
        if (indexreadOnly2 > -1) access.readOnly.splice(indexreadOnly2, 1);
        const indexfull2 = access.full.indexOf(data.userToChange);
        if (indexfull2 > -1) access.full.splice(indexfull2, 1);

        access.admin.push(data.userToChange);
        project.set("access", access);

        break;
      case 3:
        break;
      case 4:
        access.everyone = !access.everyone;
        project.set("access", access);
        console.log("toggle everyone mode", access);
        break;
      default:
        console.log("no to level given");
        break;
    }
  },
};
