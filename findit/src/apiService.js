const call = "http://192.168.2.100:6080";

const apiService = {
  //DATA FETCHER
  async fetchData(adress, payload) {
    try {
      const request = await fetch(`${call}/${adress}`, {
        body: payload,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
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
