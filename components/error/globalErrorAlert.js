import {StyleSheet, Text, View} from "react-native";
import * as React from "react";
import {Button} from "react-native-elements";

export const GlobalErrorAlert = ({ resetErrorBoundary }) => {
    return (
        <View style={[styles.container]}>
            <View>
                <Text> Something went wrong: </Text>
                <Button title="try Again" onPress={resetErrorBoundary} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "center",
        alignContent: "center",
        paddingHorizontal: 12,
    },
});
