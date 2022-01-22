module.exports = {
  async init(fs, pathPreFix) {
    console.log("Check database integrity");
    if (!fs.existsSync(pathPreFix + "/database")) {
      console.log("creating database Folder");
      fs.mkdirSync(pathPreFix + "/database");
    }
    if (!fs.existsSync(pathPreFix + "/projects")) {
      console.log("creating projects Folder");
      fs.mkdirSync(pathPreFix + "/projects");
    }

    if (!fs.existsSync(pathPreFix + "/database/user.json")) {
      console.log("creating user.json");
      fs.writeFile(
        pathPreFix + "/database/user.json",
        "",
        "utf8",
        function (err) {}
      );
      //fs.appendFile(pathPreFix + "/database/user.json");
    }

    if (!fs.existsSync(pathPreFix + "/database/projectcluster.json")) {
      console.log("creating projectcluster.json");
      fs.writeFile(
        pathPreFix + "/database/projectcluster.json",
        "",
        "utf8",
        function (err) {}
      );
      //fs.appendFile(pathPreFix + "/database/projectcluster.json");
    }
  },

  checkProjectCluster() {},
};
