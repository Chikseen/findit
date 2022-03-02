const nodefetch = require("../node_modules/node-fetch");
module.exports = {
  async checkUser(call, address, payload) {
    console.log("Req to authhandler")
    const request = await nodefetch(`${call}${address}`, {
      body: JSON.stringify(payload),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      method: "POST",
      mode: "cors",
      redirect: "follow",
    });
    const result = await request.json();
    return result;
  },
};
