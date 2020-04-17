import {View} from 'react-native';
import * as React from 'react';
import {Button, Icon, Input} from 'react-native-elements';
import axiosConfig from '../constants/axiosConfig';

export class SignUpForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    };

    // componentDidMount () {
    //     axiosConfig.post('http://192.168.0.187:80/services/create_user/', {
    //         first_name: "Mato",
    //         last_name: "Grad",
    //         email: "mwm@mwm.sk",
    //         username: "matias",
    //         password: "686tnt",
    //     })
    //         .then(function (response) {
    //             console.log(response);
    //         })
    //         .catch(function (error) {
    //             console.log(error);
    //         });
    //
    //
    // };

    onChangeText = (text, name) => {
        this.setState({
            [name]: text
        });
        // TODO: if name is username check if the username is still available
    };

    submitForm = () => {
        axiosConfig.post('/services/create_user/', {
                    first_name: this.state.first_name,
                    last_name: this.state.last_name,
                    email: this.state.email,
                    username:this.state.username,
                    password: this.state.password,
                })
                    .then(function (response) {
                        console.log(response);
                    })
                    .catch(function (error) {
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