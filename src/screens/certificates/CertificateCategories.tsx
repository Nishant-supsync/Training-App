import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';
import { ChevronLeft } from 'lucide-react-native';
import { Search, ArrowLeft } from 'lucide-react-native';


type CategoryType = {
  id: string;
  name: string;
};

export function CertificateCategoriesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [userRole, setUserRole] = useState<'manager' | 'employee' | null>(null);

  useEffect(() => {
    const loadUserRoleAndRedirect = async () => {
      try {
        let role = params.role as 'manager' | 'employee' | undefined;

        if (!role) {
          const tempRole = await AsyncStorage.getItem('@temp_user_role');
          if (tempRole && (tempRole === 'manager' || tempRole === 'employee')) {
            role = tempRole as 'manager' | 'employee';
          }
        }

        if (!role && user?.role) {
          role = user.role;
        }

        if (!role) {
          const savedRole = await AsyncStorage.getItem('@user_role_preference');
          if (savedRole && (savedRole === 'manager' || savedRole === 'employee')) {
            role = savedRole as 'manager' | 'employee';
          } else {
            role = 'employee';
          }
        }

        setUserRole(role);
      } catch (error) {
        console.error('Error loading user role:', error);
        setUserRole('employee');
      }
    };

    loadUserRoleAndRedirect();
  }, [params.role, user]);

  const certificateCategories: CategoryType[] = [
    { id: '1', name: 'Food Manager' },
    { id: '2', name: 'Food Handler' },
    { id: '3', name: 'Allergen awareness' },
    { id: '4', name: 'Alcohol server training' },
    { id: '5', name: 'Sexual harassment prevention – employee' },
    { id: '6', name: 'Sexual harassment prevention – Manager' },
    { id: '7', name: 'CPR, First Aid, AED' },
    { id: '8', name: 'Active Shooter Training' },
    { id: '9', name: 'Cannabis Safety' },
  ];

  const handleCategorySelect = (category: CategoryType) => {
    if (userRole === 'employee') {
      router.push({
        pathname: '/certificate-section/employee/1',
        params: {
          category: category.id,
          categoryName: category.name,
          role: userRole,
          name: user?.name || 'Your'
        }
      } as any);
    } else {
      router.push({
        pathname: '/certificate-section/employees',
        params: {
          category: category.id,
          categoryName: category.name
        }
      } as any);
    }
  };

  const filteredCategories = searchQuery
    ? certificateCategories.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : certificateCategories;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <View className="bg-[#ECF6FF] py-4 px-4 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-center flex-1 pr-8">Certificates</Text>
      </View>

      <ScrollView className="flex-1 px-4">
        <Text className="text-xl font-normal text-black mt-5 mb-4">
          Select a certification category
        </Text>

        <View className="mb-4 bg-[#F8F9FA] rounded-lg border border-[#EDEFF3]">
          <View className="flex-row items-center py-2 px-3 ">
            {/* <Text className="text-gray-400 mr-2">🔍</Text> */}
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

        <View className="bg-white rounded-lg overflow-hidden border border-[#EDEFF3] mb-5">
          {filteredCategories.map((category, index) => (
            <TouchableOpacity
              key={category.id}
              className={`flex-row justify-between items-center py-4 px-4 ${index !== filteredCategories.length - 1 ? "border-none border-[#E2E8F0]" : ""}`}
              onPress={() => handleCategorySelect(category)}
            >
              <Text className="text-base text-black">{category.name}</Text>
              <Text className="text-gray-400 text-2xl">›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default CertificateCategoriesScreen;
