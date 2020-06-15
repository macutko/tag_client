import {Icon, Overlay} from "react-native-elements";
import {StyleSheet, View} from "react-native";
import * as React from "react";

export class FormOverlay extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {

        return (
            <Overlay isVisible={this.props.visible}>

                <View style={styles.modalView}>
                    <Icon containerStyle={{alignItems: 'flex-end', justifyContent: 'flex-end', padding: 10}}
                          onPress={() => this.props.close()} name='close' type='font-awesome' color='black'
                          size={20}/>


                    <View style={styles.modalBody}>

                        {this.props.elt}

                    </View>
                </View>


            </Overlay>
        )
    }
}

const styles = StyleSheet.create({
    modalView: {flex: 1, margin: 5},
    modalBody: {flex: 1, alignItems: 'center', justifyContent: 'center'}
});