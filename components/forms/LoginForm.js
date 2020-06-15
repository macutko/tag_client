import {View} from 'react-native';
import * as React from 'react';
import {Button, Input} from "react-native-elements";
import {axiosInstance} from "../../helpers/connectionInstances";
import AsyncStorage from '@react-native-community/async-storage';

export class LoginForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
        }
    }

    onChangeText = (text, name) => {
        this.setState({
            [name]: text
        });
    };

    _storeData = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value);
            console.log(value);
        } catch (error) {
            console.log("Error saving data!!!")
        }
    };

    submitForm = () => {
        axiosInstance.post('/users/authenticate', {
            username: this.state.username,
            password: this.state.password,
        })
            .then(response => {
                // TODO: if logged in - got to game Dashboard
                console.log("Logged in!");
                this._storeData("token", response.data.token);
                this.props.login()
                // TODO: save token as well and set the timer to refresh it
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 401) {
                    console.log("User not registered") // TODO display to user!
                } else {
                    console.log("Havent accounted for this error code") // TODO: handle more error codes
                }
            });
    };

    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>

                <Input inputContainerStyle={input_style}
                       inputStyle={input_text_style}
                       placeholder='username'
                       onChangeText={text => this.onChangeText(text, "username")}
                       autoCompleteType={'username'}
                />
                <Input inputContainerStyle={input_style}
                       inputStyle={input_text_style}
                       placeholder='Password'
                       onChangeText={text => this.onChangeText(text, "password")}
                       autoCompleteType={'password'}
                       secureTextEntry={true}
                       textContentType={"password"}
                       password={true}
                />
                <Button containerStyle={{width: '75%'}} title="Log In" type="outline" raised={true}
                        onPress={() => this.submitForm()}
                />

            </View>
        );
    }
}

const input_style = {
    width: '75%',
};
const input_text_style = {
    fontSize: 15,
};
