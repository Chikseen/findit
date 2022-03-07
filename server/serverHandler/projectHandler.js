module.exports = {
  async addElement(JSONdb, pathPreFix, data) {
    const projectall = new JSONdb(pathPreFix + "/database/projects/" + data.projectID + ".json");
    let project = projectall.get("main");
    console.log("add data to project");
    let level = 0;

    if (typeof project.pcr[data.child] != "undefined") {
      return {
        isError: true,
        succes: false,
        errormsg: "entryExits",
        msg: "The names alrady exits",
      };
    }

    // Increse level by one of parent
    if (project.pcr[data.parent]) level = project.pcr[data.parent].level + 1;

    project.pcr[data.child] = { parent: data.parent, level: level, childs: [] };

    if (level != 0) {
      project.pcr[data.parent].childs.push(data.child);
    }

    // Add new level if not exits
    if (!project.data[level]) {
      project.data[level] = [];
      project.data.maxLevel = level;
    }
    project.data[level].push(data.child);

    projectall.set("main", project);
    return project;
  },

  async removeElement(JSONdb, pathPreFix, data) {
    console.log("remove", data);
    const projectall = new JSONdb(pathPreFix + "/database/projects/" + data.projectID + ".json");
    let project = projectall.get("main");
    console.log("remove" + data.parent + " from the project");
    const level = project.pcr[data.parent].level;

    //project.pcr[data.child] = { parent: data.parent, level: level };
    /*     let hasChilds = true;
    while (hasChilds) {
      removeChilds(data.parent.childs)
    } */
    const allfirstChilds = project.pcr[data.parent].childs;
    allfirstChilds.forEach((elem) => {
      delete project.pcr[elem];
    });
    if (level != 0) {
      project.pcr[project.pcr[data.parent].parent].childs.splice(project.pcr[project.pcr[data.parent].parent].childs.indexOf(data.parent), 1);
    }
    delete project.pcr[data.parent];

    project.data[level].splice(project.data[level].indexOf(data.parent), 1);

    if (project.data[project.data.maxLevel].length == 0) {
      delete project.data[project.data.maxLevel];
      project.data.maxLevel -= 1;
    }

    projectall.set("main", project);
    return project;
  },

  async getMain(JSONdb, pathPreFix, id) {
    const proj = new JSONdb(pathPreFix + "/database/projects/" + id + ".json");
    return proj.get("main");
  },
};
