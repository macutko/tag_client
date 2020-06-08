import * as React from "react";
import {StyleSheet, View} from "react-native";
import MapboxGL from "@react-native-mapbox-gl/maps";

export class CurrentUser extends React.Component {

    constructor(props) {
        super(props);
    };
    user_clicked() {
        console.log("here")
    }


    render() {
        return (
            <View>
                <MapboxGL.PointAnnotation id="User" coordinate={this.props.currentPosition} onSelected={this.user_clicked}>
                    <View>
                        {/*<MapboxGL.Callout  style={styles.name}/>*/}
                    <View style={styles.circle_out}>

                        <View style={styles.circle_in}>
                            {/*TODO: make sure the circle scales according to the real world shape of the radius! */}

                        </View>
                    </View>
                    </View>
                </MapboxGL.PointAnnotation>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    name: {
        width: 100,
        height: 30,
        fontSize: 11
    },
    circle_in: {
        width: 10,
        height: 10,
        borderRadius: 100 / 2,
        backgroundColor: 'rgba(50,50,255, 1)'
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