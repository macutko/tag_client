import * as React from "react";
import {StyleSheet, View} from "react-native";
import MapboxGL from "@react-native-mapbox-gl/maps";

export class UserObject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    };

    render() {
        return (
            <View>
                <MapboxGL.PointAnnotation id={this.props.id} coordinate={this.props.coordinate}
                                          >
                    <View style={styles.circle_out}>
                        <View style={styles.circle_in_users}>
                            {/*// TODO: make sure the circle scales according to the real world shape of the radius!*/}
                        </View>
                    </View>
                </MapboxGL.PointAnnotation>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    circle_in: {
        width: 10,
        height: 10,
        borderRadius: 100 / 2,
        backgroundColor: 'rgba(50,50,255, 1)'
    },
    circle_in_users: {
        width: 10,
        height: 10,
        borderRadius: 100 / 2,
        backgroundColor: 'rgba(50,255,255, 1)'
    },
    circle_out: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        opacity: 0.5,
        width: 25,
        height: 25,
        borderRadius: 100 / 2,
        backgroundColor: 'rgba(50,50,255, 0.4)'
    }
})