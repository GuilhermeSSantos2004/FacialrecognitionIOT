import { AppRegistry } from 'react-native';
import App from './App';
import { expo } from './app.json';
import { enableScreens } from 'react-native-screens';
enableScreens();

AppRegistry.registerComponent(expo.name, () => App);