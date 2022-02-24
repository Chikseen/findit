module.exports = {
  async checkUser(fetch, payload) {
    c//onst request = await fetch(`http://192.168.2.100:6080/session/checkUser`, {
    const request = await fetch(`https://auth.drunc.net/session/checkUser`, {
      body: JSON.stringify(payload),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      method: "POST",
      mode: "cors",
      redirect: "follow",
    });
    const result = await request.json()
    return result;
  },
};
