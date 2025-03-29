import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar style="dark" />
      <ScrollView
        className="px-4"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mt-6 mb-6">
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
            className="w-28 h-28 rounded-full mb-4"
          />
          <Text className="text-2xl font-bold text-gray-800 mb-1">John Doe</Text>
          <Text className="text-base text-gray-500 mb-2">Line Cook</Text>
        </View>

        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Account Information</Text>

          <View className="flex-row justify-between py-2 border-b border-gray-100">
            <Text className="text-gray-500">Employee ID:</Text>
            <Text className="font-medium text-gray-800">EMP12345</Text>
          </View>

          <View className="flex-row justify-between py-2 border-b border-gray-100">
            <Text className="text-gray-500">Location:</Text>
            <Text className="font-medium text-gray-800">Downtown Restaurant</Text>
          </View>

          <View className="flex-row justify-between py-2 border-b border-gray-100">
            <Text className="text-gray-500">Email:</Text>
            <Text className="font-medium text-gray-800">john.doe@example.com</Text>
          </View>

          <View className="flex-row justify-between py-2">
            <Text className="text-gray-500">Phone:</Text>
            <Text className="font-medium text-gray-800">(123) 456-7890</Text>
          </View>
        </View>

        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Settings</Text>

          <TouchableOpacity className="py-3 border-b border-gray-100">
            <Text className="text-gray-800">Notification Preferences</Text>
          </TouchableOpacity>

          <TouchableOpacity className="py-3 border-b border-gray-100">
            <Text className="text-gray-800">Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity className="py-3">
            <Text className="text-gray-800">Privacy Settings</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="bg-red-500 rounded-xl p-4 items-center mt-6"
        >
          <Text className="text-white font-semibold text-base">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}