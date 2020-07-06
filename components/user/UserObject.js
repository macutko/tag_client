import * as React from "react";
import {StyleSheet, View} from "react-native";
import MapboxGL from "@react-native-mapbox-gl/maps";
import circle from '@turf/circle';
import {distance} from "../../helpers/utils";

const l = require('../../helpers/logging')

export class UserObject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wasToldSwitch: false
        }
        this.distanceLimit = 50;

        if (this.isCurrentUser()) {
            this.props.socket.on('escaped_chase', (data) => {
                this.wasToldSwitch = true
                this.escapedChase = true
                this.props.stopChase()
                this.props.updateChaserDetails(undefined, undefined, 'ran away')
                l.log(this.props.currentUser.username, `On: I escaped a chase to ${data.senderUsername}`)
            })
            this.props.socket.on('initiate_chase', (data,acknowledgementFunction) => {
                this.wasToldSwitch = false
                this.escapedChase = false

                if (!this.props.chaseObject.chaseStatus) {
                    this.props.updateChaserDetails(data.chaserUsername, data.chaserSocketID, `being chased by ${data.chaserUsername}`)

                    l.log(this.props.currentUser.username, `I am being chased by ${data.chaserUsername}`)

                    this.props.startChase()

                    acknowledgementFunction(null, true)

                } else {
                    l.log(this.props.currentUser.username, " Already in chase")
                    acknowledgementFunction(null, false)
                }
            })

            this.props.socket.on('lost_chase', (data) => {
                this.wasToldSwitch = true
                this.props.stopChase()
                l.log(this.props.currentUser.username, `On: I lost a chase to ${data.chaser}`)
                this.props.updateChaserDetails(undefined, undefined, 'you were caught! You lost!')
            })
            this.props.socket.on('won_chase', (data) => {
                this.wasToldSwitch = true
                this.props.stopChase()
                l.log(this.props.currentUser.username, `On: I won a chase with ${data.loserUsername}`)
                this.props.updateChaserDetails(undefined, undefined, 'you caught the target! You win!')
            })
        }
    }

    userClicked = () => {
        if (!this.isCurrentUser()) {
            let distanceBtwnTargetAndUser = Math.abs(distance(this.props.userObject.position[0], this.props.userObject.position[1], this.props.currentUser.position[0], this.props.currentUser.position[1]))

            if ((!this.props.chaseObject.chaseStatus || this.props.timer() <= 0) && distanceBtwnTargetAndUser <= 50) {
                this.props.socket.emit('initiate_chase', {
                    chaserUsername: this.props.currentUser.username,
                    chaserSocketID: this.props.currentUser.socketID,
                    targetUsername: this.props.userObject.username,
                    targetSocketID: this.props.userObject.socketID
                }, (error, response) => {
                    console.log(error,response)
                    if (response === true){
                        this.wasToldSwitch = false
                        this.escapedChase = false
                        this.props.startChase()
                        this.props.updateTarget(this.props.userObject.username, this.props.userObject.socketID)
                    }else if(response === false){
                        l.log(this.props.currentUser.username, `The server rejected our chase. This means the other user is in a chase`)
                    }

                })

            } else {
                //TODO: display this!
                l.log(this.props.currentUser.username, `You are already in a chase or too far away! dist: ${distanceBtwnTargetAndUser}`)
            }
        }
    }
    isCurrentUser = () => {
        return this.props.currentUser.username === this.props.userObject.username
    }
    isTarget = () => {
        return this.props.target.targetUsername === this.props.userObject.username
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((this.props.currentUser.position !== prevProps.currentUser.position || this.props.userObject.position !== prevProps.currentUser.position)
            && this.props.chaseObject.chaseStatus
            && this.props.userObject.username === this.props.chaseObject.chaserUsername) {
            let newDistance = Math.abs(distance(this.props.userObject.position[0], this.props.userObject.position[1], this.props.currentUser.position[0], this.props.currentUser.position[1]))
            if (newDistance >= this.distanceLimit && !this.wasToldSwitch) {
                this.props.socket.emit('escaped_chase', {
                    theOtherSocketID: this.props.chaseObject.chaserSocketID,
                    otherUsername: this.props.chaseObject.chaserUsername,
                    meUsername: this.props.currentUser.username
                })
                this.escapedChase = true;
                l.log(this.props.currentUser.username, `Emiting: I ran away from: ${this.props.chaseObject.chaserUsername}  ! `)
                this.props.updateChaserDetails(undefined, undefined, 'ran away')
                this.props.stopChase()
            } else {
                l.log(this.props.currentUser.username, `Distance isnt big enough! ${newDistance} `)
                l.log(this.props.currentUser.username, `Current limit: ${this.distanceLimit} `)
            }

        }

        if ((this.props.currentUser.position !== prevProps.currentUser.position || this.props.userObject.position !== prevProps.currentUser.position)
            && this.props.chaseObject.chaseStatus
            && this.isTarget()) {

            let newDistance = Math.abs(distance(this.props.userObject.position[0], this.props.userObject.position[1], this.props.currentUser.position[0], this.props.currentUser.position[1]))
            if (newDistance >= this.distanceLimit && !this.wasToldSwitch) {

                this.props.socket.emit('escaped_chase', {
                    theOtherSocketID: this.props.target.targetSocketID,
                    otherUsername: this.props.target.targetUsername,
                    meUsername: this.props.currentUser.username
                })
                this.escapedChase = true;
                l.log(this.props.currentUser.username, `Emiting: The target  ${this.props.target.targetUsername} has escaped! `)
                this.props.updateChaserDetails(undefined, undefined, 'target escaped')
                this.props.stopChase()
            } else {

                l.log(this.props.currentUser.username, `Distance isnt big enough! ${newDistance} `)
                l.log(this.props.currentUser.username, `Current limit: ${this.distanceLimit} `)
            }

        }

        if (!this.escapedChase && this.props.chaseObject.chaseStatus === false && prevProps.chaseObject.chaseStatus === true && this.isCurrentUser() && this.props.chaseObject.chaserUsername !== undefined && !this.wasToldSwitch) {

            this.props.socket.emit('lost_chase', {
                chaserUsername: this.props.chaseObject.chaserUsername,
                chaserSocketID: this.props.chaseObject.chaserSocketID,
                loserUsername: this.props.currentUser.username,
            })
            l.log(this.props.currentUser.username, `Emiting: I was told I lost over to ${this.props.chaseObject.chaserUsername} `)
            this.props.updateChaserDetails(undefined, undefined, 'you were caught! You lost!')

            l.log(this.props.currentUser.username, `Chase has ended!`)
            this.props.stopChase()


        } else if (!this.escapedChase && this.props.chaseObject.chaseStatus === false && prevProps.chaseObject.chaseStatus === true && !this.isCurrentUser() && this.props.chaseObject.chaserUsername === undefined && !this.wasToldSwitch) {

            this.props.socket.emit('won_chase', {
                loserUsername: this.props.userObject.username,
                chaserUsername: this.props.currentUser.username,
                loserSocketID: this.props.userObject.socketID
            })
            l.log(this.props.currentUser.username, `Emiting: I was told I won over ${this.props.userObject.username} `)
            this.props.updateChaserDetails(undefined, undefined, 'you caught the target! You win!')
            this.props.stopChase()
        }
    }

    render() {
        const catch_zone_config = {
            radius: this.distanceLimit / 1000,
            options: {steps: 10000, units: 'kilometers'}
        }
        let catch_zone = circle(this.props.userObject.position, catch_zone_config.radius, catch_zone_config.options);

        return (
            <View>
                {/* Catch zone */}
                <MapboxGL.ShapeSource id={this.props.userObject.username + "_catch_zone"} shape={catch_zone}>
                    <MapboxGL.FillLayer id={this.props.userObject.username + "_catch_zone_layer"}
                                        style={mapbox_styles.catch_zone_layer}/>
                </MapboxGL.ShapeSource>

                {/* User */}
                <MapboxGL.PointAnnotation id={this.props.userObject.username}
                                          coordinate={this.props.userObject.position}
                                          onSelected={this.userClicked}>

                    <View id={this.props.userObject.username+"_view"}
                        style={this.props.id === this.props.currentUser.username ? styles.current_user_inner_circle : styles.circle_in}>
                    </View>

                </MapboxGL.PointAnnotation>
            </View>
        )
    }
}


const
    mapbox_styles = {
        catch_zone_layer: {
            fillColor: 'rgba(207, 0, 15, 0.3)',
        }
    }

const
    styles = StyleSheet.create({
        circle_in: {
            width: 25,
            height: 25,
            borderRadius: 100 / 2,
            backgroundColor: 'rgba(207, 0, 15, 1)'
        },
        current_user_inner_circle: {
            width: 25,
            height: 25,
            borderRadius: 100 / 2,
            backgroundColor: 'rgba(50,50,255, 1)'
        }

    })
