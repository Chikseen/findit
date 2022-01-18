const rawip = require('ip');
console.log("ip", rawip.address())

const ip = rawip.address()

const baseUrl = `https://${ip}:7080/`;
//const header = { headers: { "X-DevTours-Developer": "Tim Menzel" } };

const apiService = {
    //DATA FETCHER
    async fetchData(adress, bodydata) {
        console.log("try fetch")
        const reqenst = await fetch(`${baseUrl}${adress}`, {
            body: bodydata,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            method: "POST",
        });
        return await reqenst.json();
    },
    async getData(adress) {
        console.log("try fetch")
        console.log(`${baseUrl}${adress}`)
        const reqenst = await fetch(`${baseUrl}${adress}`, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            method: "GET",
        });
        return await reqenst.json();
    },
    currentIp() {
        return ip
    }
}

export default apiService;