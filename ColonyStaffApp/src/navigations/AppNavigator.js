import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ScannerScreen from '../screens/Main/ScannerScreen';
import TransactionScreen from '../screens/Main/TransactionScreen';
import { setLogin } from '../store/slices/authSlice';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const loggedIn = await AsyncStorage.getItem('isLoggedIn');

        if (token && loggedIn === 'true') {
          dispatch(setLogin({
            token,
            user: null, // optional: fetch profile later
          }));
        }
      } catch (e) {
        console.log('Auth restore error', e);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkLogin();
  }, []);

  if (checkingAuth) return null; // or splash screen

  return (
    <NavigationContainer>
      <Stack.Navigator>
            {/* <Stack.Screen options={{headerShown:false}} name="Scanner" component={ScannerScreen} />
            <Stack.Screen options={{headerShown:false}} name="Transaction" component={TransactionScreen} /> */}

        {isLoggedIn ? (
          <>
            <Stack.Screen options={{headerShown:false}} name="Scanner" component={ScannerScreen} />
            <Stack.Screen options={{headerShown:false}} name="Transaction" component={TransactionScreen} />
            <Stack.Screen options={{headerShown:false}} name="Login" component={LoginScreen} />

          </>
        ) : (
          <>
            <Stack.Screen options={{headerShown:false}} name="Login" component={LoginScreen} />
            <Stack.Screen options={{headerShown:false}} name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
