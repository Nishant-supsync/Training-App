import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Image,
  Platform,
  FlatList,
  Alert
} from 'react-native';
import { Calendar as CalendarIcon, X, Trash, ChevronDown } from 'lucide-react-native';
import { API_ENDPOINTS } from '@/src/api/endpoints';
import api from '@/src/api/apiService';
import { useAuth } from '@/context/AuthContext';
import { Calendar } from 'react-native-calendars';
import { format, parse } from 'date-fns';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

type FileType = {
  name: string;
  size: string;
  date: string;
  uri: string;
  type: string;
  sizeBytes: number;
} | null;

type CertificateDataType = {
  title: string;
  issueDate: string;
  expiryDate: string;
  recipientName: string;
  restaurantAccount: string;
  file: FileType;
};

type CertificateUploadModalProps = {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employeeId: string;
  categoryId: string;
};

export function CertificateUploadModal({ 
  visible, 
  onClose, 
  onSuccess,
  employeeId,
  categoryId
}: CertificateUploadModalProps) {
  const { user } = useAuth();
  const [uploadStatus, setUploadStatus] = useState<null | 'uploading' | 'success'>(null);
  const [certificateData, setCertificateData] = useState<CertificateDataType>({
    title: '',
    issueDate: '',
    expiryDate: '',
    recipientName: '',
    restaurantAccount: '',
    file: null
  });
  
  // Calendar states
  const [showIssueCalendar, setShowIssueCalendar] = useState(false);
  const [showExpiryCalendar, setShowExpiryCalendar] = useState(false);
  const [selectedIssueDate, setSelectedIssueDate] = useState('');
  const [selectedExpiryDate, setSelectedExpiryDate] = useState('');
  
  // Year-month picker states
  const [showIssueYearPicker, setShowIssueYearPicker] = useState(false);
  const [showExpiryYearPicker, setShowExpiryYearPicker] = useState(false);
  const [issueCalendarDate, setIssueCalendarDate] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });
  const [expiryCalendarDate, setExpiryCalendarDate] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });
  
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

  const handleInputChange = (field: keyof CertificateDataType, value: string) => {
    setCertificateData({
      ...certificateData,
      [field]: value
    });
  };

  // Toggle issue date calendar visibility
  const toggleIssueCalendar = () => {
    setShowIssueCalendar(!showIssueCalendar);
    if (showExpiryCalendar) setShowExpiryCalendar(false);
    if (showIssueYearPicker) setShowIssueYearPicker(false);
    if (showExpiryYearPicker) setShowExpiryYearPicker(false);
  };

  // Toggle expiry date calendar visibility
  const toggleExpiryCalendar = () => {
    setShowExpiryCalendar(!showExpiryCalendar);
    if (showIssueCalendar) setShowIssueCalendar(false);
    if (showIssueYearPicker) setShowIssueYearPicker(false);
    if (showExpiryYearPicker) setShowExpiryYearPicker(false);
  };

  // Toggle issue date year picker
  const toggleIssueYearPicker = () => {
    setShowIssueYearPicker(!showIssueYearPicker);
    setShowExpiryYearPicker(false);
  };

  // Toggle expiry date year picker
  const toggleExpiryYearPicker = () => {
    setShowExpiryYearPicker(!showExpiryYearPicker);
    setShowIssueYearPicker(false);
  };

  // Select year for issue date
  const selectIssueYear = (year: number) => {
    setIssueCalendarDate({ ...issueCalendarDate, year });
    setShowIssueYearPicker(false);
  };

  // Select month for issue date
  const selectIssueMonth = (month: number) => {
    setIssueCalendarDate({ ...issueCalendarDate, month });
    setShowIssueYearPicker(false);
  };

  // Select year for expiry date
  const selectExpiryYear = (year: number) => {
    setExpiryCalendarDate({ ...expiryCalendarDate, year });
    setShowExpiryYearPicker(false);
  };

  // Select month for expiry date
  const selectExpiryMonth = (month: number) => {
    setExpiryCalendarDate({ ...expiryCalendarDate, month });
    setShowExpiryYearPicker(false);
  };

  // Handle date selection for issue date
  const handleIssueSelect = (day: any) => {
    // Format the date from YYYY-MM-DD to MM/DD/YY
    const selectedDate = new Date(day.dateString);
    const formattedDate = format(selectedDate, 'MM/dd/yy');
    
    setSelectedIssueDate(day.dateString);
    handleInputChange('issueDate', formattedDate);
    setShowIssueCalendar(false);
  };

  // Handle date selection for expiry date
  const handleExpirySelect = (day: any) => {
    // Format the date from YYYY-MM-DD to MM/DD/YY
    const selectedDate = new Date(day.dateString);
    const formattedDate = format(selectedDate, 'MM/dd/yy');
    
    setSelectedExpiryDate(day.dateString);
    handleInputChange('expiryDate', formattedDate);
    setShowExpiryCalendar(false);
  };

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
        // User canceled the document picking
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
      
      setCertificateData({
        ...certificateData,
        file: {
          name: fileAsset.name,
          size: fileSizeStr,
          date: format(new Date(), 'MM/dd/yyyy'),
          uri: fileAsset.uri,
          type: fileAsset.mimeType || '',
          sizeBytes: fileAsset.size || 0
        }
      });
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert(
        "Error",
        "There was an error selecting the document. Please try again."
      );
    }
  };

  const handleRemoveFile = () => {
    setCertificateData({
      ...certificateData,
      file: null
    });
  };

  const handleUpload = async () => {
    // Validate required fields
    if (!certificateData.title) {
      Alert.alert("Missing Information", "Please enter a title for the certificate.");
      return;
    }
    
    if (!certificateData.issueDate) {
      Alert.alert("Missing Information", "Please select an issue date.");
      return;
    }
    
    if (!certificateData.expiryDate) {
      Alert.alert("Missing Information", "Please select an expiry date.");
      return;
    }
    
    if (!certificateData.recipientName) {
      Alert.alert("Missing Information", "Please enter the recipient's name.");
      return;
    }
    
    if (!certificateData.file) {
      Alert.alert("Missing File", "Please select a certificate file to upload.");
      return;
    }
    
    setUploadStatus('uploading');
    
    try {
      // Parse dates to timestamps for API
      const issueDate = parse(certificateData.issueDate, 'MM/dd/yy', new Date()).getTime();
      const expiryDate = parse(certificateData.expiryDate, 'MM/dd/yy', new Date()).getTime();
      
      // Create FormData for API submission
      const formData = new FormData();
      
      // Append file as blob
      formData.append('file', {
        uri: certificateData.file.uri,
        type: certificateData.file.type,
        name: certificateData.file.name,
      } as any);
      
      // Append all other certificate data with correct field names
      formData.append('name', certificateData.title);
      formData.append('restaurant_employee_id', employeeId);
      formData.append('certificate_category_id', categoryId);
      formData.append('renewal_frequency', '0');
      formData.append('issue_date', issueDate.toString());
      formData.append('expiry_date', expiryDate.toString());
      formData.append('name_of_the_recipient', certificateData.recipientName);
      formData.append('is_latest', 'true');
      formData.append('restaurant_uuid', user?.restaurant_id?.toString() || '0');
      
      // Send data to the API
      const response = await fetch('https://x0n1-tbv3-v8eo.n7.xano.io/api:q3fDEZGm/certificates/add', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formData
      });

      console.log('response correct output', response);

      
      if (!response.ok) {
        console.log('response output', response);
        const errorData = await response.text();
        console.error('API error response:', errorData);
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log('Upload success:', responseData);
      
      // Set success state and trigger callback
      setUploadStatus('success');
      onSuccess();
      
      // Reset form after successful upload
      setTimeout(() => {
        setUploadStatus(null);
        onClose();
        setCertificateData({
          title: '',
          issueDate: '',
          expiryDate: '',
          recipientName: '',
          restaurantAccount: '',
          file: null
        });
      }, 2000);
    } catch (error) {
      console.error('Error uploading certificate:', error);
      setUploadStatus(null);
      Alert.alert(
        "Upload Failed",
        "There was an error uploading the certificate. Please try again."
      );
    }
  };

  // Success view for the modal
  const renderSuccessView = () => (
    <View className="flex-1 bg-white p-5">
      <View className="flex-row bg-[#F0FFF4] items-center p-4 rounded-lg border border-[#C6F6D5] mb-6">
        <View className="w-6 h-6 rounded-full bg-[#68D391] items-center justify-center mr-3">
          <Text className="text-white font-bold">✓</Text>
        </View>
        <Text className="text-[#276749] font-medium">Your Certificate has been uploaded!</Text>
      </View>

      <View className="bg-white rounded-lg p-4 shadow">
        <Text className="text-[#718096] mb-3">Certificate</Text>
        <View className="flex-row items-center">
          <View className="w-10 h-12 justify-center items-center mr-3">
            <View className="bg-[#F56565] rounded-sm w-10 h-6 items-center justify-center">
              <Text className="text-white text-xs font-bold">PDF</Text>
            </View>
          </View>
          <View>
            <Text className="font-medium">{certificateData.file?.name}</Text>
            <Text className="text-[#718096] text-sm">
              {certificateData.file?.date} · {certificateData.file?.size}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  // Upload form for the modal
  const renderUploadForm = () => (
    <ScrollView className="bg-white px-5">
      <View className="py-4">
        <Text className="text-[#718096] mb-2">Title</Text>
        <TextInput
          className="border border-[#E2E8F0] rounded-lg p-3 text-base bg-white"
          placeholder="Enter your title"
          placeholderTextColor="#A0AEC0"
          value={certificateData.title}
          onChangeText={(text) => handleInputChange('title', text)}
        />
      </View>

      <View className="py-2">
        <Text className="text-[#718096] mb-2">Issue Date</Text>
        <TouchableOpacity 
          className="border border-[#E2E8F0] rounded-lg flex-row items-center px-3"
          onPress={toggleIssueCalendar}
        >
          <TextInput
            className="flex-1 p-3 text-base"
            placeholder="MM/DD/YY"
            placeholderTextColor="#A0AEC0"
            value={certificateData.issueDate}
            editable={false}
            pointerEvents="none"
          />
          <CalendarIcon size={20} color="#A0AEC0" />
        </TouchableOpacity>
        
        {showIssueCalendar && (
          <View className="border border-[#E2E8F0] rounded-lg mt-1 bg-white shadow">
            <View className="flex-row justify-between items-center px-4 py-2 border-b border-[#E2E8F0]">
              <TouchableOpacity 
                className="flex-row items-center py-1 px-2 border border-[#E2E8F0] rounded-md"
                onPress={toggleIssueYearPicker}
              >
                <Text className="mr-1 text-[#4A5568]">
                  {months.find(m => m.value === issueCalendarDate.month)?.name.substring(0, 3)} {issueCalendarDate.year}
                </Text>
                <ChevronDown size={16} color="#4A5568" />
              </TouchableOpacity>
            </View>
            
            {showIssueYearPicker ? (
              <View className="p-2">
                <Text className="font-medium text-[#4A5568] mb-2">Select Month & Year</Text>
                <View className="flex-row flex-wrap">
                  {months.map((month) => (
                    <TouchableOpacity
                      key={month.value}
                      className={`py-2 px-3 m-1 rounded-md ${
                        month.value === issueCalendarDate.month ? 'bg-[#4299E1]' : 'bg-[#EDF2F7]'
                      }`}
                      onPress={() => selectIssueMonth(month.value)}
                    >
                      <Text 
                        className={`text-sm ${
                          month.value === issueCalendarDate.month ? 'text-white' : 'text-[#4A5568]'
                        }`}
                      >
                        {month.name.substring(0, 3)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                
                <Text className="font-medium text-[#4A5568] my-2">Year</Text>
                <FlatList
                  data={years}
                  horizontal
                  showsHorizontalScrollIndicator={true}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      className={`py-2 px-4 m-1 rounded-md ${
                        item === issueCalendarDate.year ? 'bg-[#4299E1]' : 'bg-[#EDF2F7]'
                      }`}
                      onPress={() => selectIssueYear(item)}
                    >
                      <Text 
                        className={`text-sm ${
                          item === issueCalendarDate.year ? 'text-white' : 'text-[#4A5568]'
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
                current={`${issueCalendarDate.year}-${String(issueCalendarDate.month).padStart(2, '0')}-01`}
                onDayPress={handleIssueSelect}
                markedDates={{
                  [selectedIssueDate]: { selected: true, selectedColor: '#4299E1' }
                }}
                theme={{
                  todayTextColor: '#4299E1',
                  selectedDayBackgroundColor: '#4299E1',
                  arrowColor: '#4299E1',
                }}
              />
            )}
          </View>
        )}
      </View>

      <View className="py-2">
        <Text className="text-[#718096] mb-2">Expiry Date</Text>
        <TouchableOpacity 
          className="border border-[#E2E8F0] rounded-lg flex-row items-center px-3"
          onPress={toggleExpiryCalendar}
        >
          <TextInput
            className="flex-1 p-3 text-base"
            placeholder="MM/DD/YY"
            placeholderTextColor="#A0AEC0"
            value={certificateData.expiryDate}
            editable={false}
            pointerEvents="none"
          />
          <CalendarIcon size={20} color="#A0AEC0" />
        </TouchableOpacity>
        
        {showExpiryCalendar && (
          <View className="border border-[#E2E8F0] rounded-lg mt-1 bg-white shadow">
            <View className="flex-row justify-between items-center px-4 py-2 border-b border-[#E2E8F0]">
              <TouchableOpacity 
                className="flex-row items-center py-1 px-2 border border-[#E2E8F0] rounded-md"
                onPress={toggleExpiryYearPicker}
              >
                <Text className="mr-1 text-[#4A5568]">
                  {months.find(m => m.value === expiryCalendarDate.month)?.name.substring(0, 3)} {expiryCalendarDate.year}
                </Text>
                <ChevronDown size={16} color="#4A5568" />
              </TouchableOpacity>
            </View>
            
            {showExpiryYearPicker ? (
              <View className="p-2">
                <Text className="font-medium text-[#4A5568] mb-2">Select Month & Year</Text>
                <View className="flex-row flex-wrap">
                  {months.map((month) => (
                    <TouchableOpacity
                      key={month.value}
                      className={`py-2 px-3 m-1 rounded-md ${
                        month.value === expiryCalendarDate.month ? 'bg-[#4299E1]' : 'bg-[#EDF2F7]'
                      }`}
                      onPress={() => selectExpiryMonth(month.value)}
                    >
                      <Text 
                        className={`text-sm ${
                          month.value === expiryCalendarDate.month ? 'text-white' : 'text-[#4A5568]'
                        }`}
                      >
                        {month.name.substring(0, 3)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                
                <Text className="font-medium text-[#4A5568] my-2">Year</Text>
                <FlatList
                  data={years}
                  horizontal
                  showsHorizontalScrollIndicator={true}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      className={`py-2 px-4 m-1 rounded-md ${
                        item === expiryCalendarDate.year ? 'bg-[#4299E1]' : 'bg-[#EDF2F7]'
                      }`}
                      onPress={() => selectExpiryYear(item)}
                    >
                      <Text 
                        className={`text-sm ${
                          item === expiryCalendarDate.year ? 'text-white' : 'text-[#4A5568]'
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
                current={`${expiryCalendarDate.year}-${String(expiryCalendarDate.month).padStart(2, '0')}-01`}
                onDayPress={handleExpirySelect}
                markedDates={{
                  [selectedExpiryDate]: { selected: true, selectedColor: '#4299E1' }
                }}
                theme={{
                  todayTextColor: '#4299E1',
                  selectedDayBackgroundColor: '#4299E1',
                  arrowColor: '#4299E1',
                }}
                minDate={new Date().toISOString().split('T')[0]}
              />
            )}
          </View>
        )}
      </View>

      <View className="py-2">
        <Text className="text-[#718096] mb-2">Name Of Recipient</Text>
        <TextInput
          className="border border-[#E2E8F0] rounded-lg p-3 text-base"
          placeholder="Enter recipient name"
          placeholderTextColor="#A0AEC0"
          value={certificateData.recipientName}
          onChangeText={(text) => handleInputChange('recipientName', text)}
        />
      </View>

      <View className="py-2">
        <Text className="text-[#718096] mb-2">Restaurant/Bar Account</Text>
        <TextInput
          className="border border-[#E2E8F0] rounded-lg p-3 text-base"
          placeholder="Restaurant/bar Account they belong to"
          placeholderTextColor="#A0AEC0"
          value={certificateData.restaurantAccount}
          onChangeText={(text) => handleInputChange('restaurantAccount', text)}
        />
      </View>

      <View className="py-2 mb-4">
        <Text className="text-[#718096] mb-2">Image/PDG Of The Certificate</Text>

        {certificateData.file ? (
          <View className="flex-row justify-between border border-[#E2E8F0] rounded-lg p-3">
            <View className="flex-row items-center">
              <View className="bg-[#F8F9FA] rounded-sm w-10 h-10 items-center justify-center">
                <View className="bg-red-500 w-8 h-5 items-center justify-center">
                  <Text className="text-white text-xs font-bold">PDF</Text>
                </View>
              </View>
              <View className="ml-3">
                <Text className="font-medium">{certificateData.file.name}</Text>
                <Text className="text-[#718096] text-sm">
                  {certificateData.file.date} · {certificateData.file.size}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleRemoveFile}
              className="w-8 h-8 bg-[#FFF5F5] rounded-full items-center justify-center"
            >
              <Trash size={20} color="#F56565" />
            </TouchableOpacity>
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
        )}
      </View>

      <TouchableOpacity
        className={`py-4 px-3 rounded-lg items-center mb-8 ${
          certificateData.title && 
          certificateData.issueDate && 
          certificateData.expiryDate && 
          certificateData.recipientName && 
          certificateData.file ? 'bg-[#4299E1]' : 'bg-[#A0AEC0]'
        }`}
        disabled={!certificateData.title || 
                  !certificateData.issueDate || 
                  !certificateData.expiryDate || 
                  !certificateData.recipientName || 
                  !certificateData.file}
        onPress={handleUpload}
      >
        <Text className="text-white font-bold text-base">
          {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View
          className="flex-1 mt-20 bg-white rounded-t-3xl overflow-hidden"
        >
          {/* Modal Header */}
          <View className="flex-row justify-between items-center px-5 py-4 border-b border-[#E2E8F0]">
            <Text className="text-xl font-bold">Upload Certificate</Text>
            <TouchableOpacity
              onPress={() => {
                onClose();
                setUploadStatus(null);
                setCertificateData({
                  title: '',
                  issueDate: '',
                  expiryDate: '',
                  recipientName: '',
                  restaurantAccount: '',
                  file: null
                });
              }}
            >
              <X size={24} color="#718096" />
            </TouchableOpacity>
          </View>

          {/* Modal Content */}
          {uploadStatus === 'success'
            ? renderSuccessView()
            : renderUploadForm()
          }
        </View>
      </View>
    </Modal>
  );
}