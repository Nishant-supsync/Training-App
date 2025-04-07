import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { Search, ArrowLeft } from 'lucide-react-native';
import { API_ENDPOINTS } from '@/src/api/endpoints';
import api from '@/src/api/apiService';

type CategoryType = {
  id: number;
  name: string;
  frequency: number;
};

export function CertificateCategoriesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(API_ENDPOINTS.CERTIFICATE_CATEGORIES);
      if (response.data) {
        setCategories(response.data);
        setError(null);
      }
    } catch (err) {
      setError('Failed to load categories. Please try again later.');
      console.error('Error fetching categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (category: CategoryType) => {
    if (user?.role === 'employee') {
      router.push({
        pathname: '/certificate-section/employee/1',
        params: {
          category: category.id.toString(),
          // categoryName: category.name,
          // role: user.role,
          // name: user?.name || 'Your'
        }
      } as any);
    } else {
      router.push({
        pathname: '/certificate-section/employees',
        params: {
          category: category.id.toString(),
          categoryName: category.name 
        }
      } as any);
    }
  };

  const filteredCategories = searchQuery
    ? categories.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : categories;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" backgroundColor='#ECF6FF'/>

      <View className="bg-[#ECF6FF] py-4 px-4 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-center flex-1 pr-8">Certificates</Text>
      </View>

      <ScrollView className="flex-1 px-4 h-full">
        <Text className="text-xl font-normal text-black mt-5 mb-4">
          Select a certification category
        </Text>

        <View className="mb-4 bg-[#F8F9FA] rounded-lg border border-[#EDEFF3]">
          <View className="flex-row items-center py-2 px-3">
            <Search size={20} color="#718096" />
            <TextInput
              placeholder="Search"
              placeholderTextColor="#718096"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="ml-3 flex-1 py-2 text-gray-800 text-base leading-none outline-none"
            />
          </View>
        </View>

        {isLoading ? (
          <View className="flex-1 min-h-[400px] justify-center items-center">
            <ActivityIndicator size="large" color="#0066CC" />
          </View>
        ) : error ? (
          <View className="flex-1 justify-center items-center py-8">
            <Text className="text-red-500 text-center">{error}</Text>
            <TouchableOpacity 
              onPress={fetchCategories}
              className="mt-4 bg-blue-500 px-4 py-2 rounded-lg"
            >
              <Text className="text-white">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="bg-white rounded-lg overflow-hidden border border-[#EDEFF3] mb-5">
            {filteredCategories.map((category, index) => (
              <TouchableOpacity
                key={category.id}
                className={`flex-row justify-between items-center py-4 px-4 ${
                  index !== filteredCategories.length - 1 ? "border-none border-[#E2E8F0]" : ""
                }`}
                onPress={() => handleCategorySelect(category)}
              >
                <Text className="text-base text-black">{category.name}</Text>
                <Text className="text-gray-400 text-2xl">›</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default CertificateCategoriesScreen;
