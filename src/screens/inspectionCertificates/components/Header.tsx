import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

export const Header = () => {
  const router = useRouter();

  return (
    <View>

      <View className="flex-row items-center justify-between px-4 py-3 bg-[#ECF6FF]">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <View className="flex-row items-center">
          <Text className="text-xl font-semibold text-[#1A2B3C]">Inspection Certificate</Text>
        </View>
        <View className="w-10" />
      </View>
      
      <View className="pr-4 pb-0 flex-row items-center bg-[#ECF6FF]">
        <Image
          source={require('@/assets/images/riskManagement/delo_wave.png')}
          className="h-28 mr-4"
          resizeMode="contain"
        />

        <View className="flex-1 flex justify-center items-start bg-white p-4 rounded-2xl">
          <Text className="text-base text-[#1A2B3C]">
            Hello there! Upload your {"\n"} certificates here
          </Text>
        </View>
      </View>
    </View>
  );
}; 