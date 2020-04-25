import {ActivityIndicator, StyleSheet, View} from 'react-native';
import * as React from 'react';
import MapboxGL from "@react-native-mapbox-gl/maps";
import {PermissionsAndroid, Image} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

MapboxGL.setAccessToken('pk.eyJ1IjoibWFjdXRrbyIsImEiOiJjazlmbTgzbXAwY25tM2V0MDJ0eHgxbTBwIn0.np9dHqzUS0HEKSlbejOlbQ');
const requestPermission = async () => {
    try {
        const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION]
        );
        if (granted["android.permission.ACCESS_COARSE_LOCATION"] === "granted" && granted["android.permission.ACCESS_FINE_LOCATION"] === "granted") {
            console.log("You can use the location");
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


    constructor(props) {
        super(props);
        this.state = {
            currentPosition: [1, 5],
        };
        requestPermission().then(r => {
            if (r === false) {
                this.props.navigation.navigate('SignInScreen');
            }
        }); //TODO: check if this is reliable and works on multiple relogins

        this.updateUserPosition = this.updateUserPosition.bind(this)
        // this._retrieveKey("refresh_key")
    }

    componentDidMount() {
        MapboxGL.setTelemetryEnabled(false);
        this.updateUserPosition();
    }

    updateUserPosition() {
        // Rather use this position due to the accuracy compared to MapBox
        Geolocation.getCurrentPosition(info => {
            let lat = info["coords"]["latitude"];
            let long = info["coords"]["longitude"];
            this.setState({currentPosition: [long, lat]}, function () {
                console.log(this.state.currentPosition);
            });
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


//     _retrieveKey = async (key) => {
//         try {
//             const value = await AsyncStorage.getItem(key);
//             if (value !== null) {
//                 // We have data!!
//                 console.log(value);
//             } else {
//                 console.log("got nothing!")
//             }
//         } catch (error) {
//             console.log(error)
//         }
//     };

// renderAnnotations() {
//     return (
//         <MapboxGL.PointAnnotation
//             key="pointAnnotation"
//             id="pointAnnotation"
//             coordinate={this.state.initialCoords}>
//             <View style={styles.annotationContainer}>
//                 <View style={styles.annotationFill} />
//             </View>
//             <MapboxGL.Callout title="Your Location" />
//         </MapboxGL.PointAnnotation>
//     );
// }