const runIn = "development";
const apiService = {
  //DATA FETCHER
  async fetchData(adress, payload) {
    let call;
    if (runIn == "development") {
      call = "http://192.168.2.100:6080";
    } else {
      call = "https://auth.drunc.net";
    }
    try {
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
  async projectcall(adress, payload) {
    let call;
    if (runIn == "development") {
      call = "http://192.168.2.100:7081";
    } else {
      call = "https://api.drunc.net";
    }
    try {
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
};

export default apiService;
