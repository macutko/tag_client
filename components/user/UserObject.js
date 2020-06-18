import * as React from "react";
import {StyleSheet, View} from "react-native";
import MapboxGL from "@react-native-mapbox-gl/maps";
import circle from '@turf/circle';

const l = require('../../helpers/logging')

export class UserObject extends React.Component {
    constructor(props) {
        super(props);
        this.chaserUsername = undefined
        this.chaserSocketID = undefined

    }

    componentDidMount() {
        this.props.socket.on('initiate_chase', (data) => {
            this.chaserUsername = data.chaserUsername
            this.chaserSocketID = data.chaserSocketID

            l.log(this.props.currentUser.username, `I am being chased by ${data.chaserUsername}`)

            this.props.startChase()
            // TODO: send nae nae if already in chase
        })
        // this.props.socket.on('won_chase',(data)=>{
        //     this.props.stopChase()
        //     l.log(this.props.currentUser.username, `I was told I won!`)
        // })
    }

    userClicked = () => {
        l.log(this.props.currentUser.username, ` This is my chase status ${this.props.chaseStatus}`)
        if (!this.props.chaseStatus) {
            this.props.socket.emit('initiate_chase', {
                chaserUsername: this.props.currentUser.username,
                chaserSocketID: this.props.currentUser.socketID,
                targetUsername: this.props.userObject.username,
                targetSocketID: this.props.userObject.socketID
            })
            this.props.startChase()
        } else {
            l.log(this.props.currentUser.username, `You are already in a chase`)
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.chaseStatus === false && prevProps.chaseStatus === true){
                    l.log(this.props.currentUser.username, `Chase has ended!`)
        }

        // if (this.props.timer === 0) {
        //     if (this.props.inChase && !(this.state.chaserUsername === undefined)) {
        //         // this.props.socket.emit('lost_chase',{
        //         //     chaserUsername: this.state.chaserUsername,
        //         //     chaserSocketID: this.state.chaserSocketID,
        //         //     loserUsername: this.props.currentUser.username,
        //         // })
        //         l.log(this.props.currentUser.username, `I lost a chase!`)
        //     }
        //     this.setState({
        //         chaserUsername: undefined,
        //         chaserSocketID: undefined
        //     })
        //     this.props.stopChase()
        // }
    }

    render() {
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
                                          onSelected={this.userClicked}>

                    <View
                        style={this.props.id === this.props.currentUser.username ? styles.current_user_inner_circle : styles.circle_in}>
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
