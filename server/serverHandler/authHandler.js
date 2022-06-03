const nodefetch = require("../node_modules/node-fetch");
module.exports = {
  async checkUser(call, address, payload) {
    console.log("Req to authhandler");
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
  async authreq(requestToken) {
    const request = await nodefetch(
      `https://github.com/login/oauth/access_token?client_id=${process.env.VUE_APP_CLIENT_ID}&client_secret=${process.env.VUE_APP_CLIENT_SECRET}&code=${requestToken}`,
      {
        method: "post",
        headers: {
          Accept: "application/json",
        },
      }
    );
    return await request.json();
  },
  async getuserData(requestToken) {
    const request = await nodefetch(`https://api.github.com/user`, {
      method: "get",
      headers: {
        Accept: "application/json",
        Authorization: "token " + requestToken,
      },
    });
    return await request.json();
  },
};
