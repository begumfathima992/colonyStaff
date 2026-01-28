import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const AppInput = (props) => (
  <TextInput 
    style={styles.input} 
    placeholderTextColor="#999"
    {...props} 
  />
);

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 2,
    borderBottomColor: '#1A237E',
    paddingVertical: 10,
    fontSize: 24,
    color: '#000',
    marginBottom: 10,
  }
});

export default AppInput;