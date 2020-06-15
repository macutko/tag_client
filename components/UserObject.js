import * as React from "react";
import {StyleSheet, View} from "react-native";
import MapboxGL from "@react-native-mapbox-gl/maps";
import circle from '@turf/circle';

export class UserObject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    user_clicked = () => {
        this.props.socket.emit('initiate_chase', {
            user: this.props.id,
            playerLocation: this.props.player_location,
            socketID: this.props.socketID
        })
        this.interval = setInterval(
            () => this.props.updateTimer(this.props.getTimer() - 1 ),
            1000
        );
    }
    componentDidUpdate = () => {
        if (this.props.getTimer() === 0) {
            this.props.socket.emit('won_chase', {ID: this.state.chaser});
            this.setState({
                chaser: undefined,
                beingChased: false
            })
            console.log("WON!!")
            this.props.updateTimer(10)
            clearInterval(this.interval);
        }

        console.log(this.props.getTimer())
    }
    componentWillUnmount = () => {
        clearInterval(this.interval);
    }

    render() {
        // not sure where to put this
        const catch_zone_config = {
            radius: 0.005,
            options: {steps: 100, units: 'kilometers'}
        }
        let catch_zone = circle(this.props.coordinate, catch_zone_config.radius, catch_zone_config.options);

        return (
            <View>
                {/* Catch zone */}
                <MapboxGL.ShapeSource id={this.props.id + "_catch_zone"} shape={catch_zone}> 
                    <MapboxGL.FillLayer id={this.props.id + "_catch_zone_layer"} style={mapbox_styles.catch_zone_layer}/>
                </MapboxGL.ShapeSource>

                {/* User */}
                <MapboxGL.PointAnnotation id={this.props.id} coordinate={this.props.coordinate} onSelected={this.user_clicked}>

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
