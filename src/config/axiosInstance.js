import axios from "axios";

export const axiosInstance= axios.create({
    baseURL: "https://chatapp-server-roy9.onrender.com/api/v1",
})  