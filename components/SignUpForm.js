import {View} from 'react-native';
import * as React from 'react';
import {Button, Input} from 'react-native-elements';
import axiosConfig from '../constants/axiosConfig';
import AsyncStorage from '@react-native-community/async-storage';

export class SignUpForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    };


    validate_email = (text) => {
        console.log(text);
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(text) === false) {
            console.log("Email is Not Correct");
            this.setState({email: text});
            return false;
        } else {
            this.setState({email: text});
            console.log("Email is Correct");
            return true;
        }
    };

    onChangeText = (text, name) => {
        this.setState({
            [name]: text.toLowerCase()
        });
        // TODO: use the validate function to check if the email entered is a valid type
        // TODO: if name is username check if the username is still available
        // TODO: password check strenght (might need to get the server involved)
        // TODO: make the input text smaller
    };
    _storeData = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.log("Error saving data!!!")
        }
    };

    submitForm = () => {
        axiosConfig.post('/services/create_user/', {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            username: this.state.username,
            password: this.state.password,
        })
            .then(response => {
                this._storeData("access_key", response.data.token.access);
                this._storeData("refresh_key", response.data.token.refresh);
            })
            .catch(error =>  {
                console.log(error);
            });
    };

    render() {
        return (
            <View style={{flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start'}}>


                <Input inputContainerStyle={{width: '75%'}}
                       placeholder='Email'
                       onChangeText={text => this.onChangeText(text, "email")}
                       autoCompleteType={'email'}
                />
                <Input inputContainerStyle={{width: '75%'}}
                       placeholder='First Name'
                       onChangeText={text => this.onChangeText(text, "first_name")}
                       autoCompleteType={'name'}
                />
                <Input inputContainerStyle={{width: '75%'}}
                       placeholder='Last Name'
                       onChangeText={text => this.onChangeText(text, "last_name")}
                       autoCompleteType={'name'}
                />
                <Input inputContainerStyle={{width: '75%'}}
                       placeholder='Username'
                       onChangeText={text => this.onChangeText(text, "username")}
                       autoCompleteType={'username'}
                       textContentType={"username"}
                />
                <Input inputContainerStyle={{width: '75%'}}
                       placeholder='Password'
                       onChangeText={text => this.onChangeText(text, "password")}
                       autoCompleteType={'password'}
                       secureTextEntry={true}
                       textContentType={"newPassword"}
                       password={true}
                />

                <Button containerStyle={{width: '75%'}} title="Create Account" type="outline" raised={true}
                        onPress={() => this.submitForm()}
                />


            </View>
        );
    }
}