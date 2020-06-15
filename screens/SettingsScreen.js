import {Text, View} from "react-native";
import * as React from "react";

export class SettingsScreen extends React.Component {

    constructor(props) {
        super(props);
    }

    render = () => {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>Settings!</Text>
            </View>

        );
    }
}
