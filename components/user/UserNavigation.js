import * as React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {GameScreen} from "../../screens/GameScreen";
import {RoomsScreen} from "../../screens/RoomsScreen";
import {SettingsScreen} from "../../screens/SettingsScreen";

const Tab = createMaterialBottomTabNavigator();

export class UserNavigation extends React.Component {
    render = () => {
        return (
            <Tab.Navigator
                initialRouteName="Game"
                activeColor="#e91e63"
                labelStyle={{ fontSize: 12 }}
                style={{ backgroundColor: 'tomato' }}
            >
                <Tab.Screen
                    name="Game"
                    component={GameScreen}
                    options={{
                        tabBarLabel: 'Game',
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="home" color={color} size={26} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Rooms"
                    component={RoomsScreen}
                    options={{
                        tabBarLabel: 'Rooms',
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="bell" color={color} size={26} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Settings"
                    component={SettingsScreen}
                    options={{
                        tabBarLabel: 'Settings',
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="account" color={color} size={26} />
                        ),
                    }}
                />
            </Tab.Navigator>
        );
    }
}
