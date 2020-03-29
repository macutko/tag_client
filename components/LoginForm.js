import {View, Text} from 'react-native';
import * as React from 'react';

export class LoginForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
        }
    }

    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text>LoginForm</Text>
            </View>
        );
    }
}