module.exports = {
  async addElement(JSONdb, pathPreFix, data) {
    console.log("data", data);
    const projectall = new JSONdb(pathPreFix + "/database/projects/" + data.projectID + ".json");
    let project = projectall.get("main");
    console.log("add data to project");
    let level = 0;

    // Increse level by one of parent
    if (project.pcr[data.parent]) level = project.pcr[data.parent].level + 1;

    project.pcr[data.child] = { parent: data.parent, level: level };

    // Add new level if not exits
    if (!project.data[level]) project.data[level] = [];
    project.data[level].push(data.child);

    projectall.set("main", project);
    return project;
  },

  async getMain(JSONdb, pathPreFix, id) {
    const proj = new JSONdb(pathPreFix + "/database/projects/" + id + ".json");
    return proj.get("main");
  },
};
