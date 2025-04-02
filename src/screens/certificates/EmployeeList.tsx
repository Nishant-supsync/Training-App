import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  TextInput
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Plus } from 'lucide-react-native';
import '@/global.css';

type Certificate = {
  id: string;
  name: string;
  date: string;
  size: string;
  type: 'pdf' | 'image';
};

export default function EmployeeCertificateDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [employeeName, setEmployeeName] = useState('Cameron Williamson');
  
  // This would be fetched from an API in a real app
  useEffect(() => {
    // Simplified data just for ID 1
    const certificatesData = [
      { id: '1', name: 'Certificate_xyz.pdf', date: '10/06/2023', size: '321 KB', type: 'pdf' as const },
      { id: '2', name: 'Certificate_xyz.pdf', date: '10/06/2023', size: '321 KB', type: 'pdf' as const },
      { id: '3', name: 'Certificate_xyz.pdf', date: '10/06/2023', size: '321 KB', type: 'pdf' as const },
      { id: '4', name: 'Certificate_xyz.pdf', date: '10/06/2023', size: '321 KB', type: 'pdf' as const },
    ];
    
    setCertificates(certificatesData);
  }, []);  // Remove id dependency since we're using fixed data
  
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    // In a real app, you would filter certificates based on the search text
  };
  
  const handleAddCertificate = () => {
    router.push(`/certificate-section/upload?employeeId=${id}` as any);
  };
  
  const renderNoCertificates = () => (
    <View className="flex-1 justify-center items-center px-8">
      <Text className="text-xl font-bold text-center mb-4">No Certificate Available</Text>
      <Text className="text-base text-[#4A5568] text-center mb-4">
        Have a certificate from someone else? Please click the <Text className="font-bold">plus</Text> icon above to upload your certificate.
      </Text>
    </View>
  );
  
  const renderCertificatesList = () => (
    <View className="px-4">
      <Text className="text-[#718096] text-base mb-3">Certificates</Text>
      
      {certificates.map((cert) => (
        <View 
          key={cert.id}
          className="bg-white rounded-lg mb-3 p-4 flex-row items-center"
        >
          <View className="w-10 h-12 justify-center items-center mr-3">
            <View className="bg-[#F56565] rounded-sm w-10 h-6 items-center justify-center">
              <Text className="text-white text-xs font-bold">PDF</Text>
            </View>
          </View>
          <View className="flex-1">
            <Text className="text-base font-medium">{cert.name}</Text>
            <Text className="text-[#718096] text-sm">{cert.date} · {cert.size}</Text>
          </View>
        </View>
      ))}
    </View>
  );
  
  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-[#F0F7FF]">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="p-1"
        >
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold">{employeeName}</Text>
        <TouchableOpacity 
          className="w-8 h-8 bg-[#4299E1] rounded-full items-center justify-center"
          onPress={handleAddCertificate}
        >
          <Plus size={18} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <ScrollView className="flex-1">
        {certificates.length > 0 ? renderCertificatesList() : renderNoCertificates()}
      </ScrollView>
    </SafeAreaView>
  );
}