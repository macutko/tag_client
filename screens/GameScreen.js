import {StyleSheet, View} from 'react-native';
import * as React from 'react';
import MapboxGL from "@react-native-mapbox-gl/maps";
import Geolocation from '@react-native-community/geolocation';
import config from "../constants/config";
import {UserObject} from "../components/user/UserObject";
import {CurrentUserObject} from "../components/user/CurrentUserObject";
import * as io from "socket.io-client";
import {Text} from "react-native-elements";
import {distance, requestPermission, _retrieveKeys, getUsername} from "../helpers/utils";

MapboxGL.setAccessToken(config.mapbox_key);
const l = require('../helpers/logging');

export class GameScreen extends React.Component {
    constructor(props) {
        super(props);

        this.timeRemaining = 10;
        this.state = {
            chaseStatus: false,
            currentDistance: 0,
            token: undefined,
            users: {},
            currentUserObject: {
                position: [-73.98330688476561, 40.76975180901395],
                socketID: undefined,
                username: undefined
            }
        };
        requestPermission().then(r => {
            if (r === false) {
                this.props.navigation.navigate('SignInScreen');
            }
        });

        MapboxGL.setTelemetryEnabled(false);
        _retrieveKeys()
            .then((token) => {
                this.setState({token: token})
                this.socket = io.connect(config.baseURL, {'forceNew': true});
                this.socket.on('connect', socket => {
                    this.socket
                        .on('authenticated', () => {
                            this.setState(prevState => ({
                                currentUserObject: {
                                    ...prevState.currentUserObject,
                                    socketID: this.socket.sessionId
                                },
                            }), () => {
                                console.log("Authenticated to play in sockets")
                            })
                        })
                        .emit('authenticate', {token: token})
                        .on('position_update', (data) => {
                            this.add_user(data)
                        })
                });

            }).catch(error => {
            console.log(error)
        });
        getUsername().then((data) => {
            this.state.currentUserObject.username = data
        })

    }

    componentDidMount() {
        this.updateUserPosition();
    }

    componentWillUnmount = () => {
        this.socket.emit('terminate');
        this.socket.disconnect();
        clearInterval(this.interval);
    }

    updateUserPosition = () => {
        // Rather use this position due to the accuracy compared to MapBox

        Geolocation.getCurrentPosition(info => {
            let lat = info["coords"]["latitude"];
            let long = info["coords"]["longitude"];

            let new_distance = distance(lat, long, this.state.currentUserObject.position[0], this.state.currentUserObject.position[1]);
            let abs_diff = Math.abs(new_distance - this.state.currentDistance);
            if (abs_diff >= 0.1) {
                this.socket.emit('position_changed', {
                    "latitude": lat,
                    "longitude": long,
                    "username": this.state.currentUserObject.username
                })
                this.setState(prevState => ({
                    currentUserObject: {
                        ...prevState.currentUserObject,
                        position: [long, lat]
                    },
                    currentDistance: new_distance
                }), () => {
                    console.log("Absolute difference between new and old position: " + abs_diff);
                })
            }
        });
    };

    add_user = (data) => {
        this.state.users[data.userID] = {
            position: [data.long, data.lat],
            socketID: data.socketID,
            username: data.username
        }
        this.setState({users: this.state.users})
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    startChase = () => {
        this.setState({
            chaseStatus: true
        }, () => {
            this.interval = setInterval(
                () => {
                    this.timeRemaining = this.timeRemaining - 1
                    l.timer(this.state.currentUserObject.username, `Timer: ${this.timeRemaining} \t ChaseStatus: ${this.state.chaseStatus}`)
                    if (this.timeRemaining === 0) {
                        this.setState({
                            chaseStatus: false
                        }, () => {
                            clearInterval(this.interval)
                            this.timeRemaining = 10
                        })
                    }
                },
                1000
            )
        })

    }

    stopChase = () => {
        clearInterval(this.interval);
        // this.chaseStatus = false;
        this.timeRemaining = 10;

        l.log(this.state.currentUserObject.username, `ChaseStats: ${this.state.chaseStatus}`)
    }

    render() {
        let other_users = Object.keys(this.state.users).map((key, index) => (
            <UserObject key={index} id={key} userObject={this.state.users[key]}
                        socket={this.socket} currentUser={this.state.currentUserObject}
                        chaseStatus={this.state.chaseStatus} startChase={this.startChase}
                        stopChase={this.stopChase} timer={this.timeRemaining}/>
        ))
        let current_user = <CurrentUserObject id={this.state.currentUserObject.username}
                                              userObject={this.state.currentUserObject}
                                              socket={this.socket} currentUser={this.state.currentUserObject}
                                              chaseStatus={this.state.chaseStatus} startChase={this.startChase}
                                              stopChase={this.stopChase} timer={this.timeRemaining}/>

        return (
            <View style={styles.container}>
                <View style={{
                    width: 30,
                    backgroundColor: "transparent",
                    position: 'absolute',
                    top: "2%",
                    left: "2%",
                }}>
                    <Text style={{backgroundColor: "red"}}>{this.timeRemaining}</Text>
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
                                           showsUserHeadingIndicator={true} onUpdate={this.updateUserPosition}/>
                    <MapboxGL.Camera zoomLevel={20} defaultSettings={{
                        centerCoordinate: this.state.currentUserObject.position,
                        zoomLevel: 2,
                    }}/>

                    <View>
                        {current_user}
                        {other_users}
                    </View>

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
    }
});
