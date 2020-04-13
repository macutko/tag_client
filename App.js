import * as React from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {SignIn} from "./components/SignIn";
import {Welcome} from "./components/Welcome";

const Stack = createStackNavigator();

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar hidden={true}/>
                <NavigationContainer>
                    <Stack.Navigator screenOptions={{headerShown: false}}>
                        {this.state.loggedIn ? <Stack.Screen name="Welcome" component={Welcome}/> :
                            <Stack.Screen name="Sign In" component={SignIn}/>}
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
