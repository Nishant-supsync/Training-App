import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TabType, SubTabType } from '../types';

interface TabBarProps {
  mainTab: TabType;
  setMainTab: (tab: TabType) => void;
}

interface SubTabBarProps {
  subTab: SubTabType;
  setSubTab: (tab: SubTabType) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ mainTab, setMainTab }) => {
  return (
    <View className="flex-row border-b border-gray-200 bg-white">
      <TouchableOpacity 
        className={`flex-1 py-4 ${mainTab === 'upload' ? 'border-b-2 border-blue-500' : ''}`}
        onPress={() => setMainTab('upload')}
      >
        <Text className={`text-center ${mainTab === 'upload' ? 'text-blue-500' : 'text-gray-500'}`}>
          Upload & History
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        className={`flex-1 py-4 ${mainTab === 'providers' ? 'border-b-2 border-blue-500' : ''}`}
        onPress={() => setMainTab('providers')}
      >
        <Text className={`text-center ${mainTab === 'providers' ? 'text-blue-500' : 'text-gray-500'}`}>
          Service Providers
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export const SubTabBar: React.FC<SubTabBarProps> = ({ subTab, setSubTab }) => (
  <View className="flex-row border-b border-gray-200 bg-white">
    <TouchableOpacity 
      className={`flex-1 py-4 ${subTab === 'upload' ? 'border-b-2 border-blue-500' : ''}`}
      onPress={() => setSubTab('upload')}
    >
      <Text className={`text-center ${subTab === 'upload' ? 'text-blue-500' : 'text-gray-500'}`}>
        Upload
      </Text>
    </TouchableOpacity>
    <TouchableOpacity 
      className={`flex-1 py-4 ${subTab === 'history' ? 'border-b-2 border-blue-500' : ''}`}
      onPress={() => setSubTab('history')}
    >
      <Text className={`text-center ${subTab === 'history' ? 'text-blue-500' : 'text-gray-500'}`}>
        History
      </Text>
    </TouchableOpacity>
  </View>
); 