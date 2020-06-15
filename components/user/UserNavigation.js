import * as React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {GameScreen} from "../../screens/GameScreen";
import {RoomsScreen} from "../../screens/RoomsScreen";
import {SettingsScreen} from "../../screens/SettingsScreen";
import {Icon} from "react-native-elements";

const Tab = createMaterialBottomTabNavigator();

export class UserNavigation extends React.Component {
    render = () => {
        return (

            <Tab.Navigator
                initialRouteName="Game"
                activeTintColor="#ffffff"
                labelStyle={{ fontSize: 12 }}
                style={{ backgroundColor: 'tomato' }}
            >
                <Tab.Screen
                    name="Game"
                    component={GameScreen}
                    options={{
                        tabBarLabel: 'Game',
                        tabBarIcon: ({ color }) => (
                            <Icon name='map-marker' type='font-awesome' color={color} size={26}/>
                        ),
                    }}
                />
                <Tab.Screen
                    name="Rooms"
                    component={RoomsScreen}
                    options={{
                        tabBarLabel: 'Rooms',
                        tabBarIcon: ({ color }) => (
                            <Icon name="bars" type='font-awesome' color={color} size={26}/>
                        ),
                    }}
                />
                <Tab.Screen
                    name="Settings"
                    component={SettingsScreen}
                    options={{
                        tabBarLabel: 'Settings',
                        tabBarIcon: ({ color }) => (
                            <Icon name="cog" type='font-awesome' color={color} size={26}/>
                        ),
                    }}
                />
            </Tab.Navigator>
        );
    }
}
