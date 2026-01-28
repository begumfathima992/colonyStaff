import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { setLogin } from '../../store/slices/authSlice';
import AppButton from '../../components/AppButton';
import AppInput from '../../components/AppInput';
import Colors from '../../res/Colors';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async () => {
  const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "loginField": `${loginId}`,
  "password": `${password}`
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://unesoteric-nonconversably-isabell.ngrok-free.dev/user/staff-login", requestOptions)
  .then((response) => response.text())
  .then((result) => {
    const res = JSON.parse(result);
    console.log('Login Response:', res);
    if (res.success === true) {
      const token = res?.data?.access_token;
      AsyncStorage.setItem('token', token);
      AsyncStorage.setItem('isLoggedIn', 'true');
      dispatch(setLogin({ token, user: null }));
    } else {
      Alert.alert('Login Failed', res?.message || 'Invalid credentials');
    }
  })
  .catch((error) => console.error(error));
   
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Colony Staff Portal</Text>

      <AppInput
        placeholder="Staff ID (e.g. 500501)"
        value={loginId}
        keyboardType="number-pad" // Better for numeric IDs
        onChangeText={setLoginId}
      />

      <AppInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />

      <AppButton title="Login" onPress={handleLogin} />

      <TouchableOpacity
        onPress={() => navigation.navigate('Register')}
        style={styles.link}
      >
        <Text style={styles.linkText}>New Staff? Register here</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: Colors.white,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 40,
    textAlign: 'center',
  },
  link: { marginTop: 25, alignItems: 'center' },
  linkText: { color: Colors.primary, fontSize: 14 },
});

export default LoginScreen;
