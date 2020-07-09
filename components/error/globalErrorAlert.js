import {Alert} from "react-native";
import * as React from "react";


export class GlobalErrorAlert extends React.Component {

    constructor(props) {
        super(props);
    }

    render = () => {
        return (
            Alert.alert("WHOOPS!",
                'Something went wrong. Developer team was informed about the problem.',
                [
                    {text: 'OK', onPress: () => this.resetErrorBoundary},
                ]
            )
        )
    }
}
