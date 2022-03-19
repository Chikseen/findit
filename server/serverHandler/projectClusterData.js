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
      proj.name = sharedWith.push({ projectID: Object.keys(projid)[0], name: proj.get("name"), sharedWith: projid[Object.keys(projid)[0]] });
    });

    // Construct Sharedby
    let sharedBy = [];
    projectCluster.get(data).sharedByProjects.forEach((projid) => {
      const proj = new JSONdb(pathPreFix + "/database/projects/" + projid.projectID + ".json");
      sharedBy.push({ projectID: proj.get("id"), name: proj.get("name"), sharedBy: projid.shareBy });
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
    newProj.set("main", { pcr: {}, data: { maxLevel: 0 } });

    if (!projectCluster.get(owner).ownProjects.includes(projectID)) {
      console.log("set Owenr");
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
    if (projectCluster.get(data.user).ownProjects.includes(data.projectID)) {
      fs.unlinkSync(pathPreFix + "/database/projects/" + data.projectID + ".json");
      const index = projectCluster.get(data.user).ownProjects.indexOf(data.projectID);
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
                console.log(error);
                console.log("nothing to wory about");
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
};
