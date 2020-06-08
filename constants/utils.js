import AsyncStorage from "@react-native-community/async-storage";
import {PermissionsAndroid} from "react-native";

const _retrieveKeys = async () => {
    try {
        const token = await AsyncStorage.getItem("token");
        if (token === undefined) {
            console.log("got nothing on token!");
            console.log(token);
        }
        return token
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

module.exports = {
    _retrieveKeys,
    requestPermission
}
