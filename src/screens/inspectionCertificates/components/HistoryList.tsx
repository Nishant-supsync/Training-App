import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { InspectionCertificate } from '../types';
import { useRouter } from 'expo-router';
import moment from 'moment';
import { ChevronRight, PenSquare } from 'lucide-react-native';

interface HistoryListProps {
  onUploadPress: () => void;
}

// You can move this to a separate file like dummyData.ts later
export const dummyCertificates: InspectionCertificate[] = [
  {
    id: '1',
    type: 'Annual Safety Inspection',
    date: '2024-03-15',
    status: 'pass',
    documentUrl: 'safety_inspection_2024.pdf',
    renewalPeriod: '6 Months'
  },
  {
    id: '2',
    type: 'Fire Safety Certification',
    date: '2024-02-20',
    status: 'pending',
    documentUrl: 'fire_safety_cert.pdf',
    renewalPeriod: '6 Months'
  },
  {
    id: '3',
    type: 'Equipment Maintenance Report',
    date: '2024-01-10',
    status: 'pass',
    documentUrl: 'equipment_maintenance.pdf',
    renewalPeriod: '6 Months'
  },
  {
    id: '4',
    type: 'Health & Safety Audit',
    date: '2023-12-05',
    status: 'fail',
    documentUrl: 'health_safety_audit.pdf',
    renewalPeriod: '6 Months'
  },
  {
    id: '5',
    type: 'Environmental Compliance',
    date: '2023-11-30',
    status: 'pass',
    documentUrl: 'environmental_report.pdf',
    renewalPeriod: '6 Months'
  }
];

export const HistoryList: React.FC<HistoryListProps> = ({ onUploadPress }) => {
  const router = useRouter();
  const [certificates] = useState(dummyCertificates);
  
  const handleCertificatePress = (certificate: InspectionCertificate) => {
    router.push({
      pathname: '/inspection-certificates/view-edit' as any,
      params: { id: certificate.id }
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