import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';

export function RoleSelectionScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [rememberChoice, setRememberChoice] = useState(false);

  const handleRoleSelect = async (role: 'manager' | 'employee') => {
    console.log('Selected role:', role);
    
    // Always save the current selection temporarily
    await AsyncStorage.setItem('@temp_user_role', role);
    
    // If remember choice is checked, save it permanently
    if (rememberChoice) {
      console.log('Saving role preference');
      await AsyncStorage.setItem('@user_role_preference', role);
    }
    
    // Direct employees to their certificates page, managers to categories
    if (role === 'employee') {
      // For employees, go directly to their certificates
      router.push({
        pathname: '/certificate-section/employee/1', // Using ID 1 for the current user
        params: { 
          role,
          name: user?.name || 'Your' // Use the user's name if available
        }
      } as any);
    } else {
      // For managers, show the categories selection first
      router.push({
        pathname: '/certificate-section/categories',
        params: { role }
      } as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.content}>
        <Text style={styles.title}>Select Your Role</Text>
        <Text style={styles.subtitle}>To view certificates, please select your role:</Text>
        
        <TouchableOpacity 
          style={styles.roleButton}
          onPress={() => handleRoleSelect('manager')}
        >
          <Text style={styles.roleButtonText}>Manager</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.roleButton}
          onPress={() => handleRoleSelect('employee')}
        >
          <Text style={styles.roleButtonText}>Employee</Text>
        </TouchableOpacity>
        
        <View style={styles.rememberContainer}>
          <TouchableOpacity 
            style={styles.checkbox}
            onPress={() => setRememberChoice(!rememberChoice)}
          >
            {rememberChoice && <Text style={styles.checkIcon}>✓</Text>}
          </TouchableOpacity>
          <Text style={styles.rememberText}>Remember my choice</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 30,
    textAlign: 'center',
  },
  roleButton: {
    backgroundColor: '#4299E1',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  roleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    color: '#4299E1',
  },
  rememberText: {
    color: '#4A5568',
  },
});

export default RoleSelectionScreen;
