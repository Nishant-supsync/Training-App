import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CheckCircle } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const router = useRouter();
  const { forgotPassword } = useAuth();

  // Handle password reset request
  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await forgotPassword(email);
      setIsSuccess(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      Alert.alert('Request Failed', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigate back to login screen
  const handleBackToLogin = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" backgroundColor='#ECF6FF'/>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-6">
          <TouchableOpacity 
            className="mb-5 w-10 h-10 justify-center items-center" 
            onPress={handleBackToLogin}
          >
            <ArrowLeft size={24} color="#1A2B3C" />
          </TouchableOpacity>

          <Text className="text-2xl font-bold text-[#1A2B3C] mb-3">Forgot Password</Text>
          <Text className="text-base text-[#4A5568] mb-8">
            Enter your email address and we'll send you instructions to reset your password.
          </Text>
          
          {isSuccess ? (
            <View className="flex-1 items-center justify-center px-6 py-10">
              <View className="mb-6">
                <CheckCircle size={64} color="#6FCF97" />
              </View>
              <Text className="text-2xl font-bold text-[#1A2B3C] mb-3">Email Sent!</Text>
              <Text className="text-base text-[#4A5568] text-center mb-8">
                We've sent a password reset link to your email address. Please check your inbox.
              </Text>
              <TouchableOpacity 
                className="bg-[#2C7BE5] rounded-lg p-4 items-center justify-center w-full" 
                onPress={handleBackToLogin}
              >
                <Text className="text-white text-base font-semibold">Back to Login</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="mb-6">
              <View className="mb-6">
                <Text className="text-sm font-medium text-[#4A5568] mb-2">Email</Text>
                <TextInput
                  className="bg-[#F7FAFC] border border-[#E2E8F0] rounded-lg p-4 text-base text-[#1A2B3C]"
                  placeholder="your.email@example.com"
                  placeholderTextColor="#A0AEC0"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              
              <TouchableOpacity 
                className="bg-[#2C7BE5] rounded-lg p-4 items-center justify-center mb-4"
                onPress={handleResetPassword}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-white text-base font-semibold">Send Reset Link</Text>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="border border-[#E2E8F0] rounded-lg p-4 items-center justify-center" 
                onPress={handleBackToLogin}
              >
                <Text className="text-[#4A5568] text-base font-semibold">Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}