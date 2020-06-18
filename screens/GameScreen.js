import {StyleSheet, View} from 'react-native';
import * as React from 'react';
import MapboxGL from "@react-native-mapbox-gl/maps";
import Geolocation from '@react-native-community/geolocation';
import config from "../constants/config";
import {OtherUserObject} from "../components/user/OtherUserObject";
import {CurrentUserObject} from "../components/user/CurrentUserObject";
import * as io from "socket.io-client";
import {Text} from "react-native-elements";
import {distance, requestPermission, _retrieveKeys, getUsername} from "../helpers/utils";
import AsyncStorage from "@react-native-community/async-storage";

MapboxGL.setAccessToken(config.mapbox_key);


export class GameScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPosition: [-73.98330688476561, 40.76975180901395],
            currentDistance: 0,
            token: undefined,
            users: {},
            timer: 10,
            inChase: false
        };
        requestPermission().then(r => {
            if (r === false) {
                this.props.navigation.navigate('SignInScreen');
            }
        }); //TODO: check if this is reliable and works on multiple relogins

        MapboxGL.setTelemetryEnabled(false);
        _retrieveKeys()
            .then((token) => {
                this.setState({token: token})
                this.socket = io.connect(config.baseURL, {'forceNew': true});
                this.socket.on('connect', socket => {
                    this.socket
                        .on('authenticated', () => {
                            console.log("Authorized to PLAY!!!")
                        })
                        .emit('authenticate', {token: token})
                        .on('position_update', (data) => {
                            this._add_user(data)
                        })
                });

            }).catch(error => {
            console.log(error)
        });

    }

    componentWillUnmount = () => {
        this.socket.emit('terminate');
        this.socket.disconnect();
        clearInterval(this.interval);
    }

    _updateUserPosition = () => {
        // Rather use this position due to the accuracy compared to MapBox

        Geolocation.getCurrentPosition(info => {
            let lat = info["coords"]["latitude"];
            let long = info["coords"]["longitude"];

            let new_distance = distance(lat, long, this.state.currentPosition[0], this.state.currentPosition[1]);
            let abs_diff = Math.abs(new_distance - this.state.currentDistance);
            if (abs_diff >= 0.1) {
                this.socket.emit('position_changed', {
                    "latitude": lat,
                    "longitude": long,
                    "username": this.state.username
                })
                this.setState({currentPosition: [long, lat], currentDistance: new_distance}, function () {
                    console.log("Absolute difference between new and old position: " + abs_diff);
                });
            }
        });
    };

    componentDidMount() {
        getUsername().then((data) => {
            this.setState({username: data})
        })
        this._updateUserPosition();
    }

    _add_user = (data) => {
        this.state.users[data.userID] = {
            position: [data.long, data.lat],
            socketID: data.socketID,
            username: data.username
        }
        this.setState({users: this.state.users})
        console.log(this.state.users)
    }
    startTimer = () => {
        this.interval = setInterval(
            () => this.setState((prevState) => ({timer: prevState.timer - 1})),
            1000
        );
    }
    cancelTimer = () => {
        clearInterval(this.interval);
        this.setState({timer: 10});
    }
    updateChaseStatus = () => {
        this.setState((prevState) => ({
            inChase: !prevState.inChase
        }), () => {
            console.log('handleUpdateChase AFTER', this.state.inChase);
        });
    }
    getChaseStatus = () => {
        return this.state.inChase
    }

    render() {
        let other_users = Object.keys(this.state.users).map((key, index) => (
            <OtherUserObject key={index} id={key} userObject={this.state.users[key]}
                             socket={this.socket} currentUser={this.state.username}
                             updateChaseStatus={this.updateChaseStatus}
                             getChaseStatus={this.getChaseStatus} startTimer={this.startTimer}
                             cancelTimer={this.cancelTimer} timer={this.state.timer}/>
        ))
        let current_user = <CurrentUserObject currentPosition={this.state.currentPosition} socket={this.socket}
                                              updateChaseStatus={this.updateChaseStatus}
                                              getChaseStatus={this.getChaseStatus} startTimer={this.startTimer}
                                              cancelTimer={this.cancelTimer} timer={this.state.timer}/>

        return (
            <View style={styles.container}>
                <View style={{
                    width: 30,
                    backgroundColor: "transparent",
                    position: 'absolute',
                    top: "2%",
                    left: "2%",
                    zIndex: 10
                }}>
                    <Text style={{backgroundColor: "red"}}>{this.state.timer}</Text>
                </View>
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


                    {current_user}
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
