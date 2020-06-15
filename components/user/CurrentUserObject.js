import * as React from "react";
import {StyleSheet, View} from "react-native";
import MapboxGL from "@react-native-mapbox-gl/maps";
import circle from '@turf/circle';
import {Text} from "react-native-elements";


export class CurrentUserObject extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            beingChased: false,
            chaser: undefined,
        }

    }

    componentDidMount = () => {
        this.props.socket.on('being_chased', (data) => {
            console.log("Being chased");
            this.setState({
                beingChased: true,
                chaser: data.ID,
            })

            this.interval = setInterval(
                () => this.props.updateTimer(this.props.getTimer() - 1 ),
                1000
            );
        })
    }

    componentDidUpdate = () => {
        if (this.props.getTimer() === 0) {
            this.props.socket.emit('lost_chase', {ID: this.state.chaser});
            this.setState({
                chaser: undefined,
                beingChased: false
            })
            console.log("Lost!!")

            this.props.updateTimer(10)
            clearInterval(this.interval);
        }

        console.log(this.props.getTimer())
    }

    componentWillUnmount = () => {
        clearInterval(this.interval);
    }

    chase_broken = () => {
        this.props.socket.emit('escaped_chase', {ID: this.state.chaser});
        this.setState({
            chaser: undefined,
            beingChased: false,
        })
        this.props.updateTimer(10)
        clearInterval(this.interval);
    }

    user_clicked = () => {
        this.chase_broken()
    }

    render() {
        // JURAJ: not sure where to put this
        const catch_zone_config = {
            radius: 0.005,
            options: {steps: 1000, units: 'kilometers'}
        }
        let catch_zone = circle(this.props.currentPosition, catch_zone_config.radius, catch_zone_config.options);

        return (
            <View>




                {/* Catch zone */}
                <MapboxGL.ShapeSource id="catch_zone" shape={catch_zone}>
                    <MapboxGL.FillLayer id='catch_zone_layer' style={mapbox_styles.catch_zone_layer}/>
                </MapboxGL.ShapeSource>

                {/* User */}
                <MapboxGL.PointAnnotation id="User" coordinate={this.props.currentPosition}
                                          onSelected={this.user_clicked}>
                    <View>
                        {/*<MapboxGL.Callout  style={styles.name}/>*/}

                            <View style={styles.circle_in}>
                            </View>



                    </View>
                </MapboxGL.PointAnnotation>
            </View>

        )
    }
}

const mapbox_styles = {
    catch_zone_layer: {
        fillColor: 'rgba(50,50,255, 0.3)',
    }
}

const styles = StyleSheet.create({
    name: {
        width: 100,
        height: 30,
        fontSize: 11
    },
    circle_in: {
        width: 25,
        height: 25,
        borderRadius: 100 / 2,
        backgroundColor: 'rgba(50,50,255, 1)'
    },
    // JURAJ: I left this just as a design of the point annotation, it has nothing to do with the 'catch zone'
})
