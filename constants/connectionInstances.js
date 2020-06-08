import axios from 'axios'
import config from "./config";
// Next we make an 'instance' of it
const instance = axios.create({
// .. where we make our configurations
    baseURL: config.baseURL,
});

export default instance;