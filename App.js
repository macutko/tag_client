import * as React from 'react';
import 'react-native-gesture-handler';
import {StatusBar, StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {SignInScreen} from "./screens/SignInScreen";
import {GameScreen} from "./screens/GameScreen";

const Stack = createStackNavigator();

export default function App(){
    return (
        <NavigationContainer>
            <StatusBar hidden={true}/>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="SignInScreen" component={SignInScreen}/>
                <Stack.Screen name="GameScreen" component={GameScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}
