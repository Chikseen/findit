//const call = "http://192.168.2.100";
const call = "https://auth.drunc.net";

const apiService = {
  //DATA FETCHER
  async fetchData(adress, port, payload) {
    port;
    try {
      // const request = await fetch(`${call}:${port}/${adress}`, {
      console.log("address", `${call}/${adress}`);
      const request = await fetch(`${call}/${adress}`, {
        body: JSON.stringify(payload),
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        method: "POST",
        mode: "cors",
        redirect: "follow",
      });
      return await request.json();
    } catch (error) {
      return {
        isError: true,
        succes: false,
        errormsg: "unexpected",
        msg: "Something unexepted happend",
      };
    }
  },
  async test(adress, payload) {
    try {
      // const request = await fetch(`${call}:${port}/${adress}`, {
      console.log("address", `${adress}`);
      const request = await fetch(`${adress}`, {
        body: JSON.stringify(payload),
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        method: "POST",
        mode: "cors",
        redirect: "follow",
      });
      return await request.json();
    } catch (error) {
      return {
        isError: true,
        succes: false,
        errormsg: "unexpected",
        msg: "Something unexepted happend",
      };
    }
  },
};

export default apiService;
