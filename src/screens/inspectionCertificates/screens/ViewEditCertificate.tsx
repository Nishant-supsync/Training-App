import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, ActivityIndicator, FlatList, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar as CalendarIcon, Eye, Trash2, ChevronDown } from 'lucide-react-native';
import { InspectionCertificate } from '../types';
import moment from 'moment';
import api from '@/src/api/apiService';
import { API_ENDPOINTS } from '@/src/api/endpoints';
import { useAuth } from '@/context/AuthContext';
import { Calendar } from 'react-native-calendars';
import { format, parse } from 'date-fns';
import { Linking } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

// Define the API response type
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

interface InspectionType {
  id: number;
  created_at: number;
  name: string;
  is_active: boolean;
  frequency: number;
}

type FileType = {
  name: string;
  size: string;
  date: string;
  uri: string;
  type: string;
  sizeBytes: number;
} | null;

export default function ViewEditCertificateScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string, category_id: string }>();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [certificate, setCertificate] = useState<InspectionCertificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Calendar states
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  
  // Year-month picker states
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [calendarDate, setCalendarDate] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });
  
  // Generate years for year picker (10 years back, 10 years forward)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
  
  // Generate months for month picker
  const months = [
    { name: 'January', value: 1 },
    { name: 'February', value: 2 },
    { name: 'March', value: 3 },
    { name: 'April', value: 4 },
    { name: 'May', value: 5 },
    { name: 'June', value: 6 },
    { name: 'July', value: 7 },
    { name: 'August', value: 8 },
    { name: 'September', value: 9 },
    { name: 'October', value: 10 },
    { name: 'November', value: 11 },
    { name: 'December', value: 12 }
  ];

  const [inspectionTypes, setInspectionTypes] = useState<InspectionType[]>([]);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileType>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchCertificateDetails();
    fetchInspectionTypes();
  }, [params.id]);

  const fetchCertificateDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get restaurant ID and employee ID from auth context
      const restaurantId = user?.restaurant_id;
      const employeeId = user?.employee_id;
      
      // Fetch inspection certificate details using the category_id
      const response = await api.get(
        API_ENDPOINTS.INSPECTION_CERTIFICATE_BY_ID,
        {
          params: {
            restaurant_id: restaurantId,
            employee_id: Number(employeeId),
            inspection_certificate_category_id: params.category_id,
            inspection_certificate_id: params.id
          }
        }
      );

      if (response.data.status && Array.isArray(response.data.data) && response.data.data.length > 0) {
        // Transform API data to match our InspectionCertificate type
        const certData = response.data.data[0];
        
        // Handle the date conversion
        let formattedDate = 'Not specified';
        if (certData.date_of_inspection) {
          formattedDate = moment(certData.date_of_inspection).format('MM/DD/YY');
          setSelectedDate(moment(certData.date_of_inspection).format('YYYY-MM-DD'));
        }
        
        const transformedCertificate: InspectionCertificate = {
          id: String(certData.id),
          type: certData.category_name,
          date: formattedDate,
          documentUrl: certData.certificate_url,
          renewalPeriod: `${certData.frequency} Days`,
          category_id: String(certData.inspection_certificate_category_id)
        };
        
        setCertificate(transformedCertificate);
      } else {
        setError('Certificate not found');
        router.back();
      }
    } catch (err) {
      console.error('Error fetching certificate details:', err);
      setError('Failed to load certificate details');
    } finally {
      setLoading(false);
    }
  };

  // Fetch inspection types
  const fetchInspectionTypes = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.INSPECTION_TYPES);
      setInspectionTypes(response.data);
    } catch (error) {
      console.error('Error fetching inspection types:', error);
    }
  };

  // Toggle calendar visibility
  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
    if (showYearPicker) setShowYearPicker(false);
  };

  // Toggle year picker
  const toggleYearPicker = () => {
    setShowYearPicker(!showYearPicker);
  };

  // Select year
  const selectYear = (year: number) => {
    setCalendarDate({ ...calendarDate, year });
    setShowYearPicker(false);
  };

  // Select month
  const selectMonth = (month: number) => {
    setCalendarDate({ ...calendarDate, month });
    setShowYearPicker(false);
  };

  // Handle date selection
  const handleDateSelect = (day: any) => {
    // Format the date from YYYY-MM-DD to MM/DD/YY
    const selectedDate = new Date(day.dateString);
    const formattedDate = format(selectedDate, 'MM/dd/yy');
    
    setSelectedDate(day.dateString);
    if (certificate) {
      setCertificate({
        ...certificate,
        date: formattedDate
      });
    }
    setShowCalendar(false);
  };

  // Handle type selection
  const handleTypeSelect = (type: InspectionType) => {
    if (certificate) {
      setCertificate({
        ...certificate,
        type: type.name,
        renewalPeriod: `${type.frequency} Days`
      });
    }
    setShowTypeDropdown(false);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!certificate) {
        throw new Error('No certificate data available');
      }
      
      // Get restaurant ID and employee ID from auth context
      const restaurantId = user?.restaurant_id;
      const employeeId = user?.employee_id;
      
      if (!restaurantId || !employeeId) {
        throw new Error('Missing required user information');
      }
      
      // Parse the date to timestamp
      const dateTimestamp = certificate.date !== 'Not specified' 
        ? moment(certificate.date, 'MM/DD/YY').valueOf() 
        : null;
      
      // Extract the numeric value from renewalPeriod (e.g., "30 Days" -> 30)
      const frequency = certificate.renewalPeriod.split(' ')[0];
      
      // Create FormData instance
      const formData = new FormData();
      
      // Handle certificate_url - either as a file blob or existing URL
      if (selectedFile) {
        // If new file is selected, append it as blob with key 'certificate_url'
        formData.append('certificate_url', {
          uri: selectedFile.uri,
          type: selectedFile.type,
          name: selectedFile.name,
        } as any);
      } else if (certificate.documentUrl) {
        // If no new file, use existing documentUrl
        formData.append('certificate_url', certificate.documentUrl);
      }
      
      // Append other certificate data
      formData.append('inspection_certificate_id', params.id);
      formData.append('date_of_inspection', dateTimestamp ? dateTimestamp.toString() : '');
      formData.append('frequency', frequency);
      formData.append('restaurant_id', restaurantId.toString());
      formData.append('uploaded_by', employeeId.toString());
      formData.append('inspection_certificate_category_id', params.category_id);
      
      // Call the update API with FormData
      const response = await api.post(
        `${API_ENDPOINTS.UPDATE_INSPECTION}/${params.id}`,
        formData,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      console.log("API Response:", response.data);
      
      // Check if the response is successful
      if (response.status >= 200 && response.status < 300) {
        console.log("Certificate updated successfully");
        setIsEditing(false);
        // Refresh the certificate details
        fetchCertificateDetails();
        
        // Show success message
        Alert.alert(
          "Success",
          "Certificate updated successfully"
        );
      } else {
        console.log("Failed to update certificate", response.data);
        throw new Error('Failed to update certificate');
      }
    } catch (err) {
      console.error('Error updating certificate:', err);
      setError(err instanceof Error ? err.message : 'Failed to update certificate');
      Alert.alert(
        "Error",
        "Failed to update certificate. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection
  const handleChooseFile = async () => {
    try {
      // Open document picker
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'image/jpeg',
          'image/png',
          'text/csv'
        ],
        copyToCacheDirectory: true
      });
      
      if (result.canceled) {
        return;
      }
      
      const fileAsset = result.assets[0];
      
      // Check if file is too large (14.9MB limit)
      const maxSizeBytes = 14.9 * 1024 * 1024; // 14.9MB in bytes
      if (fileAsset?.size && fileAsset.size > maxSizeBytes) {
        Alert.alert(
          "File Too Large",
          "The selected file exceeds the maximum size limit of 14.9MB. Please choose a smaller file."
        );
        return;
      }
      
      // Format the size for display
      const fileSizeKB = fileAsset?.size ? fileAsset.size / 1024 : 0;
      let fileSizeStr = '';
      
      if (fileSizeKB < 1024) {
        fileSizeStr = `${Math.round(fileSizeKB)} KB`;
      } else {
        fileSizeStr = `${(fileSizeKB / 1024).toFixed(2)} MB`;
      }
      
      setSelectedFile({
        name: fileAsset.name,
        size: fileSizeStr,
        date: format(new Date(), 'MM/dd/yyyy'),
        uri: fileAsset.uri,
        type: fileAsset.mimeType || '',
        sizeBytes: fileAsset.size || 0
      });
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert(
        "Error",
        "There was an error selecting the document. Please try again."
      );
    }
  };

  // Handle file removal
  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (certificate) {
      setCertificate({
        ...certificate,
        documentUrl: ''
      });
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#60A5FA" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center px-4">
        <Text className="text-red-500 text-center">{error}</Text>
        <TouchableOpacity 
          className="mt-4 bg-[#60A5FA] px-6 py-3 rounded-xl"
          onPress={() => router.back()}
        >
          <Text className="text-white font-medium">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!certificate) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" backgroundColor='#ECF6FF'/>

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-[#F8FAFC]">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-medium max-w-80 justify-center text-center">
          {isEditing ? 'Edit' : `${certificate.type}`}
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
              <TouchableOpacity
                className="bg-white border border-gray-200 rounded-xl p-4 pr-10 flex-row justify-between items-center"
                onPress={() => setShowTypeDropdown(!showTypeDropdown)}
              >
                <Text className="text-gray-900">{certificate.type || 'Select certificate type'}</Text>
                <View className="rotate-90">
                  <ArrowLeft size={20} color="#94A3B8" />
                </View>
              </TouchableOpacity>

              {showTypeDropdown && (
                <View className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                  <ScrollView className="max-h-60">
                    {inspectionTypes.map((type) => (
                      <TouchableOpacity
                        key={type.id}
                        className="p-4 border-b border-gray-100"
                        onPress={() => handleTypeSelect(type)}
                      >
                        <Text className="text-gray-900">{type.name}</Text>
                        <Text className="text-sm text-gray-500">Renewal: {type.frequency} days</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
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
              <TouchableOpacity 
                className="bg-white border border-gray-200 rounded-xl flex-row items-center px-4"
                onPress={toggleCalendar}
              >
              <TextInput
                  className="flex-1 p-4 text-base"
                placeholder="MM/DD/YY"
                  placeholderTextColor="#A0AEC0"
                  value={certificate.date}
                  editable={false}
                  pointerEvents="none"
                />
                <CalendarIcon size={20} color="#94A3B8" />
              </TouchableOpacity>
              
              {showCalendar && (
                <View className="border border-gray-200 rounded-lg mt-1 bg-white shadow absolute z-10 w-full">
                  <View className="flex-row justify-between items-center px-4 py-2 border-b border-gray-200">
                    <TouchableOpacity 
                      className="flex-row items-center py-1 px-2 border border-gray-200 rounded-md"
                      onPress={toggleYearPicker}
                    >
                      <Text className="mr-1 text-gray-700">
                        {months.find(m => m.value === calendarDate.month)?.name.substring(0, 3)} {calendarDate.year}
                      </Text>
                      <ChevronDown size={16} color="#4A5568" />
                    </TouchableOpacity>
                  </View>
                  
                  {showYearPicker ? (
                    <View className="p-2">
                      <Text className="font-medium text-gray-700 mb-2">Select Month & Year</Text>
                      <View className="flex-row flex-wrap">
                        {months.map((month) => (
                          <TouchableOpacity
                            key={month.value}
                            className={`py-2 px-3 m-1 rounded-md ${
                              month.value === calendarDate.month ? 'bg-[#60A5FA]' : 'bg-gray-100'
                            }`}
                            onPress={() => selectMonth(month.value)}
                          >
                            <Text 
                              className={`text-sm ${
                                month.value === calendarDate.month ? 'text-white' : 'text-gray-700'
                              }`}
                            >
                              {month.name.substring(0, 3)}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                      
                      <Text className="font-medium text-gray-700 my-2">Year</Text>
                      <FlatList
                        data={years}
                        horizontal
                        showsHorizontalScrollIndicator={true}
                        renderItem={({item}) => (
                          <TouchableOpacity
                            className={`py-2 px-4 m-1 rounded-md ${
                              item === calendarDate.year ? 'bg-[#60A5FA]' : 'bg-gray-100'
                            }`}
                            onPress={() => selectYear(item)}
                          >
                            <Text 
                              className={`text-sm ${
                                item === calendarDate.year ? 'text-white' : 'text-gray-700'
                              }`}
                            >
                              {item}
                            </Text>
                          </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item.toString()}
                      />
                    </View>
                  ) : (
                    <Calendar
                      current={`${calendarDate.year}-${String(calendarDate.month).padStart(2, '0')}-01`}
                      onDayPress={handleDateSelect}
                      markedDates={{
                        [selectedDate]: { selected: true, selectedColor: '#60A5FA' }
                      }}
                      theme={{
                        todayTextColor: '#60A5FA',
                        selectedDayBackgroundColor: '#60A5FA',
                        arrowColor: '#60A5FA',
                      }}
                    />
                  )}
              </View>
              )}
            </View>
          ) : (
            <Text className="text-lg text-gray-900">
              {certificate.date !== 'Not specified' ? moment(certificate.date, 'MM/DD/YY').format('MM/DD/YYYY') : 'Not specified'}
            </Text>
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
                onChangeText={(text) => {
                  // Extract only the numeric part
                  const numericValue = text.replace(/[^0-9]/g, '');
                  setCertificate({ 
                    ...certificate, 
                    renewalPeriod: numericValue ? `${numericValue} Days` : '0 Days' 
                  });
                }}
                keyboardType="numeric"
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
            {isEditing ? (
              selectedFile || certificate?.documentUrl ? (
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="bg-[#F8F9FA] rounded-sm w-10 h-10 items-center justify-center">
                      <View className="bg-red-500 w-8 h-5 items-center justify-center">
                        <Text className="text-white text-xs font-bold">PDF</Text>
                      </View>
                    </View>
                    <View className="ml-3">
                      <Text className="font-medium">{selectedFile?.name || certificate?.documentUrl?.split('/').pop()}</Text>
                      <Text className="text-[#718096] text-sm">
                        {selectedFile ? `${selectedFile.date} · ${selectedFile.size}` : 'Existing document'}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row gap-4">
                    <TouchableOpacity
                      onPress={handleChooseFile}
                      className="w-8 h-8 bg-[#EDF2F7] rounded-full items-center justify-center"
                    >
                      <Eye size={20} color="#4A5568" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleRemoveFile}
                      className="w-8 h-8 bg-[#FFF5F5] rounded-full items-center justify-center"
                    >
                      <Trash2 size={20} color="#F56565" />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View className="border border-[#E2E8F0] border-dashed rounded-lg p-6 items-center">
                  <View className="w-16 h-16 mb-3 items-center justify-center">
                    <Image
                      source={{ uri: 'https://cdn-icons-png.flaticon.com/512/337/337946.png' }}
                      className="w-12 h-12"
                      defaultSource={{ uri: 'https://via.placeholder.com/48' }}
                    />
                  </View>
                  <Text className="font-medium text-base mb-1">Upload Certificate</Text>
                  <Text className="text-[#718096] text-sm mb-2">.pdf, .docx, .jpg, .png and .csv are supported</Text>
                  <Text className="text-[#718096] text-xs mb-4">Maximum file size: 14.9MB</Text>

                  <TouchableOpacity
                    className="bg-[#4299E1] py-2 px-4 rounded-md"
                    onPress={handleChooseFile}
                  >
                    <Text className="text-white font-medium">Choose File</Text>
                  </TouchableOpacity>
                </View>
              )
            ) : (
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="bg-[#F8F9FA] rounded-sm w-10 h-10 items-center justify-center">
                    <View className="bg-red-500 w-8 h-5 items-center justify-center">
                      <Text className="text-white text-xs font-bold">PDF</Text>
                    </View>
                  </View>
                  <View className="ml-3">
                    <Text className="font-medium">
                      {certificate?.documentUrl ? certificate.documentUrl.split('/').pop() : 'No document'}
                    </Text>
                    <Text className="text-[#718096] text-sm">
                      10/06/2023 · 321 KB
                    </Text>
                  </View>
                </View>
                {certificate?.documentUrl && (
                  <TouchableOpacity 
                    onPress={() => {
                      if (certificate.documentUrl) {
                        Linking.openURL(certificate.documentUrl);
                      }
                    }}
                  >
                    <Eye size={20} color="#60A5FA" />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Save Button */}
        {isEditing && (
          <TouchableOpacity
            className="bg-[#60A5FA] py-4 rounded-xl items-center mt-4 mb-6"
            onPress={handleSave}
            disabled={isUploading}
          >
            {isUploading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white font-medium text-base">
                Save
              </Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}