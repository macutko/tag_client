import {StyleSheet, View} from 'react-native';
import * as React from 'react';
import MapboxGL from "@react-native-mapbox-gl/maps";
import {PermissionsAndroid} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import distance from "../constants/distance";
import axiosConfig from "../constants/axiosConfig";
import AsyncStorage from '@react-native-community/async-storage';

MapboxGL.setAccessToken('pk.eyJ1IjoibWFjdXRrbyIsImEiOiJjazlmbTgzbXAwY25tM2V0MDJ0eHgxbTBwIn0.np9dHqzUS0HEKSlbejOlbQ');

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


export class GameScreen extends React.Component {

    _retrieveKeys = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (token === undefined) {
                console.log("got nothing on token!");
                console.log(token);
            }
            console.log(token);
            this.setState({token: token})
        } catch (error) {
            console.log(error)
        }
    };


    constructor(props) {
        super(props);
        this.state = {
            currentPosition: [-73.98330688476561, 40.76975180901395],
            currentDistance: 0,
            token: undefined
        };
        requestPermission().then(r => {
            if (r === false) {
                this.props.navigation.navigate('SignInScreen');
            }
        }); //TODO: check if this is reliable and works on multiple relogins

        this.updateUserPosition = this.updateUserPosition.bind(this)
    }

    componentDidMount() {
        MapboxGL.setTelemetryEnabled(false);
        this.updateUserPosition();
        this._retrieveKeys();
    }

    updateUserPosition() {
        // Rather use this position due to the accuracy compared to MapBox
        Geolocation.getCurrentPosition(info => {
            let lat = info["coords"]["latitude"];
            let long = info["coords"]["longitude"];

            let new_distance = distance(lat, long, this.state.currentPosition[0], this.state.currentPosition[1]);
            let abs_diff = Math.abs(new_distance - this.state.currentDistance);
            if (abs_diff >= 0.1) {

                console.log(lat);
                console.log(long);
                console.log(this.state.token);
                axiosConfig.put('/location/update', {
                    "latitude": lat,
                    "longitude": long
                }, {
                    headers: {"Authorization": "Bearer " + this.state.token}
                }).then(response => {
                    console.log(response)
                }).catch(error => {
                    console.log(error)
                });


                this.setState({currentPosition: [long, lat], currentDistance: new_distance}, function () {
                    console.log("Absolute difference between new and old position: " + abs_diff);
                });
            }
        });
    };

    render() {
        return (
            <View style={styles.container}>
                <MapboxGL.MapView
                    styleURL={MapboxGL.StyleURL.Street}
                    style={styles.container}
                    logoEnabled={false}
                    compassEnabled={true}
                    compassViewPosition={1}
                    attributionEnabled={false}
                    onUserLocationUpdate={this.updateUserPosition}
                >
                    <MapboxGL.UserLocation visible={false}
                                           showsUserHeadingIndicator={true} onUpdate={this.updateUserPosition}/>
                    <MapboxGL.Camera zoomLevel={20} defaultSettings={{
                        centerCoordinate: this.state.currentPosition,
                        zoomLevel: 2,
                    }}/>
                    <MapboxGL.PointAnnotation id="User" coordinate={this.state.currentPosition}>
                        <View style={styles.circle_out}>
                            <View style={styles.circle_in}>
                                {/*// TODO: make sure the circle scales according to the real world shape of the radius!*/}
                            </View>
                        </View>
                    </MapboxGL.PointAnnotation>


                </MapboxGL.MapView>


            </View>
        );
    }
}

const styles = StyleSheet.create({
    circle_in: {
        width: 10,
        height: 10,
        borderRadius: 100 / 2,
        backgroundColor: 'rgba(50,50,255, 1)'
    },
    circle_out: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        opacity: 0.5,
        width: 25,
        height: 25,
        borderRadius: 100 / 2,
        backgroundColor: 'rgba(50,50,255, 0.4)'
    },
    container: {
        flex: 1,
        padding: 1,
    },
    map: {
        height: 400,
        marginTop: 80
    },
    annotationContainer: {
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 15
    },
    annotationFill: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'blue',
        transform: [{scale: 0.6}]
    }
});
