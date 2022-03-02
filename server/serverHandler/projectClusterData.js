module.exports = {
  async getData(JSONdb, pathPreFix, data) {
    const projectCluster = new JSONdb(pathPreFix + "/database/projectcluster.json");
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
    return projectCluster.get(data);
  },

  createProject(JSONdb, fs, pathPreFix, owner) {
    const projectCluster = new JSONdb(pathPreFix + "/database/projectcluster.json");
    const projectID = Math.floor(Math.random() * 999999999999);
    fs.writeFile(pathPreFix + "/database/projects/" + projectID + ".json", "", "utf8", function (err) {});

    const newProj = new JSONdb(pathPreFix + "/database/projects/" + projectID + ".json");
    newProj.set("owner", owner);
    newProj.set("created", new Date());
    newProj.set("id", projectID);
    newProj.set("data", {});

    if (!projectCluster.get(owner).ownProjects.includes(projectID)) {
      console.log("set Owenr");
      projectCluster.set(owner + ".ownProjects", projectCluster.get(owner).ownProjects.push(projectID));
    }

    return newProj.storage.id;
  },

  getProject(JSONdb, pathPreFix, projectID) {
    console.log("get Project Data", projectID);
    const newProj = new JSONdb(pathPreFix + "/database/projects/" + projectID + ".json");
    if (newProj.has("data")) {
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
    const projectCluster = new JSONdb(pathPreFix + "/database/projectcluster.json");
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
};
