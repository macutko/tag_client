import {StyleSheet, View} from 'react-native';
import * as React from 'react';
import MapboxGL from "@react-native-mapbox-gl/maps";

MapboxGL.setAccessToken('pk.eyJ1IjoibWFjdXRrbyIsImEiOiJjazlmbTgzbXAwY25tM2V0MDJ0eHgxbTBwIn0.np9dHqzUS0HEKSlbejOlbQ');

export class GameScreen extends React.Component {

    renderAnnotations() {
        return (
            <MapboxGL.PointAnnotation
                key="pointAnnotation"
                id="pointAnnotation"
                coordinate={[11.254, 43.772]}>
                <View style={styles.annotationContainer}>
                    <View style={styles.annotationFill} />
                </View>
                <MapboxGL.Callout title="An annotation here!" />
            </MapboxGL.PointAnnotation>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <MapboxGL.MapView
                    styleURL={MapboxGL.StyleURL.TrafficDay}
                    zoomLevel={15}
                    centerCoordinate={[11.256, 43.77]}
                    style={styles.container}>
                    {this.renderAnnotations()}
                </MapboxGL.MapView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    map: {
        height: 400,
        marginTop: 80
    },
    annotationContainer: {
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 15
    },
    annotationFill: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'blue',
        transform: [{ scale: 0.6 }]
    }
});















//
//
//
//
//     _retrieveKey = async (key) => {
//         try {
//             const value = await AsyncStorage.getItem(key);
//             if (value !== null) {
//                 // We have data!!
//                 console.log(value);
//             } else {
//                 console.log("got nothing!")
//             }
//         } catch (error) {
//             console.log(error)
//         }
//     };
//
//     constructor(props) {
//         super(props);
//         this.state = {
//         };
//         this._retrieveKey("refresh_key")
//     }
//
//     render() {
//         return (
//             <View>
//                 <Text h1>HEY</Text>
//                 <MapboxGL.MapView
//                     zoomLevel={14}
//                     centerCoordinate={[-122.084900, 37.42629]}
//                     styleURL={MapboxGL.StyleURL.Street}
//                     style={styles.modalView}
//                 />
//
//
//             </View>)
//     }
// }
//
// const styles = StyleSheet.create({
//     // container: {
//     //     flex: 1,
//     //     backgroundColor: '#fff',
//     // },
//     mainView: {flex: 1, alignItems: 'center', justifyContent: 'center'},
//     modalView: {flex: 1, margin: 5,backgroundColor:'#a1b7c8'},
//     modalBody: {flex: 1, alignItems: 'center', justifyContent: 'center'}
// });
