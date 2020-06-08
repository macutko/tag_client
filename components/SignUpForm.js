import {View} from 'react-native';
import * as React from 'react';
import {Button, Input} from 'react-native-elements';
import {axiosInstance} from '../constants/connectionInstances';
import AsyncStorage from '@react-native-community/async-storage';
import GLOBAL_VAR from '../constants/Global'
import {CustomFieldValidator} from "../classes/validator/CustomFieldValidator";
import {CustomExistenceValidator} from "../classes/validator/CustomExistenceValidator";

export class SignUpForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    };

    onEndEditingAfter = (validation_obj) => {
        this.setState(validation_obj)
    }

    onEndEditing = (field_name, event) => {
        const text = event.nativeEvent.text
        let validation_obj = CustomFieldValidator.validate(field_name, text)
        if (validation_obj.isValid && (field_name === GLOBAL_VAR.FIELD_NAME.USERNAME || field_name === GLOBAL_VAR.FIELD_NAME.EMAIL)) {
            CustomExistenceValidator.validate(field_name, text).then(existence_obj => {
                validation_obj = {...validation_obj, ...existence_obj}
                this.onEndEditingAfter(validation_obj)
            }).catch(error => {
                console.log(error)
            })
        } else {
            this.onEndEditingAfter(validation_obj)
        }
    }

    _storeData = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.log("Error saving data!!!")
        }
    };

    submitForm = () => {
        axiosInstance.post('/users/register', {
            firstName: this.state.firstname,
            lastName: this.state.lastname,
            email: this.state.email,
            username: this.state.username,
            password: this.state.password,
        })
            .then(response => {
                console.log("here")
                this._storeData("token", response.data.userDetails.token);

                axiosInstance.post('/location/create', {
                    "latitude": 0,
                    "longitude": 0
                }, {
                    headers: {"Authorization": "Bearer " + response.data.userDetails.token}
                }).then(response => {
                    console.log(response)
                    this.props.login();
                }).catch(error => {
                    console.log(error)
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    render() {
        return (
            <View style={{flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start'}}>


                <Input inputContainerStyle={{width: '75%'}}
                       placeholder='Email'
                       onChangeText={text => this.setState({[GLOBAL_VAR.FIELD_NAME.EMAIL]: text})}
                       autoCompleteType={'email'}
                       onEndEditing={(e) => this.onEndEditing(GLOBAL_VAR.FIELD_NAME.EMAIL, e)}
                       errorMessage={this.state.emailError}
                />
                <Input inputContainerStyle={{width: '75%'}}
                       placeholder='First Name'
                       onChangeText={text => this.setState({[GLOBAL_VAR.FIELD_NAME.FIRSTNAME]: text})}
                       autoCompleteType={'name'}
                       onEndEditing={(e) => this.onEndEditing(GLOBAL_VAR.FIELD_NAME.FIRSTNAME, e)}
                       errorMessage={this.state.firstnameError}
                />
                <Input inputContainerStyle={{width: '75%'}}
                       placeholder='Last Name'
                       onChangeText={text => this.setState({[GLOBAL_VAR.FIELD_NAME.LASTNAME]: text})}
                       autoCompleteType={'name'}
                       onEndEditing={(e) => this.onEndEditing(GLOBAL_VAR.FIELD_NAME.LASTNAME, e)}
                       errorMessage={this.state.lastnameError}
                />
                <Input inputContainerStyle={{width: '75%'}}
                       placeholder='Username'
                       onChangeText={text => this.setState({[GLOBAL_VAR.FIELD_NAME.USERNAME]: text})}
                       autoCompleteType={'username'}
                       textContentType={"username"}
                       onEndEditing={(e) => this.onEndEditing(GLOBAL_VAR.FIELD_NAME.USERNAME, e)}
                       errorMessage={this.state.usernameError}
                />
                <Input inputContainerStyle={{width: '75%'}}
                       placeholder='Password'
                       onChangeText={text => this.setState({[GLOBAL_VAR.FIELD_NAME.PASSWORD]: text})}
                       autoCompleteType={'password'}
                       secureTextEntry={true}
                       textContentType={"newPassword"}
                       password={true}
                       onEndEditing={(e) => this.onEndEditing(GLOBAL_VAR.FIELD_NAME.PASSWORD, e)}
                       errorMessage={this.state.passwordError}
                />

                <Button containerStyle={{width: '75%'}} title="Create Account" type="outline" raised={true}
                        onPress={() => this.submitForm()}
                />


            </View>
        );
    }
}
