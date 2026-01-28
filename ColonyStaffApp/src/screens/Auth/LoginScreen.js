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
    try {
      setLoading(true);
      // Endpoint: /user/staff-login
      const response = await api.post('/user/staff-login', {
        loginField: loginId, // e.g., "500501"
        password: password, // e.g., "Colony@123"
      });

      // Save to Redux
      dispatch(
        setLogin({
          token: response.data.token,
          user: response.data.user,
          isLoggedIn: true,
        }),
      );
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('isLoggedIn', 'true');

      // navigation.navigate('Scanner');
    } catch (error) {
      console.log('Login Error:', error.response?.data);
      Alert.alert(
        'Login Failed',
        error.response?.data?.message || 'Check your ID and password',
      );
    } finally {
      setLoading(false);
    }
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
