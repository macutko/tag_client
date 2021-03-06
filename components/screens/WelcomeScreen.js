import {View, StyleSheet} from 'react-native';
import * as React from 'react';
import {Button} from "react-native-elements";
import {requestPermission} from "../../helpers/utils";
import {FormOverlay} from "../forms/FormOverlay";
import {LoginForm} from "../forms/LoginForm";
import {SignUpForm} from "../forms/SignUpForm";

export class WelcomeScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showLogin: false,
            showSignUp: false,
        };
    }

    toggleLoginModal = () => {
        this.setState(state => ({
            showLogin: !state.showLogin,
        }));
    };

    toggleSignUpModal = () => {
        this.setState(state => ({
            showSignUp: !state.showSignUp,
        }));
    };

    closeModal = () => {
        this.setState({
            showLogin: false,
            showSignUp: false,
        })
    };

    handleLoggin = () => {
        this.closeModal();
        requestPermission().then(r => {
            if (r === false) {
                // this.props.navigation.navigate('SignInScreen');
                //TODO: give some alert box
                console.log("I need permission, doing nothing!")
            } else {
                // TODO: check for location turned on
                this.props.navigation.navigate('UserNavigation');
            }
        })
    };

    render = () => {
        return (
            <View style={styles.mainView}>

                <Button containerStyle={{width: '75%', marginBottom: 10}} title="Log In" type="outline"
                        raised={true} onPress={() => this.toggleLoginModal()}/>


                <Button containerStyle={{width: '75%'}} title="Sign Up" type="outline" raised={true}
                        onPress={() => this.toggleSignUpModal()}/>


                <FormOverlay
                    elt={<LoginForm login={this.handleLoggin}/>}
                    visible={this.state.showLogin}
                    close={this.closeModal}/>

                <FormOverlay
                    elt={<SignUpForm login={this.handleLoggin}/>}
                    visible={this.state.showSignUp}
                    close={this.closeModal}/>

            </View>

        );
    }
}

const styles = StyleSheet.create({
    mainView: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});
