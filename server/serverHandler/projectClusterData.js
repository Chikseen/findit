module.exports = {
  async getData(projectCluster, user, data) {
    console.log("get Data for", data);

    if (!projectCluster.has(data)) {
      console.log("init new user");
      projectCluster.set(data, {
        ownProjects: [],
        sharedByProjects: [],
        sharedWithProjects: [],
      });
    }
    return projectCluster.get(data);
  },

  createProject(projectCluster, JSONdb, fs, pathPreFix, owner) {
    const projectID = Math.floor(Math.random() * 999999999999);
    fs.writeFile(
      pathPreFix + "/database/projects/" + projectID + ".json",
      "",
      "utf8",
      function (err) {}
    );

    const newProj = new JSONdb(
      pathPreFix + "/database/projects/" + projectID + ".json"
    );
    newProj.set("owner", owner);
    newProj.set("created", new Date());
    newProj.set("id", projectID);

    if (!projectCluster.get(owner).ownProjects.includes(projectID)) {
      console.log("set Owenr");
      projectCluster.set(
        owner + ".ownProjects",
        projectCluster.get(owner).ownProjects.push(projectID)
      );
    }

    return newProj.storage;
  },

  getProject(projectCluster, JSONdb, fs, pathPreFix, projectID) {
    console.log("get Project Data", projectID);
    const newProj = new JSONdb(
      pathPreFix + "/database/projects/" + projectID + ".json",
      { asyncWrite: true }
    );

    return newProj.storage;
  },
};
