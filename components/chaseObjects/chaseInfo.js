import * as React from "react";
import {Overlay, Text} from "react-native-elements";
import {View, StyleSheet} from "react-native";

export class ChaseInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View>
                <Text style={styles.timer}>{this.props.timer}</Text>
            </View>


        )
    }
}

const styles = StyleSheet.create({
    // Flex to fill, position absolute,
    // Fixed left/top, and the width set to the window width
    timer: {
        fontSize: 200,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'red',
    },

});
