import { AppRegistry, Platform } from 'react-native';
import App from './App';

AppRegistry.registerComponent("TAGv2", () => App);

if (Platform.OS === 'web') {
  const rootTag = document.getElementById('root') || document.getElementById('main');
  AppRegistry.runApplication('TAG_v2', { rootTag });
}
