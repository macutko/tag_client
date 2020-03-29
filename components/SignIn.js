import {View, StyleSheet} from 'react-native';
import * as React from 'react';
import {Button, Icon, Overlay, Text} from "react-native-elements";
import {LoginForm} from "./LoginForm";

export class SignIn extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            loginForm: false,
        }
    }

    toggleModal = () => {
        this.setState(state => ({
            isVisible: !state.isVisible,
        }));
    };

    closeModal = () => {
      this.setState(state => ({
          loginForm: false,
          isVisible: false
      }))
    };

    toggleForm = () => {
        this.setState(state => ({
            loginForm: !state.loginForm
        }));
    };

    render() {
        return (
            <View style={styles.mainView}>

                <Button containerStyle={{width: '75%', marginBottom: 10}} title="Sign In!" type="outline"
                        raised={true} onPress={() => this.toggleModal()}/>
                <Button containerStyle={{width: '75%'}} title="Create Account" type="outline" raised={true}/>


                <Overlay isVisible={this.state.isVisible}>
                    {/*<Text onPress={() => this.toggleModal()}>Hello from {String(this.state.isVisible)}</Text>*/}

                    <View style={styles.modalView}>
                        <Icon containerStyle={{alignItems: 'flex-end', justifyContent: 'flex-end'}}
                              onPress={() => this.closeModal()} name='close' type='font-awesome' color='black'
                              size={20}/>


                        <View style={styles.modalBody}>
                            {this.state.loginForm ? <LoginForm/> :
                                <Button onPress={() => this.toggleForm()} containerStyle={{width: '100%'}} title="Using Facebook" type="outline"
                                        raised={true}/>}
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
