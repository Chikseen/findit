module.exports = {
  async init(fs, pathPreFix) {
    console.log("Check database for atuh service");
    if (!fs.existsSync(pathPreFix + "/database")) {
      console.log("creating database Folder");
      fs.mkdirSync(pathPreFix + "/database");
    }

    if (!fs.existsSync(pathPreFix + "/database/user.json")) {
      console.log("creating user.json");
      fs.writeFile(
        pathPreFix + "/database/user.json",
        "",
        "utf8",
        function (err) {}
      );
    }
  },
};
