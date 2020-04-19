import * as React from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {SignInScreen} from "./screens/SignInScreen";
import {GameScreen} from "./screens/GameScreen";

const Stack = createStackNavigator();

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
        }
        this.log_in = this.log_in.bind(this)
    }

    log_in() {
        this.setState({
            loggedIn: true
        })
    };

    render() {
        return (
            <View style={styles.container}>
                <StatusBar hidden={true}/>
                <NavigationContainer>
                    <Stack.Navigator screenOptions={{headerShown: false}}>
                        {this.state.loggedIn ?


                            <Stack.Screen name="GameScreen" component={GameScreen}/>


                            :


                            <Stack.Screen name="SignInScreen">
                                {props => <SignInScreen login={this.log_in}/>}
                            </Stack.Screen>


                        }
                    </Stack.Navigator>
                </NavigationContainer>
            </View>

        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
