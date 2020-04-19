import axios from 'axios'
// Next we make an 'instance' of it
const instance = axios.create({
// .. where we make our configurations
    baseURL: 'http://192.168.120.19:80/'
});

export default instance;