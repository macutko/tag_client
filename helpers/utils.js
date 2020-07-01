import AsyncStorage from "@react-native-community/async-storage";
import {PermissionsAndroid} from "react-native";


const getFromMemory = async (keys) => {
    try {
        let values;
        if (Array.isArray(keys)) {
            let promises = []
            keys.forEach(key => promises.push(AsyncStorage.getItem(key)));
            values = await Promise.all(promises);
            return values.filter(v => v != null)
        }
        return await AsyncStorage.getItem(keys);
    } catch (error) {
        console.log(error)
    }
};

const removeFromMemory = async (keys) => {
    try {
        if (Array.isArray(keys)) {
            let promises = []
            keys.forEach(key => promises.push(AsyncStorage.removeItem(key)));
            await Promise.all(promises);
        } else {
            await AsyncStorage.removeItem(keys);
        }
    } catch (error) {
        console.log(error)
    }
};

const getUsername = async () => {
    try {
        const name = await AsyncStorage.getItem("username");
        if (name === undefined) {
            console.log("got nothing on name!");
            console.log(name);
        }
        return name
    } catch (error) {
        console.log(error)
    }
};

const requestPermission = async () => {
    try {
        const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION]
        );
        if (granted["android.permission.ACCESS_COARSE_LOCATION"] === "granted" && granted["android.permission.ACCESS_FINE_LOCATION"] === "granted") {
            return true;
        } else {
            console.log("Location permission denied");
            console.log(granted);
            return false;
        }
    } catch (err) {
        console.warn(err);
    }
};

const distance = (lat1, lon1, lat2, lon2) => {
    let R = 6371000; // Radius of the earth in m
    let dLat = deg2rad(lat2 - lat1);  // deg2rad below
    let dLon = deg2rad(lon2 - lon1);
    let a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c; // Distance in km
    return d;
};

const deg2rad = (deg) => {
    return deg * (Math.PI / 180)
};


module.exports = {
    getFromMemory,
    removeFromMemory,
    requestPermission,
    distance,
    getUsername
}
