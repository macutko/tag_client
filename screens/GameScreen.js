import {StyleSheet, View} from 'react-native';
import * as React from 'react';
import {Text} from "react-native-elements";

export class GameScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoginVisible: false,
            loginForm: false,
            isSignUpVisible: false,
        }
    }

    render() {
        return (<View>
            <Text h1>HEY</Text>
        </View>)
    }
}

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     backgroundColor: '#fff',
    // },
    mainView: {flex: 1, alignItems: 'center', justifyContent: 'center'},
    modalView: {flex: 1, margin: 5},
    modalBody: {flex: 1, alignItems: 'center', justifyContent: 'center'}
});
