import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Plus, Search, ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_ENDPOINTS } from '@/src/api/endpoints';
import api from '@/src/api/apiService';
import { useAuth } from '@/context/AuthContext';
import { CertificateUploadModal } from './CertificateUploadModal';

type CertificateType = {
  id: string;
  name: string;
  date: string;
  size: string;
};

type ApiCertificateType = {
  id: number;
  certificate_url: string;
  name: string;
  restaurant_employee_id: number;
  status: string;
  certificate_category_id: number;
  renewal_frequency: number;
  date_of_training: number;
  issue_date: number;
  expiry_date: number;
  name_of_the_recipient: string;
  is_delete: boolean;
};

export function EmployeeCertificatesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { id, category, categoryName, employeeName, role } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [certificates, setCertificates] = useState<CertificateType[]>([]);

  // Fetch certificates from API
  const fetchCertificates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(API_ENDPOINTS.USER_CERTIFICATES, {
        params: {
          restaurant_id: user?.restaurant_id,
          employee_id: id,
          category_id: category
        }
      });
      
      if (response.data.status && response.data.data) {
        // Transform API response to match our CertificateType
        const transformedCertificates = response.data.data.map((cert: ApiCertificateType) => ({
          id: cert.id.toString(),
          name: cert.name,
          date: new Date(cert.expiry_date).toLocaleDateString(),
          size: 'Unknown' // API doesn't provide size, so we'll use a placeholder
        }));
        
        setCertificates(transformedCertificates);
      } else {
        setError('Failed to fetch certificates');
      }
    } catch (err) {
      console.error('Error fetching certificates:', err);
      setError('Failed to fetch certificates');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [id, category]);

  // Filter certificates based on search
  const filteredCertificates = searchQuery
    ? certificates.filter(cert =>
      cert.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : certificates;

  const handleUploadSuccess = () => {
    // Refresh the certificates list after successful upload
    fetchCertificates();
  };

  return (
    <SafeAreaView
      className="flex-1 bg-white"
    >
      <StatusBar style="dark" backgroundColor='#ECF6FF' />

      {/* Header - Light blue background */}
      <View
        className="flex-row items-center justify-between bg-[#ECF6FF] px-4 py-4"
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-1"
        >
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <View className="flex-1">
          {role !== 'employee' && (
            <Text className="text-xl font-semibold text-center">
              {employeeName || 'Cameron Williamson'}
            </Text>
          )}
          <Text className="text-sm text-[#718096] text-center">
            {categoryName || 'Category'}
          </Text>
        </View>
        <TouchableOpacity
          className="w-7 h-7 rounded-md border border-[#44A8FF] items-center justify-center"
          onPress={() => setShowUploadModal(true)}
        >
          <Plus size={20} color="#44A8FF" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {isLoading ? (
          <View className="flex-1 justify-center items-center px-8 py-40">
            <Text className="text-xl font-bold text-center mb-4">Loading...</Text>
          </View>
        ) : error ? (
          <View className="flex-1 justify-center items-center px-8 py-40">
            <Text className="text-xl font-bold text-center mb-4 text-red-500">{error}</Text>
          </View>
        ) : certificates.length === 0 ? (
          <View className="flex-1 justify-center items-center px-8 py-40">
            <Text className="text-xl font-bold text-center mb-4">No Certificate Available</Text>
            <Text className="text-[#4A5568] text-center">
              Have a certificate from someone else? Please click the <Text className="font-bold">plus</Text> icon above to upload your certificate.
            </Text>
          </View>
        ) : (
          <>
            {/* Certificates Title */}
            <Text className="text-[#718096] text-base px-4 pt-4 pb-2">Certificates</Text>

            {/* Optional: Search Bar */}
            <View className="px-4 mb-4">
              <View className="bg-[#F8F9FA] rounded-lg flex-row items-center px-3 py-2">
                <Search size={20} color="#718096" />
                <TextInput
                  placeholder="Search certificates"
                  placeholderTextColor="#718096"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  className="ml-3 flex-1 py-2 text-gray-800 text-base"
                />
              </View>
            </View>

            <View className="px-4 pb-8">
              {filteredCertificates.map((cert) => (
                <View
                  key={cert.id}
                  className="bg-white rounded-lg mb-3 overflow-hidden border border-[#E2E8F0] p-4"
                >
                  <View className="flex-row items-center">
                    <View className="mr-3">
                      <View className="w-10 h-12 bg-red-100 rounded-sm items-center justify-center">
                        <View className="bg-red-500 w-8 h-5 items-center justify-center">
                          <Text className="text-white text-xs font-bold">PDF</Text>
                        </View>
                      </View>
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-medium mb-1">{cert.name}</Text>
                      <Text className="text-[#718096] text-sm">{cert.date} · {cert.size}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {/* Upload Certificate Modal */}
      <CertificateUploadModal
        visible={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={handleUploadSuccess}
        employeeId={id as string}
        categoryId={category as string}
      />
    </SafeAreaView>
  );
}

export default EmployeeCertificatesScreen;