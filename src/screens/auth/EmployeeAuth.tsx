// AuthContainer.js
import React, { useState } from 'react';
import { SafeAreaView, View, TouchableOpacity, Text, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';

export default function AuthContainer() {
    const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'
    const router = useRouter();


    const handleBack = () => {
        router.replace('/role');
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar style="dark" backgroundColor='#ECF6FF' />

            {/* Header */}
            <View className='bg-[#E9F5FF] mb-4'>
                <View className="flex-col ">
                    {/* Back button */}
                    <View className="px-4 py-2">
                        <TouchableOpacity onPress={handleBack}>
                            <ArrowLeft size={24} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {/* Auth Header */}
                    <View className="px-6">
                        <Text className="text-3xl font-bold text-black mb-6">
                            {activeTab === 'login' ? 'Log In' : 'Sign Up'}
                        </Text>
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
                            {activeTab === 'login'
                                ? 'Welcome to Sinatra! Please enter your email and password.'
                                : 'Create your Sinatra account to get started.'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Tab Switcher */}
            <View className="flex-row bg-gray-100 rounded-full mx-6 mb-4">
                <TouchableOpacity
                    className={`flex-1 py-2 px-8 rounded-full ${activeTab === 'login' ? 'bg-[#60A5FA]' : 'bg-transparent'}`}
                    onPress={() => setActiveTab('login')}
                >
                    <Text className={`text-center ${activeTab === 'login' ? 'text-white' : 'text-gray-500'} font-medium`}>
                        Log in
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`flex-1 py-2 px-8 rounded-full ${activeTab === 'signup' ? 'bg-[#60A5FA]' : 'bg-transparent'}`}
                    onPress={() => setActiveTab('signup')}
                >
                    <Text className={`text-center ${activeTab === 'signup' ? 'text-white' : 'text-gray-500'} font-medium`}>
                        Sign Up
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Dynamic Content */}
            {activeTab === 'login' ? <LoginScreen hideHeader={true} /> : <SignupScreen hideHeader={true} />}
        </SafeAreaView>
    );
}