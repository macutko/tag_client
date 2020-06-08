import axios from 'axios'
import config from "./config";
import io from "socket.io-client";

const axiosInstance = axios.create({
    baseURL: config.baseURL,
});


module.exports = {axiosInstance}
