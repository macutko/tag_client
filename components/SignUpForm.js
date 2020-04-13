import {View} from 'react-native';
import * as React from 'react';
import {Input} from "react-native-elements";
import axiosConfig from '../constants/axiosConfig';

export class SignUpForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
        }
    };

    componentDidMount () {
        axiosConfig.post('/services/create_user/', {
            first_name: "Mato",
            last_name: "Grad",
            email: "mwm@mwm.sk",
            username: "matias",
            password: "686tnt",
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
            <View style={{flex: 1, alignItems: 'flex-start', justifyContent: 'center'}}>

                <Input
                    placeholder='BASIC INPUT'
                />


            </View>
        );
    }
}