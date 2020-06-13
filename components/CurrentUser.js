import * as React from "react";
import {StyleSheet, View} from "react-native";
import MapboxGL from "@react-native-mapbox-gl/maps";
import circle from '@turf/circle';



export class CurrentUser extends React.Component {

    constructor(props) {
        super(props);

        // this.props.socket.on('give_me_your_position')
        console.log(this)
        // this.props.socket.on('give_me_your_position', (data) => {
        //     console.log("here")
        // })
    };
    componentDidMount = () => {

    }

    user_clicked = () => {
        console.log("Current user clicked")
    }
    
    render() {
        // not sure where to put this
        const catch_zone_config = {
            radius: 0.005,
            options: {steps: 100, units: 'kilometers'}
        }
        let catch_zone = circle(this.props.currentPosition, catch_zone_config.radius, catch_zone_config.options);

        return (
            <View>
                {/* Catch zone */}
                <MapboxGL.ShapeSource id="catch_zone" shape={catch_zone}> 
                    <MapboxGL.FillLayer id='catch_zone_layer' style={mapbox_styles.catch_zone_layer}/>
                </MapboxGL.ShapeSource>

                {/* User */}
                <MapboxGL.PointAnnotation id="User" coordinate={this.props.currentPosition} onSelected={this.user_clicked}>
                    <View>
                        {/*<MapboxGL.Callout  style={styles.name}/>*/}
                        <View style={styles.circle_out}>
                            <View style={styles.circle_in}>
                            </View>
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
        width: 8,
        height: 8,
        borderRadius: 100 / 2,
        backgroundColor: 'rgba(50,50,255, 1)'
    },
    // I left this just as a design of the point annotation, it has nothing to do with the 'catch zone'
    circle_out: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        opacity: 0.5,
        width: 12,
        height: 12,
        borderRadius: 100 / 2,
        backgroundColor: 'rgba(50,50,255, 0.4)'
    }
})
