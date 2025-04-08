import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Image
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
      
      await AsyncStorage.setItem('@temp_user_role', role);
      
      if (rememberChoice) {
        console.log('Saving role preference');
        await AsyncStorage.setItem('@user_role_preference', role);
      }
      
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
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4299E1" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" backgroundColor='#FFFFFF'/>
      
      <View className="flex-1 p-5">
        <View className="items-center mt-10 mb-5">
          <Image 
            source={require('../assets/images/sinatra-logo.png')}
            className="h-10 w-3/5 mb-5"
            resizeMode="contain"
          />
          <Image 
            source={require('../assets/images/avatar/mascot.png')}
            className="h-52 w-4/5"
            resizeMode="contain"
          />
        </View>

        <Text className="text-3xl font-bold mb-3 text-center text-black">
          Welcome to Sinatra
        </Text>
        <Text className="text-base text-gray-600 mb-10 text-center leading-6">
          Discover How Sinatra Streamlines{'\n'}
          Renewals, Audits, Inspections, and More!
        </Text>
        
        <Text className="text-lg text-black mb-5">
          Select your role to proceed
        </Text>

        <TouchableOpacity 
          className="bg-[#DBEEFF] p-5 rounded-xl mb-4"
          onPress={() => handleRoleSelect('manager')}
          disabled={isSubmitting}
        >
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-lg font-bold text-black mb-1">MANAGER</Text>
              <Text className="text-sm text-gray-600">I'm here for my renewal</Text>
            </View>
            <Text className="text-2xl text-black">→</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="bg-[#F8F0FF] p-5 rounded-xl mb-4"
          onPress={() => handleRoleSelect('employee')}
          disabled={isSubmitting}
        >
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-lg font-bold text-black mb-1">EMPLOYEE</Text>
              <Text className="text-sm text-gray-600">I'm looking to train</Text>
            </View>
            <Text className="text-2xl text-black">→</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
  