// import React, { useState } from 'react';
// import { 
//   View, 
//   Text, 
//   TouchableOpacity,
//   ScrollView,
//   TextInput,
//   Platform,
//   StatusBar as RNStatusBar
// } from 'react-native';
// import { StatusBar } from 'expo-status-bar';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import { ChevronLeft, Plus, Search } from 'lucide-react-native';
// import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
// import '@/global.css';

// type CertificateType = {
//   id: string;
//   name: string;
//   date: string;
//   size: string;
// };

// export function EmployeeCertificatesScreen() {
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { id, category, categoryName, employeeName, role } = useLocalSearchParams();
//   const [searchQuery, setSearchQuery] = useState('');
//   const [certificates, setCertificates] = useState<CertificateType[]>([
//     { id: '1', name: 'Certificate_xyz.pdf', date: '10/06/2023', size: '321 KB' },
//     { id: '2', name: 'Certificate_xyz.pdf', date: '10/06/2023', size: '321 KB' },
//     { id: '3', name: 'Certificate_xyz.pdf', date: '10/06/2023', size: '321 KB' },
//     { id: '4', name: 'Certificate_xyz.pdf', date: '10/06/2023', size: '321 KB' },
//   ]);
  
//   // Filter certificates based on search
//   const filteredCertificates = searchQuery 
//     ? certificates.filter(cert => 
//         cert.name.toLowerCase().includes(searchQuery.toLowerCase())
//       )
//     : certificates;
  
//   return (
//     <View 
//       className="flex-1 bg-white"
//       style={{ paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0 }}
//     >
//       <StatusBar style="dark" />
      
//       {/* Header - Light blue background with proper insets */}
//       <View 
//         className="flex-row items-center justify-between bg-[#ECF6FF] px-4"
//         style={{ 
//           paddingTop: Math.max(insets.top, 16),
//           paddingBottom: 16
//         }}
//       >
//         <TouchableOpacity 
//           onPress={() => router.back()}
//           className="p-1"
//         >
//           <ChevronLeft size={24} color="#000" />
//         </TouchableOpacity>
//         <Text className="text-xl font-semibold flex-1 text-center">
//           {employeeName || 'Cameron Williamson'}
//         </Text>
//         <TouchableOpacity 
//           className="w-7 h-7 bg-transparent rounded-md border-2 border-[#44A8FF] items-center justify-center"
//           onPress={() => router.push({
//             pathname: '/certificate-section/upload',
//             params: { 
//               employeeId: id,
//               category,
//               categoryName
//             }
//           } as any)}
//         >
//           <Plus size={20} color="#44A8FF" />
//         </TouchableOpacity>
//       </View>
      
//       <ScrollView className="flex-1">
//         {/* Certificates Title */}
//         <Text className="text-[#718096] text-base px-4 pt-4 pb-2">Certificates</Text>
        
//         {/* Optional: Search Bar */}
//         <View className="px-4 mb-4">
//           <View className="bg-[#F8F9FA] rounded-lg flex-row items-center px-3 py-2">
//             <Search size={20} color="#718096" />
//             <TextInput
//               placeholder="Search certificates"
//               placeholderTextColor="#718096"
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//               className="ml-3 flex-1 py-2 text-gray-800 text-base leading-none outline-none"
//             />
//           </View>
//         </View>
        
//         {filteredCertificates.length === 0 ? (
//           <View className="flex-1 justify-center items-center px-10 py-20">
//             <Text className="text-xl font-bold text-center mb-4">No Certificate Available</Text>
//             <Text className="text-[#4A5568] text-center">
//               Have a certificate from someone else? Please click the plus icon above to upload your certificate.
//             </Text>
//           </View>
//         ) : (
//           <View className="px-4 pb-8">
//             {filteredCertificates.map((cert) => (
//               <View 
//                 key={cert.id}
//                 className="bg-white rounded-xl mb-3 overflow-hidden border border-[#E2E8F0]"
//               >
//                 <View className="flex-row items-center p-2">
//                   <View className="mr-3">
//                     <View className="w-12 h-12 bg-[#F8F9FA] rounded-sm items-center justify-center">
//                       <View className="bg-red-500 w-8 h-5 items-center justify-center rounded-sm">
//                         <Text className="text-white text-xs font-bold">PDF</Text>
//                       </View>
//                     </View>
//                   </View>
//                   <View className="flex-1 ">
//                     <Text className="text-lg font-medium mb-1">{cert.name}</Text>
//                     <Text className="text-[#718096] font-thin text-base">{cert.date} · {cert.size}</Text>
//                   </View>
//                 </View>
//               </View>
//             ))}
//           </View>
//         )}
//       </ScrollView>
//     </View>
//   );
// }

// export default EmployeeCertificatesScreen;



import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Platform,
  StatusBar as RNStatusBar,
  Image
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Plus, Search, Calendar, X, Trash, ArrowLeft } from 'lucide-react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';


type CertificateType = {
  id: string;
  name: string;
  date: string;
  size: string;
};

type FileType = {
  name: string;
  size: string;
  date: string;
} | null;

type CertificateDataType = {
  title: string;
  issueDate: string;
  expiryDate: string;
  recipientName: string;
  restaurantAccount: string;
  file: FileType;
};

export function EmployeeCertificatesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id, category, categoryName, employeeName, role } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<null | 'uploading' | 'success'>(null);
  
  const [certificates, setCertificates] = useState<CertificateType[]>([
    { id: '1', name: 'Certificate_xyz.pdf', date: '10/06/2023', size: '321 KB' },
    { id: '2', name: 'Certificate_xyz.pdf', date: '10/06/2023', size: '321 KB' },
    { id: '3', name: 'Certificate_xyz.pdf', date: '10/06/2023', size: '321 KB' },
    { id: '4', name: 'Certificate_xyz.pdf', date: '10/06/2023', size: '321 KB' },
  ]);
  
  const [certificateData, setCertificateData] = useState<CertificateDataType>({
    title: '',
    issueDate: '',
    expiryDate: '',
    recipientName: '',
    restaurantAccount: '',
    file: null
  });
  
  // Filter certificates based on search
  const filteredCertificates = searchQuery 
    ? certificates.filter(cert => 
        cert.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : certificates;
  
  const handleInputChange = (field: keyof CertificateDataType, value: string) => {
    setCertificateData({
      ...certificateData,
      [field]: value
    });
  };
  
  const handleChooseFile = () => {
    // This would integrate with DocumentPicker in a real app
    setCertificateData({
      ...certificateData,
      file: {
        name: 'Certificate_xyz.pdf',
        size: '321 KB',
        date: '10/06/2023'
      }
    });
  };
  
  const handleRemoveFile = () => {
    setCertificateData({
      ...certificateData,
      file: null
    });
  };
  
  const handleUpload = () => {
    setUploadStatus('uploading');
    
    // Simulate upload
    setTimeout(() => {
      setUploadStatus('success');
      
      // Add the new certificate to the list
      const newCertificate = {
        id: String(certificates.length + 1),
        name: certificateData.file?.name || 'Certificate.pdf',
        date: certificateData.file?.date || new Date().toLocaleDateString(),
        size: certificateData.file?.size || '0 KB',
      };
      
      setCertificates([newCertificate, ...certificates]);
      
      // Reset form after successful upload
      setTimeout(() => {
        setUploadStatus(null);
        setShowUploadModal(false);
        setCertificateData({
          title: '',
          issueDate: '',
          expiryDate: '',
          recipientName: '',
          restaurantAccount: '',
          file: null
        });
      }, 2000);
    }, 1500);
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
        <View className="border border-[#E2E8F0] rounded-lg flex-row items-center px-3">
          <TextInput
            className="flex-1 p-3 text-base"
            placeholder="MM/DD/YY"
            placeholderTextColor="#A0AEC0"
            value={certificateData.issueDate}
            onChangeText={(text) => handleInputChange('issueDate', text)}
          />
          <Calendar size={20} color="#A0AEC0" />
        </View>
      </View>
      
      <View className="py-2">
        <Text className="text-[#718096] mb-2">Expiry Date</Text>
        <View className="border border-[#E2E8F0] rounded-lg flex-row items-center px-3">
          <TextInput
            className="flex-1 p-3 text-base"
            placeholder="MM/DD/YY"
            placeholderTextColor="#A0AEC0"
            value={certificateData.expiryDate}
            onChangeText={(text) => handleInputChange('expiryDate', text)}
          />
          <Calendar size={20} color="#A0AEC0" />
        </View>
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
            <Text className="text-[#718096] text-sm mb-4">.pdf, .docx, JPG and .csv are supported</Text>
            
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
          certificateData.file ? 'bg-[#4299E1]' : 'bg-[#A0AEC0]'
        }`}
        disabled={!certificateData.file}
        onPress={handleUpload}
      >
        <Text className="text-white font-bold text-base">
          {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
  
  return (
    <View 
      className="flex-1 bg-white"
      style={{ paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0 }}
    >
      <StatusBar style="dark" />
      
      {/* Header - Light blue background with proper insets */}
      <View 
        className="flex-row items-center justify-between bg-[#ECF6FF] px-4"
        style={{ 
          paddingTop: Math.max(insets.top, 16),
          paddingBottom: 16
        }}
      >
        <TouchableOpacity 
          onPress={() => router.back()}
          className="p-1"
        >
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold flex-1 text-center">
          {employeeName || 'Cameron Williamson'}
        </Text>
        <TouchableOpacity 
          className="w-7 h-7 rounded-md border border-[#44A8FF] items-center justify-center"
          onPress={() => setShowUploadModal(true)}
        >
          <Plus size={20} color="#44A8FF" />
        </TouchableOpacity>
      </View>
      
      <ScrollView className="flex-1">
        {certificates.length === 0 ? (
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
      <Modal
        visible={showUploadModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowUploadModal(false)}
      >
        <View className="flex-1 bg-black bg-opacity-50">
          <View 
            className="flex-1 mt-20 bg-white rounded-t-3xl overflow-hidden"
            style={{ 
              paddingTop: 0,
              paddingBottom: Math.max(insets.bottom, 8)
            }}
          >
            {/* Modal Header */}
            <View className="flex-row justify-between items-center px-5 py-4 border-b border-[#E2E8F0]">
              <Text className="text-xl font-bold">Upload Certificate</Text>
              <TouchableOpacity 
                onPress={() => {
                  setShowUploadModal(false);
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
    </View>
  );
}

export default EmployeeCertificatesScreen;