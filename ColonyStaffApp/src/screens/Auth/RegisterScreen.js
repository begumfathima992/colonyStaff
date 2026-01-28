import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import AppButton from '../../components/AppButton';
import AppInput from '../../components/AppInput';
import Colors from '../../res/Colors';
import api from '../../services/api';

const RegisterScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: ''
  });

 const handleRegister = async () => {
  try {
    setLoading(true);
    // Endpoint: /user/staff-register
    // Payload: { name, phone, password }
    const response = await api.post('/user/staff-register', {
      name: formData.name,
      phone: formData.phone,
      password: formData.password
    });

    Alert.alert("Success", "Staff registered! Please login.");
    navigation.navigate('Login');
  } catch (error) {
    console.log("Register Error:", error.response?.data);
    Alert.alert("Registration Failed", "Could not create staff account.");
  } finally {
    setLoading(false);
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Staff Account</Text>
      
      <AppInput 
        placeholder="Full Name"
        value={formData.name}
        onChangeText={(text) => setFormData({...formData, name: text})}
      />
      
      <AppInput 
        placeholder="Phone Number (e.g. 07123...)"
        value={formData.phone}
        keyboardType="phone-pad"
        onChangeText={(text) => setFormData({...formData, phone: text})}
      />
      
      <AppInput 
        placeholder="Password"
        value={formData.password}
        secureTextEntry
        onChangeText={(text) => setFormData({...formData, password: text})}
      />

      <AppButton title="Register" onPress={handleRegister} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 25, backgroundColor: Colors.white, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.primary, marginBottom: 30 }
});

export default RegisterScreen;