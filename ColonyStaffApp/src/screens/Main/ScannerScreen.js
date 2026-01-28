import React, { useEffect, useState, useRef } from 'react';
import { 
  View, Text, StyleSheet, Animated, Easing, Alert, 
  useWindowDimensions, TouchableOpacity, SafeAreaView, StatusBar 
} from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ScannerScreen = () => {
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(false);
  const [isScanned, setIsScanned] = useState(false);
  
  const isFocused = useIsFocused();
  const device = useCameraDevice('back');
  const scanAnim = useRef(new Animated.Value(0)).current;

  // Tablet Optimization: Scale the UI based on device width
  const isTablet = width > 600;
  const SCANNER_SIZE = isTablet ? 450 : width * 0.75;

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    if (isFocused && !isScanned) {
      // Smoother "Breath" animation for the laser line
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, {
            toValue: SCANNER_SIZE - 10,
            duration: 2200,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            useNativeDriver: true,
          }),
          Animated.timing(scanAnim, {
            toValue: 0,
            duration: 2200,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scanAnim.stopAnimation();
    }
  }, [isFocused, isScanned, SCANNER_SIZE]);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      if (codes.length > 0 && !isScanned && isFocused) {
        setIsScanned(true);
        const qrValue = codes[0].value;
        
        // Provide immediate visual feedback for the staff member
        setTimeout(() => {
          navigation.navigate('Transaction', { qrData: qrValue });
          // Short reset delay so the scanner is ready for the next customer later
          setTimeout(() => setIsScanned(false), 2000);
        }, 300);
      }
    }
  });

  const handleLogout = async () => {
  // 1. (Optional) If you were using any other state management (Redux/Zustand), clear it here.
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('isLoggedIn');
  // 2. Reset the navigation stack to the Login screen
  navigation.reset({
    index: 0,
    routes: [{ name: 'Login' }], // Ensure 'Login' matches your stack navigator name
  });
};

  if (!hasPermission) return <View style={styles.center}><Text style={styles.darkText}>Camera Access Required</Text></View>;
  if (!device) return <View style={styles.center}><Text style={styles.darkText}>No Camera Found</Text></View>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused && !isScanned}
        codeScanner={codeScanner}
      />

      {/* Layered UI Overlay */}
      <View style={styles.fullOverlay}>
        
        {/* Header Area */}
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => handleLogout()} 
              style={styles.backButton}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <Text style={styles.backText}>✕</Text>
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.headerTitle}>LOYALTY SCANNER</Text>
              <View style={styles.badge}><Text style={styles.badgeText}>STAFF ONLY</Text></View>
            </View>
          </View>
        </SafeAreaView>

        {/* Center Scanner Area */}
        <View style={styles.mainActionArea}>
          <View style={styles.textGroup}>
            <Text style={styles.mainPrompt}>
              {isScanned ? "Processing..." : "Scan Customer QR"}
            </Text>
            <Text style={styles.subPrompt}>Hold the tablet steady over the code</Text>
          </View>

          <View style={[styles.boxContainer, { width: SCANNER_SIZE, height: SCANNER_SIZE }]}>
            {/* Corner Bracket Accents (Custom Shapes) */}
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />

            {/* The Laser Line */}
            <Animated.View 
              style={[
                styles.laserLine, 
                { transform: [{ translateY: scanAnim }], width: SCANNER_SIZE - 20 }
              ]} 
            />

            {/* Success Visual Confirmation */}
            {isScanned && (
              <View style={styles.scanSuccess}>
                <View style={styles.checkCircle}>
                  <Text style={styles.checkIcon}>✓</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Footer / Instruction */}
        <View style={styles.footerContainer}>
           <Text style={styles.versionTag}>System Active • High Precision Mode</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000',marginTop:30 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  darkText: { color: '#000', fontSize: 18, fontWeight: '600' },
  fullOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)', // Darken background to make laser pop
    justifyContent: 'space-between'
  },
  safeArea: { flex: 0 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  backText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  titleContainer: { flex: 1,alignSelf:'center' },
  headerTitle: { color: '#FFF', fontSize: 22, fontWeight: '900', letterSpacing: 1.5,textAlign:'center' },
  badge: { 

    backgroundColor: '#FFD700', 
    alignSelf: 'center', 
    paddingHorizontal: 8, 
    borderRadius: 4, 
    marginTop: 4 
  },
  badgeText: { color: '#000', fontSize: 10, fontWeight: 'bold' },
  
  mainActionArea: {
    flex: 1,
    justifyContent: 'center',
    marginTop:-50,
    alignItems: 'center',
  },
  textGroup: {
    alignItems: 'center',
    marginBottom: 40,
  },
  mainPrompt: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  subPrompt: {
    color: '#CCC',
    fontSize: 18,
    marginTop: 8,
  },
  boxContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  laserLine: {
    height: 4,
    backgroundColor: '#00FF00',
    position: 'absolute',
    top: 0,
    borderRadius: 2,
    shadowColor: '#00FF00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 15,
  },
  // Custom Corners
  corner: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderColor: '#00FF00',
    borderWidth: 6,
  },
  tl: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 24 },
  tr: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 24 },
  bl: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 24 },
  br: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 24 },
  
  scanSuccess: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 255, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
  },
  checkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#00FF00',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#FFF'
  },
  checkIcon: { fontSize: 60, color: '#FFF', fontWeight: 'bold' },
  
  footerContainer: {
    paddingBottom: 40,
    alignItems: 'center'
  },
  versionTag: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase'
  }
});

export default ScannerScreen;