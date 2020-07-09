import {StyleSheet, View} from 'react-native';
import * as React from 'react';
import MapboxGL from "@react-native-mapbox-gl/maps";
import Geolocation from '@react-native-community/geolocation';
import config from "../../constants/config";
import {UserObject} from "../user/UserObject";
import {CurrentUserObject} from "../user/CurrentUserObject";
import * as io from "socket.io-client";
import {Text} from "react-native-elements";
import {distance, getUsername, getFromMemory, removeFromMemory} from "../../helpers/utils";


MapboxGL.setAccessToken(config.mapbox_key);
const l = require('../../helpers/logging');
import {YellowBox} from 'react-native'
import {ChaseInfo} from "../chaseObjects/chaseInfo";

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
                lastOutcome: undefined,
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

        getFromMemory("token")
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
                        .on('user_disconnected', (data) => {
                            this.remove_user(data.userID)
                        })
                        .on('initial_location_status', (data) => {

                            for (let key in data.locations) {
                                // TODO: make sure that the current user doesnt add itself
                                if (data.locations[key].socketID !== this.state.currentUserObject.socketID) {
                                    this.add_user(data.locations[key])
                                }

                            }

                        })
                        .on('disconnect', (data) => {
                            removeFromMemory(["token", "username"]).then(() => {
                                this.props.navigation.navigate('WelcomeScreen')
                            })
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
    remove_user = (userID) => {
        delete this.state.users[userID]
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
                    if (this.timeRemaining() <= -1) {

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
    updateChaserDetails = (chaserUsername = undefined, chaserSocketID = undefined, outcome = undefined) => {
        this.setState(prevState => ({
            chaseObject: {
                ...prevState.chaseObject,
                chaserUsername: chaserUsername,
                chaserSocketID: chaserSocketID,
                lastOutcome: outcome,
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

        let chaseInfo = (<View style={styles.chaseContainer}>
            <ChaseInfo timer={this.state.displayTimer}
                       chaseObject={this.state.chaseObject} />
        </View>)

        let other_users = Object.keys(this.state.users).map((key, index) => (
            <UserObject key={index} id={key} userObject={this.state.users[key]}
                        socket={this.socket} currentUser={this.state.currentUserObject}
                        chaseObject={this.state.chaseObject} startChase={this.startChase}
                        stopChase={this.stopChase} timer={this.timeRemaining}
                        updateChaserDetails={this.updateChaserDetails} updateTarget={this.updateTarget}
                        target={this.state.targetObject} updateDistance={this.updateDistance}/>
        ))
        let current_user = <CurrentUserObject id={this.state.currentUserObject.username}
                                              userObject={this.state.currentUserObject}
                                              socket={this.socket}
                                              currentUser={this.state.currentUserObject}
                                              chaseObject={this.state.chaseObject} startChase={this.startChase}
                                              stopChase={this.stopChase} timer={this.timeRemaining}
                                              updateChaserDetails={this.updateChaserDetails}
                                              updateTarget={this.updateTarget} target={this.state.targetObject}
                                              updateDistance={this.updateDistance}
        />

        return (
            <View id="container" style={styles.container}>
                <View id="mapContainer" style={styles.mapContainer}>
                    <MapboxGL.MapView
                        styleURL={MapboxGL.StyleURL.Street}
                        style={styles.map}
                        logoEnabled={false}
                        compassEnabled={true}
                        compassViewPosition={1}
                        attributionEnabled={false}
                    >
                        <MapboxGL.UserLocation visible={false}
                                               showsUserHeadingIndicator={true} onUpdate={this.updateUserPosition}/>
                        <MapboxGL.Camera zoomLevel={15} centerCoordinate={this.state.currentUserObject.position}
                                         defaultSettings={{
                                             centerCoordinate: this.state.currentUserObject.position,
                                             zoomLevel: 4,
                                         }}/>

                        <View>

                            {this.state.currentUserObject.username !== undefined && this.socket !== undefined && current_user}
                            {this.state.currentUserObject.username !== undefined && this.socket !== undefined && other_users}
                        </View>

                    </MapboxGL.MapView>
                </View>

                {this.state.chaseObject.chaseStatus ? chaseInfo : undefined}
                <Text id="status" style={styles.status}>Current chase status: {this.state.chaseObject.lastOutcome}</Text>
            </View>
        )
            ;
    }
}

const styles = StyleSheet.create({
    status: {
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'left',
        color: 'red',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 26,
        paddingTop:10,
    },
    map: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    mapContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    chaseContainer: {
        opacity: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%'
    }
});
