import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';

export default function RoleScreen() {
  const router = useRouter();
  const { user, isSignedIn, isLoading } = useAuth();
  const [rememberChoice, setRememberChoice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if user is already logged in
  useEffect(() => {
    if (isSignedIn) {
      router.replace('/(tabs)');
    }
  }, [isSignedIn]);

  const handleRoleSelect = async (role: 'manager' | 'employee') => {
    try {
      setIsSubmitting(true);
      console.log('Selected role:', role);
      
      // Always save the current selection temporarily
      await AsyncStorage.setItem('@temp_user_role', role);
      
      // If remember choice is checked, save it permanently
      if (rememberChoice) {
        console.log('Saving role preference');
        await AsyncStorage.setItem('@user_role_preference', role);
      }
      
      // Navigate to the appropriate login screen based on role
      if (role === 'manager') {
        router.replace('/auth/managerLogin');
      } else {
        router.replace('/auth/login');
      }
    } catch (error) {
      console.error('Error selecting role:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isSignedIn) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4299E1" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor='#ECF6FF'/>
      
      <View style={styles.content}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Please select your role to continue:</Text>
        
        <TouchableOpacity 
          style={styles.roleButton}
          onPress={() => handleRoleSelect('manager')}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.roleButtonText}>Manager</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.roleButton}
          onPress={() => handleRoleSelect('employee')}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.roleButtonText}>Employee</Text>
          )}
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
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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
  