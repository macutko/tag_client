import {StyleSheet, View} from 'react-native';
import * as React from 'react';
import {Text} from "react-native-elements";
import {AsyncStorage} from 'react-native';

export class GameScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
        this._retrieveKey("refresh_key")
    }
    _retrieveKey = async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                // We have data!!
                console.log(value);
            }else{
                console.log("got nothing!")
            }
        } catch (error) {
            console.log(error)
        }
    };

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
