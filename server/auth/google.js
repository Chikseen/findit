const nodefetch = require("node-fetch");
require("dotenv").config();

module.exports = {
  async getAccesToken(code) {
    console.log("new code", code);

    console.log("client_id", `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT}&response_type=code&scope=em-ail`);

    const request = await nodefetch(
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT}&response_type=code&scope=em-ail`,
      {
        method: "get",
/*         headers: {
          Accept: "application/json",
        }, */
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
