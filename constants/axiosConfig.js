import axios from 'axios'
// Next we make an 'instance' of it
const instance = axios.create({
// .. where we make our configurations
    baseURL: 'http://192.168.0.187:80/'
});

export default instance;