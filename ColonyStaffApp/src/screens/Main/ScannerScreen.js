import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Alert } from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native';
import Colors from '../../res/Colors';

const ScannerScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isScanned, setIsScanned] = useState(false);
  const isFocused = useIsFocused(); // Prevents "Duplicate CameraView" by managing lifecycle
  const device = useCameraDevice('back');
  
  // Animation for the "TV Laser" line
  const scanAnim = useRef(new Animated.Value(0)).current;

  // 1. Handle Permissions
  useEffect(() => {
    const checkPermission = async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
      
      if (status !== 'granted') {
        Alert.alert("Camera Denied", "We need camera access to scan QR codes.");
      }
    };
    checkPermission();
  }, []);

  // 2. TV Line Animation Logic
  useEffect(() => {
    if (isFocused && !isScanned) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, {
            toValue: 240,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(scanAnim, {
            toValue: 0,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scanAnim.stopAnimation();
    }
  }, [isFocused, isScanned]);

  // 3. QR Code Scanner Configuration
  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      // "Predicting" a scan: Logic fires immediately upon detection
      if (codes.length > 0 && !isScanned && isFocused) {
        setIsScanned(true); 
        const qrValue = codes[0].value;
        
        console.log("QR Data Captured:", qrValue);

        // Success Feedback: Brief delay before navigation for better UX
        setTimeout(() => {
          navigation.navigate('Transaction', { qrData: qrValue });
          // Reset scanned state after navigation so user can scan again later
          setTimeout(() => setIsScanned(false), 2000);
        }, 500);
      }
    }
  });

  if (!hasPermission) return <View style={styles.center}><Text>Waiting for permission...</Text></View>;
  if (!device) return <View style={styles.center}><Text>No camera detected.</Text></View>;

  return (
    <View style={styles.container}>
      {/* 4. The Camera Engine */}
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused && !isScanned} // Critical: shuts down when navigating away
        codeScanner={codeScanner}
      />

      {/* 5. UI Overlay */}
      <View style={styles.overlay}>
        <View style={[styles.frame, isScanned && styles.frameSuccess]}>
          <Animated.View 
            style={[
              styles.scanLine, 
              { transform: [{ translateY: scanAnim }] }
            ]} 
          />
        </View>
        <Text style={styles.instructionText}>
          {isScanned ? "Code Captured!" : "Align Colony QR Code"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  frame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#00FF00',
    borderRadius: 12,
    overflow: 'hidden',
  },
  frameSuccess: {
    borderColor: 'yellow', // Feedback when scan is "predicted"
    borderWidth: 4,
  },
  scanLine: {
    width: '100%',
    height: 3,
    backgroundColor: '#00FF00',
    shadowColor: '#00FF00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 8,
  },
  instructionText: {
    color: '#FFF',
    marginTop: 30,
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 8
  }
});

export default ScannerScreen;