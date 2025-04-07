// import React, { useState, useEffect } from 'react';
// import { 
//   StyleSheet, 
//   View, 
//   Text, 
//   TextInput, 
//   TouchableOpacity, 
//   Image, 
//   KeyboardAvoidingView, 
//   Platform,
//   ScrollView,
//   ActivityIndicator,
//   Alert
// } from 'react-native';
// import { StatusBar } from 'expo-status-bar';
// import { useRouter } from 'expo-router';
// import { useAuth } from '@/context/AuthContext';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export default function LoginScreen() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [rememberMe, setRememberMe] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   const router = useRouter();
//   const { login, isSignedIn, isLoading } = useAuth();

//   // Redirect if user is already logged in
//   useEffect(() => {
//     if (isSignedIn) {
//       router.replace('/(tabs)');
//     }
//   }, [isSignedIn]);

//   // Handle login
//   const handleLogin = async () => {
//     if (!email || !password) {
//       Alert.alert('Error', 'Please enter both email and password');
//       return;
//     }
    
//     try {
//       setIsSubmitting(true);
      
//       // Get the selected role from AsyncStorage
//       const selectedRole = await AsyncStorage.getItem('@temp_user_role');
      
//       if (!selectedRole) {
//         // If no role is selected, go back to role selection
//         router.replace('/role');
//         return;
//       }
      
//       await login(email, password);
      
//       // Check if login was successful by checking if user is set
//       const userJson = await AsyncStorage.getItem('@user');
//       if (userJson) {
//         router.replace('/(tabs)');
//       } else {
//         Alert.alert('Login Failed', 'Unable to log in. Please try again.');
//       }
//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
//       Alert.alert('Login Failed', errorMessage);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Navigate to sign up screen
//   const handleSignUp = () => {
//     router.push('/auth/signup');
//   };

//   // Navigate to forgot password screen
//   const handleForgotPassword = () => {
//     router.push('/auth/forgot-password');
//   };

//   // Add handler for back button
//   const handleBack = () => {
//     router.replace('/role');
//   };

//   if (isLoading || isSignedIn) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#2C7BE5" />
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar style="dark" backgroundColor='#ECF6FF'/>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={{ flex: 1 }}
//       >
//         <ScrollView contentContainerStyle={styles.scrollContent}>
//           <TouchableOpacity 
//             style={styles.backButton}
//             onPress={handleBack}
//           >
//             <Text style={styles.backArrow}>←</Text>
//           </TouchableOpacity>

//           <View style={styles.logoContainer}>
//             <Image 
//               source={{ uri: 'https://via.placeholder.com/200x100' }} // Replace with actual logo
//               style={styles.logo}
//               resizeMode="contain"
//             />
//           </View>
          
//           <Text style={styles.welcomeText}>Welcome Back!</Text>
//           <Text style={styles.instructionText}>Sign in to continue</Text>
          
//           <View style={styles.formContainer}>
//             <View style={styles.inputContainer}>
//               <Text style={styles.inputLabel}>Email</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="your.email@example.com"
//                 placeholderTextColor="#A0AEC0"
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//                 value={email}
//                 onChangeText={setEmail}
//               />
//             </View>
            
//             <View style={styles.inputContainer}>
//               <Text style={styles.inputLabel}>Password</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter your password"
//                 placeholderTextColor="#A0AEC0"
//                 secureTextEntry
//                 value={password}
//                 onChangeText={setPassword}
//               />
//             </View>
            
//             <View style={styles.optionsRow}>
//               <TouchableOpacity 
//                 style={styles.rememberContainer}
//                 onPress={() => setRememberMe(!rememberMe)}
//               >
//                 <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
//                   {rememberMe && <Text style={styles.checkIcon}>✓</Text>}
//                 </View>
//                 <Text style={styles.rememberText}>Remember me</Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity onPress={handleForgotPassword}>
//                 <Text style={styles.forgotText}>Forgot Password?</Text>
//               </TouchableOpacity>
//             </View>
            
//             <TouchableOpacity 
//               style={styles.loginButton}
//               onPress={handleLogin}
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? (
//                 <ActivityIndicator color="#FFFFFF" />
//               ) : (
//                 <Text style={styles.loginButtonText}>Sign In</Text>
//               )}
//             </TouchableOpacity>
//           </View>
          
//           <View style={styles.footer}>
//             <Text style={styles.footerText}>Don't have an account? </Text>
//             <TouchableOpacity onPress={handleSignUp}>
//               <Text style={styles.signUpText}>Sign Up</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//   },
//   scrollContent: {
//     flexGrow: 1,
//     padding: 24,
//   },
//   logoContainer: {
//     alignItems: 'center',
//     marginTop: 40,
//     marginBottom: 40,
//   },
//   logo: {
//     width: 200,
//     height: 80,
//   },
//   welcomeText: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#1A2B3C',
//     marginBottom: 8,
//   },
//   instructionText: {
//     fontSize: 16,
//     color: '#4A5568',
//     marginBottom: 32,
//   },
//   formContainer: {
//     marginBottom: 24,
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   inputLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#4A5568',
//     marginBottom: 8,
//   },
//   input: {
//     backgroundColor: '#F7FAFC',
//     borderWidth: 1,
//     borderColor: '#E2E8F0',
//     borderRadius: 8,
//     padding: 16,
//     fontSize: 16,
//     color: '#1A2B3C',
//   },
//   optionsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   rememberContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   checkbox: {
//     width: 20,
//     height: 20,
//     borderWidth: 1,
//     borderColor: '#CBD5E0',
//     borderRadius: 4,
//     marginRight: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   checkboxActive: {
//     backgroundColor: '#2C7BE5',
//     borderColor: '#2C7BE5',
//   },
//   checkIcon: {
//     color: '#FFFFFF',
//     fontSize: 12,
//   },
//   rememberText: {
//     fontSize: 14,
//     color: '#4A5568',
//   },
//   forgotText: {
//     fontSize: 14,
//     color: '#2C7BE5',
//     fontWeight: '600',
//   },
//   loginButton: {
//     backgroundColor: '#2C7BE5',
//     borderRadius: 8,
//     padding: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   loginButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 24,
//   },
//   footerText: {
//     fontSize: 14,
//     color: '#4A5568',
//   },
//   signUpText: {
//     fontSize: 14,
//     color: '#2C7BE5',
//     fontWeight: '600',
//   },
//   backButton: {
//     position: 'absolute',
//     top: 10,
//     left: 20,
//     zIndex: 1,
//     padding: 10,
//   },
//   backArrow: {
//     fontSize: 24,
//     color: '#1A2B3C',
//   },
// });


// LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft } from 'lucide-react-native';

interface LoginScreenProps {
  hideHeader?: boolean;
}

export default function LoginScreen({ hideHeader = false }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const { login } = useAuth();

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
      console.log("user ka role hai:",selectedRole)
      if (!selectedRole) {
        // If no role is selected, go back to role selection
        router.replace('/role');
        return;
      }
      
      await login(email, password, selectedRole);
      
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

  const renderContent = () => (
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
  );

  if (hideHeader) {
    return renderContent();
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" backgroundColor='#ECF6FF'/>

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

      {renderContent()}
    </SafeAreaView>
  );
}

