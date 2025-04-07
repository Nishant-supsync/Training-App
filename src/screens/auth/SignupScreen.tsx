// import React, { useState } from 'react';
// import { 
//   StyleSheet, 
//   View, 
//   Text, 
//   TextInput, 
//   TouchableOpacity, 
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

// export default function SignupScreen() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [employeeId, setEmployeeId] = useState('');
//   const [jobTitle, setJobTitle] = useState('');
//   const [location, setLocation] = useState('');
//   const [role, setRole] = useState<'employee' | 'manager'>('employee');
//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   const router = useRouter();
//   const { signup } = useAuth();

//   // Handle signup
//   const handleSignup = async () => {
//     // Validate form
//     if (!name || !email || !password || !confirmPassword || !employeeId || !jobTitle || !location) {
//       Alert.alert('Error', 'Please fill in all fields');
//       return;
//     }
    
//     if (password !== confirmPassword) {
//       Alert.alert('Error', 'Passwords do not match');
//       return;
//     }
    
//     try {
//       setIsSubmitting(true);
//       await signup({
//         name,
//         email,
//         password,
//         employee_id: employeeId,
//         restaurant_id: '6c173e39-3ab5-4414-94aa-6af5174e6a9f',
//         jobTitle,
//         location,
//         role
//       });
//       router.replace('/(tabs)');
//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
//       Alert.alert('Signup Failed', errorMessage);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Navigate back to login screen
//   const handleBackToLogin = () => {
//     router.back();
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar style="dark" backgroundColor='#ECF6FF'/>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={{ flex: 1 }}
//       >
//         <ScrollView contentContainerStyle={styles.scrollContent}>
//           <Text style={styles.titleText}>Create Account</Text>
//           <Text style={styles.instructionText}>Fill in the form to create your account</Text>
          
//           <View style={styles.formContainer}>
//             <View style={styles.inputContainer}>
//               <Text style={styles.inputLabel}>Full Name</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="John Doe"
//                 placeholderTextColor="#A0AEC0"
//                 value={name}
//                 onChangeText={setName}
//               />
//             </View>
            
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
//               <Text style={styles.inputLabel}>Employee ID</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="EMP12345"
//                 placeholderTextColor="#A0AEC0"
//                 value={employeeId}
//                 onChangeText={setEmployeeId}
//               />
//             </View>
            
//             <View style={styles.inputContainer}>
//               <Text style={styles.inputLabel}>Job Title</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Line Cook"
//                 placeholderTextColor="#A0AEC0"
//                 value={jobTitle}
//                 onChangeText={setJobTitle}
//               />
//             </View>
            
//             <View style={styles.inputContainer}>
//               <Text style={styles.inputLabel}>Location/Restaurant</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Downtown Restaurant"
//                 placeholderTextColor="#A0AEC0"
//                 value={location}
//                 onChangeText={setLocation}
//               />
//             </View>
            
//             <View style={styles.inputContainer}>
//               <Text style={styles.inputLabel}>Role</Text>
//               <View style={styles.roleContainer}>
//                 <TouchableOpacity
//                   style={[styles.roleButton, role === 'employee' && styles.roleButtonActive]}
//                   onPress={() => setRole('employee')}
//                 >
//                   <Text style={[styles.roleButtonText, role === 'employee' && styles.roleButtonTextActive]}>
//                     Employee
//                   </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[styles.roleButton, role === 'manager' && styles.roleButtonActive]}
//                   onPress={() => setRole('manager')}
//                 >
//                   <Text style={[styles.roleButtonText, role === 'manager' && styles.roleButtonTextActive]}>
//                     Manager
//                   </Text>
//                 </TouchableOpacity>
//               </View>
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
            
//             <View style={styles.inputContainer}>
//               <Text style={styles.inputLabel}>Confirm Password</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Confirm your password"
//                 placeholderTextColor="#A0AEC0"
//                 secureTextEntry
//                 value={confirmPassword}
//                 onChangeText={setConfirmPassword}
//               />
//             </View>
            
//             <TouchableOpacity 
//               style={styles.signupButton}
//               onPress={handleSignup}
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? (
//                 <ActivityIndicator color="#FFFFFF" />
//               ) : (
//                 <Text style={styles.signupButtonText}>Create Account</Text>
//               )}
//             </TouchableOpacity>
//           </View>
          
//           <View style={styles.footer}>
//             <Text style={styles.footerText}>Already have an account? </Text>
//             <TouchableOpacity onPress={handleBackToLogin}>
//               <Text style={styles.loginText}>Sign In</Text>
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
//   scrollContent: {
//     flexGrow: 1,
//     padding: 24,
//   },
//   titleText: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#1A2B3C',
//     marginTop: 40,
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
//   roleContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   roleButton: {
//     flex: 0.48,
//     backgroundColor: '#F7FAFC',
//     borderWidth: 1,
//     borderColor: '#E2E8F0',
//     borderRadius: 8,
//     padding: 16,
//     alignItems: 'center',
//   },
//   roleButtonActive: {
//     backgroundColor: '#EBF5FF',
//     borderColor: '#2C7BE5',
//   },
//   roleButtonText: {
//     fontSize: 16,
//     color: '#4A5568',
//   },
//   roleButtonTextActive: {
//     color: '#2C7BE5',
//     fontWeight: '500',
//   },
//   signupButton: {
//     backgroundColor: '#2C7BE5',
//     borderRadius: 8,
//     padding: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 12,
//   },
//   signupButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 24,
//     marginBottom: 40,
//   },
//   footerText: {
//     fontSize: 14,
//     color: '#4A5568',
//   },
//   loginText: {
//     fontSize: 14,
//     color: '#2C7BE5',
//     fontWeight: '500',
//   },
// });



// SignupScreen.js
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

interface SignupScreenProps {
  hideHeader?: boolean;
}

export default function SignupScreen({ hideHeader = false }: SignupScreenProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [position, setPosition] = useState('');
  const [signupKey, setSignupKey] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const { signup } = useAuth();

  // Handle signup
  const handleSignup = async () => {
    if (!fullName || !email || !password || !confirmPassword || !position || !signupKey) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
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
      
      await signup({
        name: fullName,
        email,
        password,
        role: selectedRole as 'manager' | 'employee',
        restaurant_id: '6c173e39-3ab5-4414-94aa-6af5174e6a9f',
        employee_id: signupKey,
        location: 'Default Location',
        jobTitle: position,
      });
      
      // Check if signup was successful by checking if user is set
      const userJson = await AsyncStorage.getItem('@user');
      if (userJson) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Signup Failed', 'Unable to sign up. Please try again.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      Alert.alert('Signup Failed', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
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
        {/* Full Name Input */}
        <View className="mb-4">
          <Text className="text-gray-500 mb-2">Full Name</Text>
          <View className="bg-white rounded-xl border border-gray-200 px-3 py-3.5">
            <View className="flex-row items-center">
              <Ionicons name="person-outline" size={20} color="#718096" />
              <TextInput
                className="flex-1 text-black ml-2"
                placeholder="Enter your full name"
                placeholderTextColor="#A0AEC0"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
          </View>
        </View>

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

        {/* Position Input */}
        <View className="mb-4">
          <Text className="text-gray-500 mb-2">Position</Text>
          <View className="bg-white rounded-xl border border-gray-200 px-3 py-3.5">
            <View className="flex-row items-center">
              <Ionicons name="briefcase-outline" size={20} color="#718096" />
              <TextInput
                className="flex-1 text-black ml-2"
                placeholder="Enter your position"
                placeholderTextColor="#A0AEC0"
                value={position}
                onChangeText={setPosition}
              />
            </View>
          </View>
        </View>

        {/* Signup Key Input */}
        <View className="mb-4">
          <Text className="text-gray-500 mb-2">Signup Key</Text>
          <View className="bg-white rounded-xl border border-gray-200 px-3 py-3.5">
            <View className="flex-row items-center">
              <Ionicons name="key-outline" size={20} color="#718096" />
              <TextInput
                className="flex-1 text-black ml-2"
                placeholder="Enter your signup key"
                placeholderTextColor="#A0AEC0"
                value={signupKey}
                onChangeText={setSignupKey}
              />
            </View>
          </View>
        </View>

        {/* Password Input */}
        <View className="mb-4">
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

        {/* Confirm Password Input */}
        <View className="mb-8">
          <Text className="text-gray-500 mb-2">Confirm Password</Text>
          <View className="bg-white rounded-xl border border-gray-200 px-3 py-3.5">
            <View className="flex-row items-center">
              <View className="justify-center" style={{ height: 24, width: 24 }}>
                <Ionicons name="lock-closed-outline" size={20} color="#718096" />
              </View>
              <TextInput
                className="flex-1 text-black ml-2 py-0"
                placeholder="Confirm your password"
                placeholderTextColor="#A0AEC0"
                secureTextEntry={!isConfirmPasswordVisible}
                value={confirmPassword}
                onChangeText={setConfirmPassword}

              />
              <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                <Ionicons
                  name={isConfirmPasswordVisible ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#718096"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Signup Button */}
        <TouchableOpacity
          className={`rounded-xl py-4 items-center justify-center mb-4 ${isSubmitting ? 'bg-blue-300' : 'bg-[#60A5FA]'}`}
          onPress={handleSignup}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-white text-base font-semibold">Sign Up</Text>
          )}
        </TouchableOpacity>

        {/* Terms of Service */}
        <View className="items-center justify-end mt-auto mb-4">
          <Text className="text-gray-500 text-center text-sm">
            By signing up for Sinatra, you agree to our{' '}
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

          {/* Signup Header */}
          <View className="px-6">
            <Text className="text-3xl font-bold text-black mb-6">Sign Up</Text>
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
              Welcome to Sinatra! Please fill in your details to create an account.
            </Text>
          </View>
        </View>
      </View>

      {renderContent()}
    </SafeAreaView>
  );
}