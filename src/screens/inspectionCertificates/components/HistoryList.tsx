import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { InspectionCertificate } from '../types';
import { useRouter } from 'expo-router';
import moment from 'moment';
import { ChevronRight, PenSquare } from 'lucide-react-native';
import api from '@/src/api/apiService';
import { API_ENDPOINTS } from '@/src/api/endpoints';
import { useAuth } from '@/context/AuthContext';

interface HistoryListProps {
  onUploadPress: () => void;
}

// Update the API response type to include new fields
interface ApiInspectionCertificate {
  id: number;
  certificate_url: string;
  date_of_inspection: number | null;
  frequency: string;
  uploaded_by: number;
  inspection_certificate_category_id: number;
  restaurant_uuid: string;
  category_name: string;
}

export const HistoryList: React.FC<HistoryListProps> = ({ onUploadPress }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<InspectionCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.INSPECTION_CERTIFICATES, {
        params: {
          restaurant_id: user?.restaurant_id,
          employee_id: user?.employee_id,
        }
      });

      if (response.data.status && Array.isArray(response.data.data)) {
        // Transform API data to match our InspectionCertificate type
        const transformedCertificates: InspectionCertificate[] = response.data.data.map(
          (cert: ApiInspectionCertificate) => ({
            id: String(cert.id),
            type: cert.category_name, // Use category_name instead of ID
            date: cert.date_of_inspection 
              ? moment(cert.date_of_inspection).format('YYYY-MM-DD')
              : 'Not specified', // Handle null date_of_inspection
            documentUrl: cert.certificate_url,
            renewalPeriod: `${cert.frequency} Days`, // Changed to Days as per API response
            category_id: cert.inspection_certificate_category_id
          })
        );
        setCertificates(transformedCertificates);
      }
    } catch (err) {
      console.error('Error fetching certificates:', err);
      setError('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCertificatePress = (certificate: InspectionCertificate) => {
    router.push({
      pathname: '/inspection-certificates/view-edit' as any,
      params: { id: certificate.id, category_id: certificate.category_id }
    });
  };

  const renderCertificateItem = ({ item }: { item: InspectionCertificate }) => (
    <TouchableOpacity 
      className="flex-row items-center justify-between bg-white p-4 border-b border-gray-100"
      onPress={() => handleCertificatePress(item)}
    >
      <View className="flex-1">
        <Text className="text-base font-medium text-gray-900">{item.type}</Text>
        <Text className="text-sm text-gray-500 mt-1">
          {moment(item.date).format('MM/DD/YYYY')}
        </Text>
      </View>
      <PenSquare size={20} color="#60A5FA" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading certificates...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={certificates}
        renderItem={renderCertificateItem}
        keyExtractor={item => item.id}
        className="flex-1"
        contentContainerClassName="pb-20"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View className="flex-1 justify-center items-center p-5">
            <Text className="text-base text-gray-500">No inspection certificates found</Text>
          </View>
        )}
      />
      
      <TouchableOpacity 
        className="bg-[#60A5FA] mx-4 mb-4 py-4 rounded-xl items-center"
        onPress={onUploadPress}
      >
        <Text className="text-white font-medium text-base">Upload Certificate</Text>
      </TouchableOpacity>
    </View>
  );
}; 