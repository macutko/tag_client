import * as React from "react";
import {StyleSheet, View} from "react-native";
import MapboxGL from "@react-native-mapbox-gl/maps";
import circle from '@turf/circle';

export class OtherUserObject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    user_clicked = () => {
        if (this.props.getChaseStatus()) {
            console.log("Already in chase!")
        } else {
            this.props.updateChaseStatus()
            this.props.socket.emit('initiate_chase', {
                socketID: this.props.userObject.socketID, // socket ID of the user on the map
                username: this.props.currentUser // username of the player playing this game
            })
            this.props.startTimer()
        }
    }
    componentWillUnmount = () => {
        this.props.cancelTimer()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.timer === 0) {
            if (this.state.chaser === undefined) {
                console.log("I won but I was already told!")

            } else {
                this.props.socket.emit('won_chase', {
                    loserID: this.props.userObject.socketID,
                    chaserUsername: this.props.currentUser,
                    loserUsername: this.props.userObject.username
                });
                this.setState({
                    chaser: undefined,
                })
            }
            this.props.cancelTimer()
            this.props.updateChaseStatus()
        }

        console.log(this.props.currentUser + ' : ' + this.props.timer)
    }

    componentDidMount = () => {
        this.props.socket.on('won_chase', (data) => {
            console.log("I was told I won over " + data.loser)
            this.setState({
                chaser: undefined,
            })
            this.props.updateChaseStatus()
        })


    }

    render() {
        // not sure where to put this
        const catch_zone_config = {
            radius: 0.005,
            options: {steps: 100, units: 'kilometers'}
        }
        let catch_zone = circle(this.props.userObject.position, catch_zone_config.radius, catch_zone_config.options);

        return (
            <View>
                {/* Catch zone */}
                <MapboxGL.ShapeSource id={this.props.id + "_catch_zone"} shape={catch_zone}>
                    <MapboxGL.FillLayer id={this.props.id + "_catch_zone_layer"}
                                        style={mapbox_styles.catch_zone_layer}/>
                </MapboxGL.ShapeSource>

                {/* User */}
                <MapboxGL.PointAnnotation id={this.props.id} coordinate={this.props.userObject.position}
                                          onSelected={this.user_clicked}>

                    <View style={styles.circle_in_users}>
                    </View>

                </MapboxGL.PointAnnotation>
            </View>
        )
    }
}


const mapbox_styles = {
    catch_zone_layer: {
        fillColor: 'rgba(207, 0, 15, 0.3)',
    }
}

const styles = StyleSheet.create({
    circle_in: {
        width: 10,
        height: 10,
        borderRadius: 100 / 2,
        backgroundColor: 'rgba(207, 0, 15, 1)'
    },
    circle_in_users: {
        width: 25,
        height: 25,
        borderRadius: 100 / 2,
        backgroundColor: 'rgba(207, 0, 15, 1)'
    },

})
