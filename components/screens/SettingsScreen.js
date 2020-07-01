import {SectionList, StyleSheet, Text, View} from "react-native";
import * as React from "react";
import {removeFromMemory} from '../../helpers/utils'

import { Button } from 'react-native-elements';

const section_account = {
    title: 'Account',
    data: [
        {
            title: 'Change password'
        },
        {
            title: 'Edit profile'
        },
    ]
}

export class SettingsScreen extends React.Component {


    constructor(props) {
        super(props);
    }

    handleLogout = () => {
        removeFromMemory(["token", "username"]).then(() => {
            this.props.navigation.navigate('WelcomeScreen')
        })
    }

    render = () => {
        return (
            <View style={styles.container}>
                <View>
                    <SectionList
                        sections={[
                            section_account,
                        ]}
                        renderItem={({item}) => <Text style={styles.item}>{item.title}</Text>}
                        renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
                        keyExtractor={(item, index) => index}
                    />
                </View>
                <Button
                    title="LOGOUT"
                    type="solid"
                    raised={true}
                    buttonStyle={styles.button}
                    onPress={() => this.handleLogout()}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    sectionHeader: {
        marginTop: 5,
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 4,
        fontSize: 17,
        fontWeight: 'bold',
        borderBottomWidth: 0.3,
        borderBottomColor: '#bbb'
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
        backgroundColor: '#fff',
        borderColor: 'red',
        borderBottomWidth: 0.3,
        borderBottomColor: '#bbb'
    },
    button: {
        marginTop: 10,
        backgroundColor: '#FD0A0A',
        height: 45
    }
})
