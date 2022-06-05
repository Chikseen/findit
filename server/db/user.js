const fs = require("fs");
const SQL = require("./sqlPara.js");
const { v4: uid } = require("uuid");

module.exports = {
  async saveUser(db, user) {
    const sql = fs.readFileSync("./sql/user/createUser.sql").toString();

    const isUserExits = await this.checkUserExits(db, user.login);
    console.log("User", user);
    console.log("isUserExits", isUserExits);

    if (!isUserExits) {
      console.log("Create new User", user);
      const id = uid();
      const query = SQL.parse(sql, { id: id, name: user.login, provider: user.provider, data: JSON.stringify(user) });
      console.log("query", query);
      db.query(query);
      
    } else console.log("Usr allrady Exits");
  },
  async checkUserExits(db, name) {
    const sql = fs.readFileSync("./sql/user/checkUserExits.sql").toString();
    const query = SQL.parse(sql, { name: name });
    const result = await db.query(query);

    console.log("query", query);
    console.log("result", result);

    if (result.rows.length > 0) return true;
    return false;
  },
};
