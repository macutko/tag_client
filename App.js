import * as React from 'react';
import 'react-native-gesture-handler';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {AppState} from 'react-native'
import {WelcomeScreen} from "./screens/WelcomeScreen";
import {UserNavigation} from "./components/user/UserNavigation";

const Stack = createStackNavigator();

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appState: AppState.currentState
        };
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }
    _handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            console.log('App has come to the foreground!')
        }
        this.setState({appState: nextAppState});
    };

    render() {
        return (
            <NavigationContainer>
                <StatusBar hidden={true}/>
                <Stack.Navigator screenOptions={{headerShown: false}} >
                    <Stack.Screen name="WelcomeScreen" component={WelcomeScreen}/>
                    <Stack.Screen name="UserNavigation" component={UserNavigation}/>
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}
