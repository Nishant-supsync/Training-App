import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Modal,
  Image,
  Platform,
  FlatList,
  Alert,
  TouchableWithoutFeedback
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import dayjs from 'dayjs';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { format } from 'date-fns';
import api from '@/src/api/apiService';
import { API_ENDPOINTS } from '@/src/api/endpoints';
import { useAuth } from '@/context/AuthContext';
import * as FileSystem from 'expo-file-system';

// Define the InspectionType interface
interface InspectionType {
  id: number;
  created_at: number;
  name: string;
  is_active: boolean;
  frequency: number;
}

export const UploadForm: React.FC = () => {
  // State for the dropdown modal
  const [dropdownVisible, setDropdownVisible] = useState(false);
  // State for the selected certificate type
  const [selectedType, setSelectedType] = useState<InspectionType | null>(null);
  // State for the document (placeholder for when a document is selected)
  const [selectedDocument, setSelectedDocument] = useState<{name: string, dateUploaded: string, size: string} | null>(null);
  // State for inspection types from API
  const [inspectionTypes, setInspectionTypes] = useState<InspectionType[]>([]);
  // State for loading inspection types
  const [loadingTypes, setLoadingTypes] = useState(false);
  // State for uploading status
  const [isUploading, setIsUploading] = useState(false);
  // State for success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // Get user from auth context
  const { user } = useAuth();
  
  // Form state for new inspection
  const [newInspection, setNewInspection] = useState({
    type: '',
    date: '',
    document: null as DocumentPicker.DocumentPickerAsset | null,
    renewalFrequency: ''
  });
  
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

  // Fetch inspection types from API
  const fetchInspectionTypes = async () => {
    try {
      setLoadingTypes(true);
      const response = await api.get(API_ENDPOINTS.INSPECTION_TYPES);
      setInspectionTypes(response.data);
    } catch (error) {
      console.error('Error fetching inspection types:', error);
    } finally {
      setLoadingTypes(false);
    }
  };

  // Fetch inspection types on component mount
  useEffect(() => {
    fetchInspectionTypes();
  }, []);

  // Handle certificate type selection
  const handleSelectCertificateType = (type: InspectionType) => {
    setSelectedType(type);
    setNewInspection({
      ...newInspection,
      type: type.name,
      renewalFrequency: `${type.frequency} Days`
    });
    setDropdownVisible(false);
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
    setNewInspection({
      ...newInspection,
      date: formattedDate
    });
    setShowCalendar(false);
  };

  // For handling document selection
  const handleDocumentSelection = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/csv'],
        copyToCacheDirectory: true
      });

      if (result.canceled) {
        return;
      }

      const document = result.assets[0];
      setNewInspection({
        ...newInspection,
        document: document
      });
      
      const currentDate = dayjs().format('MM/DD/YYYY');
      setSelectedDocument({
        name: document.name,
        dateUploaded: currentDate,
        size: `${Math.round((document.size || 0) / 1024)} KB`
      });
    } catch (error) {
      console.error('Document picker error:', error);
      Alert.alert('Error', 'There was an error selecting the file');
    }
  };

  // Effect to update the document state when the newInspection.document changes
  useEffect(() => {
    if (newInspection.document) {
      const currentDate = dayjs().format('MM/DD/YYYY');
      setSelectedDocument({
        name: newInspection.document?.name ?? '',
        dateUploaded: currentDate,
        size: `${Math.round((newInspection.document?.size ?? 0) / 1024)} KB`
      });
    }
  }, [newInspection.document]);

  // Handle form submission with API call
  const handleSubmit = async () => {
    if (!selectedType || !newInspection.date || !newInspection.document) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setIsUploading(true);
      
      // Convert date from MM/DD/YY to ISO format for API
      const [month, day, year] = newInspection.date.split('/');
      const fullYear = parseInt(year) + 2000; // Assuming 20xx for two-digit years
      const dateOfInspection = new Date(fullYear, parseInt(month) - 1, parseInt(day)).toISOString();
      
      // Create form data for file upload
      const formData = new FormData();
      
      // Add file to form data
      if (newInspection.document) {
        const fileUri = newInspection.document.uri;
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        
        if (fileInfo.exists) {
          // Get file extension
          const fileExtension = fileUri.split('.').pop() || '';
          const mimeType = getMimeType(fileExtension);
          
          // Create file object for form data
          formData.append('file', {
            uri: fileUri,
            name: newInspection.document.name,
            type: mimeType
          } as any);
        }
      }
      
      // Add other required fields
      formData.append('date_of_inspection', dateOfInspection);
      formData.append('frequency', selectedType ? selectedType.frequency.toString() : '');
      formData.append('uploaded_by', user?.id?.toString() || '');
      formData.append('inspection_certificate_category_id', selectedType ? selectedType.id.toString() : '');
      formData.append('updated_at', new Date().toISOString());
      formData.append('restaurant_uuid', user?.restaurant_id?.toString() || '');
      
      // Make API call to upload inspection certificate
      const response = await api.post(API_ENDPOINTS.INSPECTION_UPLOAD, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Show success modal
      setShowSuccessModal(true);
      
      // Reset form after a delay
      setTimeout(() => {
        setShowSuccessModal(false);
        setSelectedType(null);
        setNewInspection({
          type: '',
          date: '',
          document: null,
          renewalFrequency: ''
        });
        setSelectedDocument(null);
      }, 2000);
      
    } catch (error) {
      console.error('Error uploading inspection certificate:', error);
      Alert.alert('Error', 'Failed to upload inspection certificate. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  // Helper function to get MIME type based on file extension
  const getMimeType = (extension: string): string => {
    const mimeTypes: Record<string, string> = {
      'pdf': 'application/pdf',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'csv': 'text/csv'
    };
    
    return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
  };

  // Success modal view
  const renderSuccessView = () => (
    <View className="flex-1 bg-white p-5">
      <View className="flex-row bg-[#F0FFF4] items-center p-4 rounded-lg border border-[#C6F6D5] mb-6">
        <View className="w-6 h-6 rounded-full bg-[#68D391] items-center justify-center mr-3 flex-shrink-0">
          <Text className="text-white font-bold">✓</Text>
        </View>
        <Text className="text-[#276749] font-medium flex-1 flex-wrap">Your Inspection Certificate has been uploaded!</Text>
      </View>

      <View className="bg-white rounded-lg p-4 shadow">
        <Text className="text-[#718096] mb-3">Certificate</Text>
        <View className="flex-row items-center">
          <View className="w-10 h-12 justify-center items-center mr-3 flex-shrink-0">
            <View className="bg-[#F56565] rounded-sm w-10 h-6 items-center justify-center">
              <Text className="text-white text-xs font-bold">PDF</Text>
            </View>
          </View>
          <View className="flex-1">
            <Text className="font-medium flex-wrap">{selectedDocument?.name}</Text>
            <Text className="text-[#718096] text-sm flex-wrap">
              {selectedDocument?.dateUploaded} · {selectedDocument?.size}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerClassName="p-4">
      {showSuccessModal ? (
        renderSuccessView()
      ) : (
        <>
          {/* Certificate Type Selection */}
          <View className="mb-5">
            <Text className="text-sm text-gray-500 mb-2">Certificate Type</Text>
            <View className="relative">
              <TouchableOpacity 
                className="bg-white border border-gray-200 rounded-lg p-4 flex-row justify-between items-center"
                onPress={() => setDropdownVisible(!dropdownVisible)}
              >
                <Text className={selectedType ? "text-gray-800" : "text-gray-400"}>
                  {selectedType ? selectedType.name : 'Select the type of certificate'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#a0aec0" />
              </TouchableOpacity>

              {dropdownVisible && (
                <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
                  <View className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                    <ScrollView 
                      className="max-h-60"
                      nestedScrollEnabled={true}
                      onTouchStart={(e) => e.stopPropagation()}
                    >
                      {loadingTypes ? (
                        <View className="p-4">
                          <Text className="text-gray-500 text-center">Loading certificate types...</Text>
                        </View>
                      ) : (
                        inspectionTypes.map((type) => (
                          <TouchableOpacity
                            key={type.id}
                            className="p-4 border-b border-gray-100"
                            onPress={() => handleSelectCertificateType(type)}
                          >
                            <Text className="text-gray-900">{type.name}</Text>
                            <Text className="text-sm text-gray-500">Renewal: {type.frequency} days</Text>
                          </TouchableOpacity>
                        ))
                      )}
                    </ScrollView>
                  </View>
                </TouchableWithoutFeedback>
              )}
            </View>
          </View>

          {/* Inspection Certificate Section */}
          <View className="mb-5">
            <Text className="text-sm text-gray-500 mb-2">Inspection Certificate</Text>
            
            {selectedDocument ? (
              // Document preview when a document is selected
              <View className="bg-white rounded-lg p-4 mb-2">
                <View className="flex-row items-center">
                  <View className="bg-red-400 w-9 h-9 rounded justify-center items-center mr-3">
                    <Text className="text-white font-bold">PDF</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-medium mb-1">{selectedDocument.name}</Text>
                    <Text className="text-gray-500 text-xs">
                      {selectedDocument.dateUploaded} · {selectedDocument.size}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => {
                    setSelectedDocument(null);
                    setNewInspection({
                      ...newInspection,
                      document: null
                    });
                  }}>
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              // Upload area when no document is selected
              <View className="bg-white border border-gray-200 border-dashed rounded-lg p-4 items-center py-8">
                <View className="w-12 h-12 rounded-full border border-gray-200 justify-center items-center mb-3">
                  <Ionicons name="document-outline" size={24} color="#94a3b8" />
                </View>
                <Text className="font-medium mb-1">Upload Certificate</Text>
                <Text className="text-gray-400 text-xs mb-4">
                  pdf, docx, and csv are supported
                </Text>
                <TouchableOpacity 
                  className="bg-blue-500 px-4 py-2 rounded-lg"
                  onPress={handleDocumentSelection}
                >
                  <Text className="text-white font-medium">Choose File</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Date Of Inspection */}
          <View className="mb-5">
            <Text className="text-sm text-gray-500 mb-2">Date Of Inspection</Text>
            <View className="relative">
              <TouchableOpacity 
                className="bg-white border border-gray-200 rounded-lg flex-row items-center px-4"
                onPress={toggleCalendar}
              >
                <TextInput
                  className="flex-1 p-4 text-base"
                  placeholder="MM/DD/YY"
                  placeholderTextColor="#A0AEC0"
                  value={newInspection.date}
                  editable={false}
                  pointerEvents="none"
                />
                <Ionicons name="calendar-outline" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Renewal Frequency */}
          <View className="mb-5">
            <Text className="text-sm text-gray-500 mb-2">Renewal Frequency</Text>
            <View className="bg-white border border-gray-200 rounded-lg p-4">
              <Text className={selectedType ? "text-gray-800" : "text-gray-400"}>
                {selectedType ? `${selectedType.frequency} Days` : '-'}
              </Text>
            </View>
          </View>

          {/* Upload Button */}
          <TouchableOpacity 
            className={`py-4 rounded-lg items-center mt-4 ${(!selectedType || !newInspection.date || !selectedDocument || isUploading) ? 'bg-gray-300' : 'bg-blue-500'}`}
            onPress={handleSubmit}
            disabled={!selectedType || !newInspection.date || !selectedDocument || isUploading}
          >
            <Text className={`font-semibold text-base ${(!selectedType || !newInspection.date || !selectedDocument || isUploading) ? 'text-gray-500' : 'text-white'}`}>
              {isUploading ? 'Uploading...' : 'Upload Certificate'}
            </Text>
          </TouchableOpacity>

          {/* Calendar Modal */}
          <Modal
            visible={showCalendar}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowCalendar(false)}
          >
            <View className="flex-1 justify-center items-center bg-black/50">
              <View className="w-10/12 max-h-3/4 bg-white rounded-xl p-4 shadow-lg">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-lg font-bold">Select Date</Text>
                  <TouchableOpacity onPress={() => setShowCalendar(false)}>
                    <Ionicons name="close" size={24} color="#64748b" />
                  </TouchableOpacity>
                </View>
                
                <View className="border border-gray-200 rounded-lg bg-white">
                  <View className="flex-row justify-between items-center px-4 py-2 border-b border-gray-200">
                    <TouchableOpacity 
                      className="flex-row items-center py-1 px-2 border border-gray-200 rounded-md"
                      onPress={toggleYearPicker}
                    >
                      <Text className="mr-1 text-gray-700">
                        {months.find(m => m.value === calendarDate.month)?.name.substring(0, 3)} {calendarDate.year}
                      </Text>
                      <Ionicons name="chevron-down" size={16} color="#4A5568" />
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
                              month.value === calendarDate.month ? 'bg-blue-500' : 'bg-gray-100'
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
                              item === calendarDate.year ? 'bg-blue-500' : 'bg-gray-100'
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
                        [selectedDate]: { selected: true, selectedColor: '#3B82F6' }
                      }}
                      theme={{
                        todayTextColor: '#3B82F6',
                        selectedDayBackgroundColor: '#3B82F6',
                        arrowColor: '#3B82F6',
                      }}
                    />
                  )}
                </View>
              </View>
            </View>
          </Modal>
        </>
      )}
    </ScrollView>
  );
};