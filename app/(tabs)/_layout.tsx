import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Home } from 'lucide-react-native';
import '@/global.css';

const TabLayout = () => {
  const colorScheme = useColorScheme();
  const activeColor = '#4299e1'; // blue-500
  const inactiveColor = '#9ca3af'; // gray-400
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 75,
          backgroundColor: 'white',
          borderTopWidth: 0,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 10,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarButton: (props) => {
          const { onPress, children } = props;
          
          return (
            <Pressable
              onPress={onPress}
              android_ripple={{
                color: '#dbeafe',
                borderless: false,
                radius: 40,
              }}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 60,
              }}
              className='p-0'
            >
              {children}
            </Pressable>
          );
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarActiveTintColor: activeColor,
          tabBarInactiveTintColor: inactiveColor,
          tabBarIcon: ({ focused, color }) => (
            <View className="items-center w-full">
              {focused && (
                <View className="absolute top-0 h-1 w-16 bg-blue-500 rounded-full" />
              )}
              <View className={`p-2 mt-3 ${focused ? 'bg-blue-100 rounded-lg' : ''}`}>
                <Home size={24} color={focused ? activeColor : inactiveColor} />
              </View>
              <Text className={`text-sm mt-1 ${focused ? 'text-blue-500 font-medium' : 'text-gray-400'} text-center w-20 truncate`}>
                Home
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarActiveTintColor: activeColor,
          tabBarInactiveTintColor: inactiveColor,
          tabBarIcon: ({ focused, color }) => (
            <View className="items-center w-full">
              {focused && (
                <View className="absolute top-0 h-1 w-16 bg-blue-500 rounded-full" />
              )}
              <View className={`p-2 mt-3 ${focused ? 'bg-blue-100 rounded-lg' : ''}`}>
                <Image
                  source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                  className="w-7 h-7 rounded-full"
                />
              </View>
              <Text className={`text-sm mt-1 ${focused ? 'text-blue-500 font-medium' : 'text-gray-400'} text-center w-20 truncate`}>
                Profile
              </Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;