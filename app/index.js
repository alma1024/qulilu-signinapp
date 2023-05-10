import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './home';
import SignupScreen from './signup';

const Stack = createNativeStackNavigator();

//   navigationBar={null} navigationBarHidden={true}
export default function App() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} navigationBarHidden />
        <Stack.Screen name="Signup" component={SignupScreen} navigationBarHidden />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
