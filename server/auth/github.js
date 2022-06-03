const nodefetch = require("node-fetch");
require("dotenv").config();

module.exports = {
  async getAccesToken(code) {
    const request = await nodefetch(
      `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}`,
      {
        method: "get",
        headers: {
          Accept: "application/json",
        },
      }
    );
    return await request.json();
  },
  async getUserData(accessToken) {
    console.log("as", accessToken);
    const request = await nodefetch(`https://api.github.com/user`, {
      method: "get",
      headers: {
        Accept: "application/json",
        Authorization: `token ${accessToken}`,
        "X-OAuth-Scopes": "user:email",
      },
    });
    return await request.json();
  },
};
