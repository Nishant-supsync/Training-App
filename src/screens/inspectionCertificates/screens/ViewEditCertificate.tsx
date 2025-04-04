import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar, Eye, Trash2 } from 'lucide-react-native';
import { InspectionCertificate } from '../types';
import moment from 'moment';
import { dummyCertificates } from '../components/HistoryList';

export default function ViewEditCertificateScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [certificate, setCertificate] = useState<InspectionCertificate | null>(null);

  useEffect(() => {
    // Find the certificate with matching id from dummy data
    const foundCertificate = dummyCertificates.find(cert => cert.id === params.id);
    if (foundCertificate) {
      setCertificate(foundCertificate);
    } else {
      // Handle case when certificate is not found
      router.back();
    }
  }, [params.id]);

  const handleSave = () => {
    setIsEditing(false);
    // router.back();
  };

  if (!certificate) {
    return null; // or a loading state
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-[#F8FAFC]">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-medium">
          {isEditing ? 'Edit' : `${certificate.documentUrl}`}
        </Text>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <Text className="text-[#60A5FA] font-medium">
            {isEditing ? 'Cancel' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4">
        {!isEditing && (
          <Text className="text-lg text-gray-600 mt-4 mb-6">
            Inspection Details
          </Text>
        )}

        {/* Certificate Type */}
        <View className="mb-6">
          <Text className="text-base text-gray-500 mb-2">Certificate Type</Text>
          {isEditing ? (
            <View className="relative">
              <TextInput
                className="bg-white border border-gray-200 rounded-xl p-4 pr-10"
                value={certificate.type}
                onChangeText={(text) => setCertificate({ ...certificate, type: text })}
              />
              <View className="absolute right-3 top-4">
                <View className="rotate-90">
                  <ArrowLeft size={20} color="#94A3B8" />
                </View>
              </View>
            </View>
          ) : (
            <Text className="text-lg text-gray-900">{certificate.type}</Text>
          )}
        </View>

        {/* Date of Inspection */}
        <View className="mb-6">
          <Text className="text-base text-gray-500 mb-2">Date Of Inspection</Text>
          {isEditing ? (
            <View className="relative">
              <TextInput
                className="bg-white border border-gray-200 rounded-xl p-4 pr-10"
                value={moment(certificate.date).format('MM/DD/YY')}
                onChangeText={(text) => setCertificate({ ...certificate, date: text })}
                placeholder="MM/DD/YY"
              />
              <View className="absolute right-3 top-4">
                <Calendar size={20} color="#94A3B8" />
              </View>
            </View>
          ) : (
            <Text className="text-lg text-gray-900">{moment(certificate.date).format('MMM D, YYYY')}</Text>
          )}
        </View>

        {/* Renewal Frequency */}
        <View className="mb-6">
          <Text className="text-base text-gray-500 mb-2">Renewal Frequency</Text>
          {isEditing ? (
            <View className="relative">
              <TextInput
                className="bg-white border border-gray-200 rounded-xl p-4 pr-10"
                value={certificate.renewalPeriod}
                onChangeText={(text) => {/* Handle renewal frequency change */}}
              />
              <View className="absolute right-3 top-4">
                <View className="rotate-90">
                  <ArrowLeft size={20} color="#94A3B8" />
                </View>
              </View>
            </View>
          ) : (
            <Text className="text-lg text-gray-900">{certificate.renewalPeriod}</Text>
          )}
        </View>

        {/* Document */}
        <View className="mb-6">
          <Text className="text-base text-gray-500 mb-2">Document</Text>
          <View className="bg-white border border-gray-200 rounded-xl p-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                {/* <Image 
                  source={require('@/assets/icons/pdf.png')} 
                  className="w-8 h-8 mr-3"
                /> */}
                <View>
                  <Text className="text-gray-900">Inspection_xyz.pdf</Text>
                  <Text className="text-gray-500 text-sm">
                    10/06/2023 · 321 KB
                  </Text>
                </View>
              </View>
              <View className="flex-row gap-4">
                <TouchableOpacity>
                  <Eye size={20} color="#60A5FA" />
                </TouchableOpacity>
                {isEditing && (
                  <TouchableOpacity>
                    <Trash2 size={20} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Save Button */}
        {isEditing && (
          <TouchableOpacity
            className="bg-[#60A5FA] py-4 rounded-xl items-center mt-4 mb-6"
            onPress={handleSave}
          >
            <Text className="text-white font-medium text-base">
              Save
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}