import axios from 'axios'
import config from "../constants/config";

const axiosInstance = axios.create({
    baseURL: config.baseURL,
});


module.exports = {axiosInstance}
