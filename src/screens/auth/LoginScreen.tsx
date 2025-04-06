import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { ArrowLeft } from 'lucide-react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { login, isSignedIn, isLoading } = useAuth();

  // Redirect if user is already logged in
  useEffect(() => {
    if (isSignedIn) {
      router.replace('/(tabs)');
    }
  }, [isSignedIn]);

  // Handle login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      setIsSubmitting(true);

      // Get the selected role from AsyncStorage
      const selectedRole = await AsyncStorage.getItem('@temp_user_role');

      if (!selectedRole) {
        // If no role is selected, go back to role selection
        router.replace('/role');
        return;
      }

      await login(email, password);

      // Check if login was successful by checking if user is set
      const userJson = await AsyncStorage.getItem('@user');
      if (userJson) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Login Failed', 'Unable to log in. Please try again.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigate to forgot password screen
  const handleForgotPassword = () => {
    router.push('/auth/forgot-password');
  };

  // Add handler for back button
  const handleBack = () => {
    router.replace('/role');
  };

  if (isLoading || isSignedIn) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className='bg-[#E9F5FF] mb-4'>

        <View className="flex-col ">
          {/* Back button */}
          <View className="px-4 py-2">
            <TouchableOpacity onPress={handleBack}>
              <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Login Header */}
          <View className="px-6">
            <Text className="text-3xl font-bold text-black mb-6">Log In</Text>
          </View>
          {/* <View className="w-10" /> */}
        </View>

        <View className="pr-4 pb-0 flex-row items-center ">
          <Image
            source={require('@/assets/images/avatar/delo_wave.png')}
            className="h-28 w-32 mr-4"
            resizeMode="contain"
          />

          <View className="flex-1 flex justify-center items-start bg-white p-4 rounded-2xl">
            <Text className="text-base text-[#1A2B3C]">
              Welcome to Sinatra! Please enter your email and password.
            </Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Email Input */}
          <View className="mb-4">
            <Text className="text-gray-500 mb-2">Email Address</Text>
            <View className="bg-white rounded-xl border border-gray-200 px-3 py-3.5">
              <View className="flex-row items-center">
                <Ionicons name="mail-outline" size={20} color="#718096" />
                <TextInput
                  className="flex-1 text-black ml-2"
                  placeholder="Enter your email address"
                  placeholderTextColor="#A0AEC0"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>
          </View>

          {/* Password Input */}
          <View className="mb-8">
            <Text className="text-gray-500 mb-2">Password</Text>
            <View className="bg-white rounded-xl border border-gray-200 px-3 py-3.5">
              <View className="flex-row items-center">
                <View className="justify-center" style={{ height: 24, width: 24 }}>
                  <Ionicons name="lock-closed-outline" size={20} color="#718096" />
                </View>
                <TextInput
                  className="flex-1 text-black ml-2 py-0"
                  placeholder="Enter your password"
                  placeholderTextColor="#A0AEC0"
                  secureTextEntry={!isPasswordVisible}
                  value={password}
                  onChangeText={setPassword}
                  style={{ lineHeight: 24 }}
                />
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                  <Ionicons
                    name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#718096"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            className={`rounded-xl py-4 items-center justify-center mb-4 ${isSubmitting ? 'bg-blue-300' : 'bg-[#60A5FA]'}`}
            onPress={handleLogin}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white text-base font-semibold">Login</Text>
            )}
          </TouchableOpacity>

          {/* Forgot Password */}
          <TouchableOpacity
            className="items-center mb-8"
            onPress={handleForgotPassword}
          >
            <Text className="text-blue-500 text-base">Forgot Password?</Text>
          </TouchableOpacity>

          {/* Terms of Service */}
          <View className="items-center justify-end mt-auto mb-4">
            <Text className="text-gray-500 text-center text-sm">
              By logging in to Sinatra, you agree to our{' '}
              <Text className="text-blue-500">Terms of Service</Text> and{' '}
              <Text className="text-blue-500">Privacy Policy</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
