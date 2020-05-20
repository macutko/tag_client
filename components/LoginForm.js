import {View} from 'react-native';
import * as React from 'react';
import {Button, Input} from "react-native-elements";
import axiosConfig from "../constants/axiosConfig";
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

    _storeData = async (key,value) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.log("Error saving data!!!")
        }
    };
    _retrieveKey = async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                // We have data!!
                console.log(value);
            }
        } catch (error) {
            // Error retrieving data
        }
    };

    submitForm = () => {
        axiosConfig.post('/services/api/token/', {
            username: this.state.username,
            password: this.state.password,
        })
            .then(response => {
                // TODO: if logged in - got to game Dashboard
                console.log("Logged in!");
                this._storeData("access_key", response.data.access);
                this._storeData("refresh_key", response.data.refresh);
                console.log(this.props);
                this.props.login()
                // TODO: save token as well and set the timer to refresh it
            })
            .catch(error => {
                if (error.response.status === 401){
                    console.log("User not registered") // TODO display to user!
                }
                else{
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
