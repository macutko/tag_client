import {StyleSheet, View} from 'react-native';
import * as React from 'react';
import MapboxGL from "@react-native-mapbox-gl/maps";
import Geolocation from '@react-native-community/geolocation';
import config from "../constants/config";
import {UserObject} from "../components/user/UserObject";
import {CurrentUserObject} from "../components/user/CurrentUserObject";
import * as io from "socket.io-client";
import {Text} from "react-native-elements";
import {distance, getUsername, retrieveKeys} from "../helpers/utils";


MapboxGL.setAccessToken(config.mapbox_key);
const l = require('../helpers/logging');
import {YellowBox} from 'react-native'

YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
])

export class GameScreen extends React.Component {

    constructor(props) {
        super(props);
        this.interval = undefined
        this.endTime = 0;
        this.socket = undefined
        this.state = {
            chaseObject: {
                chaseStatus: false,
                chaserUsername: undefined,
                chaserSocketID: undefined,
            },
            currentDistance: 0,
            displayTimer: 10,
            users: {},
            currentUserObject: {
                position: [-73.98330688476561, 40.76975180901395],
                socketID: undefined,
                username: undefined
            },
            targetObject: {
                targetUsername: undefined,
                targetSocketID: undefined
            }
        };


        MapboxGL.setTelemetryEnabled(false);

        retrieveKeys()
            .then((token) => {
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
                                this.updateUserPosition()
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


    }


    componentDidMount() {
        this.updateUserPosition();
        getUsername().then((data) => {
            this.state.currentUserObject.username = data
        })
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

                    })
                }
            }, error => console.error(error), {enableHighAccuracy: true, timeout: 20000, maximumAge: 10000}
        );
    };

    add_user = (data) => {
        this.state.users[data.userID] = {
            position: [data.long, data.lat],
            socketID: data.socketID,
            username: data.username
        }
        this.setState({users: this.state.users})
    }

    timeRemaining = () => {
        return this.endTime - Date.now()
    }

    startChase = () => {
        this.endTime = Date.now() + 10000;
        this.setState(prevState => ({
            chaseObject: {
                ...prevState.chaseObject,
                chaseStatus: true,
            }
        }), () => {
            console.log("chase started")
            if (this.interval !== undefined) {
                clearInterval(this.interval)
            }
            this.interval = setInterval(
                () => {
                    this.setState({
                        displayTimer: this.state.displayTimer - 1
                    })
                    if (this.timeRemaining() <= 0) {

                        this.setState(prevState => ({
                            chaseObject: {
                                ...prevState.chaseObject,
                                chaseStatus: false,
                            },
                            displayTimer: 10
                        }), () => {
                            l.timer(this.state.currentUserObject.username, `END: \t ChaseStatus: ${this.state.chaseObject.chaseStatus}`)
                        })
                        clearInterval(this.interval)
                        this.endTime = undefined;
                    }
                },
                1000
            )
        })

    }

    stopChase = () => {
        if (this.interval !== undefined) {
            clearInterval(this.interval)
        }
        this.endTime = undefined;
        this.setState(prevState => ({
            chaseObject: {
                ...prevState.chaseObject,
                chaseStatus: false,
            },
            displayTimer: 10
        }), () => {
            clearInterval(this.interval)
        })
        this.updateTarget()

    }
    updateChaserDetails = (chaserUsername = undefined, chaserSocketID = undefined) => {
        this.setState(prevState => ({
            chaseObject: {
                ...prevState.chaseObject,
                chaserUsername: chaserUsername,
                chaserSocketID: chaserSocketID,
            }
        }))
    }
    updateTarget = (targetName = undefined, targetSocketID = undefined) => {
        this.setState(prevstate => ({
            targetObject: {
                ...prevstate.targetObject,
                targetUsername: targetName,
                targetSocketID: targetSocketID
            }
        }))
    }

    render() {


        let other_users = Object.keys(this.state.users).map((key, index) => (
            <UserObject key={index} id={key} userObject={this.state.users[key]}
                        socket={this.socket} currentUser={this.state.currentUserObject}
                        chaseObject={this.state.chaseObject} startChase={this.startChase}
                        stopChase={this.stopChase} timer={this.timeRemaining}
                        updateChaserDetails={this.updateChaserDetails} updateTarget={this.updateTarget}
                        target={this.state.targetObject}/>
        ))
        let current_user = <CurrentUserObject id={this.state.currentUserObject.username}
                                              userObject={this.state.currentUserObject}
                                              socket={this.socket}
                                              currentUser={this.state.currentUserObject}
                                              chaseObject={this.state.chaseObject} startChase={this.startChase}
                                              stopChase={this.stopChase} timer={this.timeRemaining}
                                              updateChaserDetails={this.updateChaserDetails}
                                              updateTarget={this.updateTarget} target={this.state.targetObject}
        />

        return (
            <View style={styles.container}>
                <Text style={{backgroundColor: "red"}}>{this.state.displayTimer}</Text>
                <View style={{
                    width: 30,
                    backgroundColor: "transparent",
                    position: 'absolute',
                    top: "2%",
                    left: "2%",
                }}>

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
                        {this.state.currentUserObject.username !== undefined && this.socket !== undefined && current_user}
                        {this.state.currentUserObject.username !== undefined && this.socket !== undefined && other_users}
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
