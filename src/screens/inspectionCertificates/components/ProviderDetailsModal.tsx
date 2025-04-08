import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { X, Star, Phone, MapPin } from 'lucide-react-native';
import { ServiceProvider } from '../types';

interface ProviderDetailsModalProps {
  provider: ServiceProvider | null;
  onClose: () => void;
}

export const ProviderDetailsModal: React.FC<ProviderDetailsModalProps> = ({
  provider,
  onClose,
}) => {
  if (!provider) return null;

  return (
    <Modal
      visible={!!provider}
      animationType="slide"
      transparent={true}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white rounded-xl p-6 w-11/12 max-w-md">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-semibold text-gray-800">Service Provider</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#4A5568" />
            </TouchableOpacity>
          </View>
          
          <View className="flex-row mb-6">
            <View className="flex-1 justify-center">
              <Text className="text-lg font-semibold text-gray-800 mb-1">{provider.name}</Text>
              <Text className="text-sm text-gray-600 mb-2">{provider.primaryService}</Text>
              <View className="flex-row items-center">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star}
                    size={16}
                    color="#FFAB00"
                    fill={star <= Math.floor(provider.rating) ? "#FFAB00" : "none"}
                    strokeWidth={star <= Math.floor(provider.rating) ? 0 : 1.5}
                  />
                ))}
                <Text className="ml-1 text-sm text-gray-600">{provider.rating}</Text>
              </View>
            </View>
          </View>
          
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-800 mb-3">About</Text>
            <Text className="text-sm text-gray-600 leading-5">
              {provider.description}
            </Text>
          </View>
          
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-800 mb-3">Contact Information</Text>
            <View className="bg-gray-50 rounded-lg p-4">
              <View className="flex-row items-center mb-3">
                <Phone size={20} color="#4A5568" />
                <Text className="ml-3 text-sm text-gray-600">{provider.contactInfo}</Text>
              </View>
              <View className="flex-row items-center">
                <MapPin size={20} color="#4A5568" />
                <Text className="ml-3 text-sm text-gray-600">{provider.location}</Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity className="bg-blue-500 rounded-lg p-4 items-center">
            <Text className="text-white text-base font-semibold">Contact Provider</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ProviderDetailsModal; 