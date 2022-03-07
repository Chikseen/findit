module.exports = {
  async init(fs, pathPreFix) {
    console.log("Check database integrity");
    if (!fs.existsSync(pathPreFix + "/database")) {
      console.log("creating database Folder");
      fs.mkdirSync(pathPreFix + "/database");
    }
    if (!fs.existsSync(pathPreFix + "/database/projects")) {
      console.log("creating projects Folder");
      fs.mkdirSync(pathPreFix + "/database/projects");
    }

    if (!fs.existsSync(pathPreFix + "/database/projectCluster.json")) {
      console.log("creating projectCluster.json");
      fs.writeFile(
        pathPreFix + "/database/projectCluster.json",
        "",
        "utf8",
        function (err) {}
      );
      //fs.appendFile(pathPreFix + "/database/projectCluster.json");
    }
  },

  checkprojectCluster() {},
};
