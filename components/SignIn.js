import {View, StyleSheet} from 'react-native';
import * as React from 'react';
import {Button, Icon, Overlay} from "react-native-elements";
import {LoginForm} from "./LoginForm";
import {SignUpForm} from "./SignUpForm";

export class SignIn extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoginVisible: false,
            loginForm: false,
            isSignUpVisible: false,
        }
    }

    toggleLoginModal = () => {
        this.setState(state => ({
            isLoginVisible: !state.isLoginVisible,
        }));
    };

    toggleSignUpModal = () => {
        this.setState(state => ({
            isSignUpVisible: !state.isSignUpVisible,
        }));
    };

    closeModal = () => {
        this.setState(state => ({
            loginForm: false,
            isLoginVisible: false,
            isSignUpVisible: false,
        }))
    };


    toggleLoginForm = () => {
        console.log(this.state.loginForm);
        this.setState(state => ({
            loginForm: !state.loginForm
        }));
        console.log(this.state.loginForm);
    };


    render() {
        return (
            <View style={styles.mainView}>

                <Button containerStyle={{width: '75%', marginBottom: 10}} title="Sign In!" type="outline"
                        raised={true} onPress={() => this.toggleLoginModal()}/>
                <Button containerStyle={{width: '75%'}} title="Create Account" type="outline" raised={true}
                       onPress={() => this.toggleSignUpModal()}
                />


                <Overlay isVisible={this.state.isLoginVisible}>
                    {/*<Text onPress={() => this.toggleModal()}>Hello from {String(this.state.isLoginVisible)}</Text>*/}

                    <View style={styles.modalView}>
                        <Icon containerStyle={{alignItems: 'flex-end', justifyContent: 'flex-end', padding:10}}
                              onPress={() => this.closeModal()} name='close' type='font-awesome' color='black'
                              size={20}/>


                        <View style={styles.modalBody}>
                            {this.state.loginForm ? <LoginForm/> :
                                <Button onPress={() => this.toggleLoginForm()} containerStyle={{width: '100%'}}
                                        title="Using Facebook" type="outline"
                                        raised={true}/>}
                        </View>
                    </View>


                </Overlay>

                <Overlay isVisible={this.state.isSignUpVisible}>
                    {/*<Text onPress={() => this.toggleModal()}>Hello from {String(this.state.isLoginVisible)}</Text>*/}

                    <View style={styles.modalView}>
                        <Icon containerStyle={{alignItems: 'flex-end', justifyContent: 'flex-end', padding:10}}
                              onPress={() => this.closeModal()} name='close' type='font-awesome' color='black'
                              size={20}/>


                        <View style={styles.modalBody}>
                            <SignUpForm/>
                        </View>
                    </View>


                </Overlay>


            </View>

        );
    }
}

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     backgroundColor: '#fff',
    // },
    mainView: {flex: 1, alignItems: 'center', justifyContent: 'center'},
    modalView: {flex: 1, margin: 5},
    modalBody: {flex: 1, alignItems: 'center', justifyContent: 'center'}
});
