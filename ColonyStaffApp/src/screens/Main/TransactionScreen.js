import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
} from 'react-native';

const TransactionScreen = ({ route, navigation }) => {
  const { width } = useWindowDimensions();
  const { qrData } = route.params || {};
  
  // Safe parsing logic
  let parsedData = {};
  try {
    parsedData = typeof qrData === 'string' ? JSON.parse(qrData) : qrData;
  } catch (e) {
    parsedData = { name: "Unknown User", phone: "N/A", membership: "N/A" };
  }

  const [amount, setAmount] = useState('');
  const isTablet = width > 600;

  const onSave = () => {
    if (!amount || isNaN(amount)) {
      alert('Please enter a valid transaction amount');
      return;
    }

    //Write API CODE HERE

    // Logic for saving...
    alert(`Success: ₹${amount} added for ${parsedData?.name}`);
    navigation.goBack(); // Back to home or scanner
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={[styles.mainCard, { width: isTablet ? 600 : width - 32 }]}>
            
            {/* Header: User Profile Summary */}
            <View style={styles.profileHeader}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>
                  {parsedData?.name?.charAt(0) || 'U'}
                </Text>
              </View>
              <Text style={styles.userName}>{parsedData?.name || 'Customer Name'}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>ACTIVE MEMBER</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Info Grid */}
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.label}>PHONE NUMBER</Text>
                <Text style={styles.value}>{parsedData?.phone || '---'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.label}>MEMBERSHIP ID</Text>
                <Text style={styles.value}>{parsedData?.membership || '---'}</Text>
              </View>
            </View>

            {/* Amount Input Area */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Enter Order Amount</Text>
              <View style={styles.amountWrapper}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  placeholder="0.00"
                  placeholderTextColor="#999"
                  keyboardType="decimal-pad"
                  autoFocus={true}
                  value={amount}
                  onChangeText={setAmount}
                  style={styles.hugeInput}
                />
              </View>
              <Text style={styles.hintText}>Points will be calculated automatically</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.saveButton, !amount && styles.disabledButton]} 
                onPress={onSave}
                disabled={!amount}
              >
                <Text style={styles.saveButtonText}>Confirm & Award Points</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5', // Soft neutral background
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  mainCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 32,
    // Professional Shadow
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20 },
      android: { elevation: 10 },
    }),
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#d71b6b',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1C1E',
  },
  statusBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 8,
  },
  statusText: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 10,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  infoItem: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    color: '#7C8089',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1C1E',
  },
  inputContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    padding: 24,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  inputLabel: {
    textAlign: 'center',
    fontSize: 14,
    color: '#555',
    fontWeight: '600',
    marginBottom: 10,
  },
  amountWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencySymbol: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1A1C1E',
    marginRight: 8,
  },
  hugeInput: {
    fontSize: 48,
    fontWeight: '800',
    color: '#d71b6b',
    minWidth: 150,
    textAlign: 'left',
    padding: 0,
  },
  hintText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginTop: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 30,
    gap: 12,
  },
  saveButton: {
    flex: 2,
    backgroundColor: '#d71b6b',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F1F3F5',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#495057',
    fontSize: 18,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#EAA8C4',
  }
});

export default TransactionScreen;