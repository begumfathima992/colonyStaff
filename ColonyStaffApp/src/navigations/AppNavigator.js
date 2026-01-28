import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';


// Import your screens
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen'; // <-- 1. Make sure this is imported
import ScannerScreen from '../screens/Main/ScannerScreen';
import TransactionScreen from '../screens/Main/TransactionScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  return (
    <NavigationContainer>
  <Stack.Navigator>
  {isLoggedIn ? (
    // MAIN STACK - Staff sees this after login
    <>
      <Stack.Screen name="Scanner" component={ScannerScreen} />
      <Stack.Screen name="Transaction" component={TransactionScreen} />
    </>
  ) : (
    // AUTH STACK
    <>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </>
  )}
</Stack.Navigator>
    </NavigationContainer>
  );
}