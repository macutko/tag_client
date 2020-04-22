import {StyleSheet, View} from 'react-native';
import * as React from 'react';
import {Text} from "react-native-elements";

export class HomeScreen extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (<View>
            <Text h3>HEY from home</Text>
        </View>)
    }
}

const styles = StyleSheet.create({
    mainView: {flex: 1, alignItems: 'center', justifyContent: 'center'},
    modalView: {flex: 1, margin: 5},
    modalBody: {flex: 1, alignItems: 'center', justifyContent: 'center'}
});
