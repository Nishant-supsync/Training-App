import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Search, ChevronRight, ArrowRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Employee = {
  id: string;
  name: string;
  department: string;
  certificateCount: number;
};

export default function EmployeeListScreen() {
  const router = useRouter();
  const { category, categoryName } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'withCert' | 'withoutCert'>('all');

  const [employees, setEmployees] = useState<Employee[]>([
    { id: '1', name: 'John Doe', department: 'Kitchen', certificateCount: 2 },
    { id: '2', name: 'Jane Smith', department: 'Service', certificateCount: 0 },
    { id: '3', name: 'Mike Johnson', department: 'Management', certificateCount: 3 },
    { id: '4', name: 'Sarah Williams', department: 'Kitchen', certificateCount: 0 },
    { id: '5', name: 'Cameron Williamson', department: 'Kitchen', certificateCount: 1 },
    { id: '6', name: 'Alex Paul', department: 'Service', certificateCount: 2 }
  ]);

  const handleEmployeeSelect = (employee: Employee) => {
    router.push({
      pathname: `/certificate-section/employee/${employee.id}`,
      params: {
        category,
        categoryName,
        employeeName: employee.name
      }
    } as any);
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterType === 'all') return matchesSearch;
    if (filterType === 'withCert') return matchesSearch && employee.certificateCount > 0;
    if (filterType === 'withoutCert') return matchesSearch && employee.certificateCount === 0;

    return matchesSearch;
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-[#ECF6FF]">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-1"
        >
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold">{categoryName}</Text>
        <View className="w-8" />
      </View>


      {/* Search Bar */}
      <View className="px-4 py-3">

        <Text className="text-xl font-normal text-black mt-3 mb-4">
          Employees
        </Text>

        <View className="flex-row items-center bg-[#F8F9FA] rounded-lg border border-[#EDEFF3] px-3 py-2">
          <Search size={20} color="#718096" />
          <TextInput
            className="ml-3 flex-1 py-2 text-gray-800 text-base leading-none outline-none"

            placeholder="Search employees..."
            placeholderTextColor="#718096"

            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filter Buttons */}
      <View className="flex-row justify-start gap-3 px-4 pb-3">
        {[
          { label: 'All', value: 'all' },
          { label: 'Certificate Available', value: 'withCert' },
          { label: 'No Certificate', value: 'withoutCert' },
        ].map(({ label, value }) => (
          <TouchableOpacity
            key={value}
            className={`px-4 py-2 rounded-md border ${filterType === value ? 'bg-[#E7F0FE] border-[#4A90E2]' : 'border-gray-300'}`}
            onPress={() => setFilterType(value as any)}
          >
            <Text className={`text-sm font-medium ${filterType === value ? 'text-[#4A90E2]' : 'text-gray-600'}`}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Employee List */}
      <ScrollView className="flex-1 px-4">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee) => (
            <TouchableOpacity
              key={employee.id}
              className="bg-white rounded-xl p-4 mb-3 flex-row items-center border border-gray-200 "
              onPress={() => handleEmployeeSelect(employee)}
            >
              <View className="w-10 h-10 bg-[#4299E1] rounded-full items-center justify-center mr-3">
                <Text className="text-white font-semibold text-lg">
                  {employee.name.charAt(0)}
                </Text>
              </View>
              {/* <View className="flex-1">
                <Text className="text-base font-medium">{employee.name}</Text>
                <Text className="text-[#718096] text-sm">{employee.department}</Text>
              </View> */}
              <View className="flex-1">
                <Text className="text-base font-medium">{employee.name}</Text>
                {employee.certificateCount > 0 ? (
                  <Text className="text-[#4A90E2] text-sm font-medium">
                    {employee.certificateCount} {employee.certificateCount === 1 ? 'Certificate' : 'Certificates'}
                  </Text>
                ) : (
                  <Text className="text-gray-500 text-sm">No Certificates Available</Text>
                )}
              </View>
              <View className="bg-[#EDEFF3] p-2 rounded-full">
                <ArrowRight size={14} color="#000000" />
              </View>

            </TouchableOpacity>
          ))
        ) : (
          <View className="flex-1 justify-center items-center mt-10">
            <Text className="text-lg text-gray-500">No employees found</Text>
          </View>
        )}
      </ScrollView>

    </SafeAreaView>
  );
}