import io from "socket.io-client";

//const socket = io("https://api.drunc.net");
const socket = io("http://localhost:7080");

const apiService = {

    //String, Object
    emit(path, data) {
        socket.emit(path, data);
    },

}

export default apiService;