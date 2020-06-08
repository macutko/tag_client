import {StyleSheet, View} from 'react-native';
import * as React from 'react';
import MapboxGL from "@react-native-mapbox-gl/maps";
import Geolocation from '@react-native-community/geolocation';
import distance from "../constants/distance";
import io from 'socket.io-client';
import config from "../constants/config";
import {UserObject} from "../components/UserObject";
import {CurrentUser} from "../components/CurrentUser";

const util = require("../constants/utils")
MapboxGL.setAccessToken(config.mapbox_key);


export class GameScreen extends React.Component {
    componentWillUnmount() {
        console.log("Disconneting");
        this.socket.emit('terminate');
        this.socket.disconnect();
    }

    _updateUserPosition() {
        // Rather use this position due to the accuracy compared to MapBox
        Geolocation.getCurrentPosition(info => {
            let lat = info["coords"]["latitude"];
            let long = info["coords"]["longitude"];

            let new_distance = distance(lat, long, this.state.currentPosition[0], this.state.currentPosition[1]);
            let abs_diff = Math.abs(new_distance - this.state.currentDistance);
            if (abs_diff >= 0.0) {
                this.socket.emit('position_changed', {
                    "latitude": lat,
                    "longitude": long
                })
                this.setState({currentPosition: [long, lat], currentDistance: new_distance}, function () {
                    console.log("Absolute difference between new and old position: " + abs_diff);
                });
            }
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            currentPosition: [-73.98330688476561, 40.76975180901395],
            currentDistance: 0,
            token: undefined,
            users: {},
        };
        util.requestPermission().then(r => {
            if (r === false) {
                this.props.navigation.navigate('SignInScreen');
            }
        }); //TODO: check if this is reliable and works on multiple relogins

        this._updateUserPosition = this._updateUserPosition.bind(this)
    }

    componentDidMount() {
        MapboxGL.setTelemetryEnabled(false);
        util._retrieveKeys().then(r => this.setState({token: r}));
        this._updateUserPosition();

        this.socket = io.connect(config.baseURL, {'forceNew': true});
        this.socket.on('connect', socket => {
            this.socket
                .on('authenticated', () => {
                    console.log("Authorized to PLAY!!!")
                })
                .emit('authenticate', {token: this.state.token})
                .on('position_update', (data) => {
                    console.log(JSON.stringify(data))
                    this._add_user(data)
                })
        });
    }


    _add_user(data) {
        this.state.users[data.uid] = [data.long, data.lat]
        this.setState({users: this.state.users})
        console.log(this.state.users)
    }

    render() {
        let other_users = Object.keys(this.state.users).map((key, index) => (
            <UserObject key={index} id={key} coordinate={this.state.users[key]}/>
        ))
        return (
            <View style={styles.container}>
                <MapboxGL.MapView
                    styleURL={MapboxGL.StyleURL.Street}
                    style={styles.container}
                    logoEnabled={false}
                    compassEnabled={true}
                    compassViewPosition={1}
                    attributionEnabled={false}
                >
                    <MapboxGL.UserLocation visible={false}
                                           showsUserHeadingIndicator={true} onUpdate={this._updateUserPosition}/>
                    <MapboxGL.Camera zoomLevel={20} defaultSettings={{
                        centerCoordinate: this.state.currentPosition,
                        zoomLevel: 2,
                    }}/>

                    <CurrentUser currentPosition={this.state.currentPosition}/>

                    {other_users}


                </MapboxGL.MapView>


            </View>
        );
    }
}

const styles = StyleSheet.create({
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