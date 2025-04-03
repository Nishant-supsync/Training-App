import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

export const Header = () => {
  const router = useRouter();

  return (
    <View className="bg-white">
      <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Text className="text-2xl">←</Text>
          </TouchableOpacity>
          <Text className="text-xl font-semibold">Inspection Certificate</Text>
        </View>
      </View>
      
      <View className="p-4 flex-row items-center bg-blue-50/50">
        <Image
          source={require('@/assets/images/riskManagement/delo_wave.png')}
          className="w-12 h-12 mr-3"
        />
        <Text className="text-gray-700">Hello there! Upload your certificates here</Text>
      </View>
    </View>
  );
}; 