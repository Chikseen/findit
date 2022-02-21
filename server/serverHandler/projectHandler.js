module.exports = {
  async addElement(JSONdb, pathPreFix, data) {
    console.log("data", data);
    const project = new JSONdb(
      pathPreFix + "/database/projects/" + data.project + ".json",
      { asyncWrite: true }
    );
    let prodata = project.get("main");
    console.log("prodata", prodata);
    if (data.parent == "") {
      prodata[data.toAdd] = {};
    }

    console.log("pro", prodata);
    project.set("main", prodata);

    return project.get("main");
  },
};
