import {View, StyleSheet} from 'react-native';
import * as React from 'react';
import {Button} from "react-native-elements";
import {FormOverlay} from "../components/FormOverlay";
import {LoginForm} from "../components/LoginForm";
import {SignUpForm} from "../components/SignUpForm";

export class SignInScreen extends React.Component {

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
        this.setState(state => ({
            showLogin: false,
            showSignUp: false,
        }))
    };

    handleLoggin = () => {
        this.closeModal();
        this.props.navigation.navigate('GameScreen');
    };

    render = () => {
        var LoginModal = this.state.showLogin ? <FormOverlay elt={<LoginForm login={this.handleLoggin}/>} visible={this.state.showLogin} close={this.closeModal}/> : null;
        var SignUpModal = this.state.showSignUp ? <FormOverlay elt={<SignUpForm/>} visible={this.state.showSignUp} close={this.closeModal}/> : null;
        return (
            <View style={styles.mainView}>

                <Button containerStyle={{width: '75%', marginBottom: 10}} title="Sign In!" type="outline"
                        raised={true} onPress={() => this.toggleLoginModal()}/>


                <Button containerStyle={{width: '75%'}} title="Create Account" type="outline" raised={true}
                        onPress={() => this.toggleSignUpModal()}
                />

                {LoginModal}
                {SignUpModal}

            </View>

        );
    }
}

const styles = StyleSheet.create({
    mainView: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});