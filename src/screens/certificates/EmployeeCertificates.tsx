// import React, { useState } from 'react';
// import { 
//   StyleSheet, 
//   View, 
//   Text, 
//   TouchableOpacity,
//   ScrollView
// } from 'react-native';
// import { StatusBar } from 'expo-status-bar';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import { ArrowLeft, Plus, ArrowRight } from 'lucide-react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// type CertificateType = {
//   id: string;
//   name: string;
//   date: string;
//   size: string;
//   status: 'valid' | 'expired' | 'pending';
// };

// export function EmployeeCertificatesScreen() {
//   const router = useRouter();
//   const { id, category, categoryName, employeeName, role } = useLocalSearchParams();
//   const [certificates, setCertificates] = useState<CertificateType[]>([
//     // { id: '1', name: 'Food Handler Certificate.pdf', date: '10/06/2023', size: '321 KB', status: 'valid' },
//     // { id: '2', name: 'Food Safety Training.pdf', date: '10/06/2023', size: '245 KB', status: 'expired' },
//     // { id: '3', name: 'Allergen Awareness.pdf', date: '10/06/2023', size: '189 KB', status: 'pending' },
//   ]);
  
//   const getStatusColor = (status: CertificateType['status']) => {
//     switch (status) {
//       case 'valid': return '#6FCF97';
//       case 'expired': return '#F56565';
//       case 'pending': return '#FFAB00';
//     }
//   };
  
//   const getStatusText = (status: CertificateType['status']) => {
//     switch (status) {
//       case 'valid': return 'Valid';
//       case 'expired': return 'Expired';
//       case 'pending': return 'Pending Review';
//     }
//   };
  
//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar style="dark" />
      
//       <View style={styles.header}>
//         <TouchableOpacity 
//           style={styles.backButton}
//           onPress={() => router.back()}
//         >
//           <ArrowLeft size={24} color="#000" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>{employeeName || 'Your Certificates'}</Text>
//         <TouchableOpacity 
//           style={styles.addButton}
//           onPress={() => router.push({
//             pathname: '/certificate-section/upload',
//             params: { 
//               employeeId: id,
//               category,
//               categoryName
//             }
//           } as any)}
//         >
//           <Plus size={20} color="#FFFFFF" />
//         </TouchableOpacity>
//       </View>
      
//       <Text style={styles.categoryTitle}>{categoryName}</Text>
      
//       {certificates.length === 0 ? (
//         <View style={styles.noCertificatesContainer}>
//           <Text style={styles.noCertificatesTitle}>No Certificates Available</Text>
//           <Text style={styles.noCertificatesText}>
//             {role === 'employee' 
//               ? 'Click the plus icon above to upload your certificate.'
//               : 'Have a certificate from someone else? Please click the  plus icon above to upload your certificate.'}
//           </Text>
//         </View>
//       ) : (
//         <ScrollView style={styles.certificatesList}>
//           {certificates.map((cert) => (
//             <View key={cert.id} style={styles.certificateItem}>
//               <View style={styles.certificateIcon}>
//                 <Text>📄</Text>
//               </View>
//               <View style={styles.certificateInfo}>
//                 <Text style={styles.certificateName}>{cert.name}</Text>
//                 <Text style={styles.certificateDate}>{cert.date} · {cert.size}</Text>
//                 <View style={[styles.statusBadge, { backgroundColor: getStatusColor(cert.status) }]}>
//                   <Text style={styles.statusText}>{getStatusText(cert.status)}</Text>
//                 </View>
//               </View>
//             </View>
//           ))}
//         </ScrollView>
//       )}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#F0F4F8',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E2E8F0',
//   },
//   backButton: {
//     padding: 8,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   addButton: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: '#4299E1',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   categoryTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     padding: 16,
//     paddingBottom: 8,
//     color: '#4A5568',
//   },
//   noCertificatesContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//   },
//   noCertificatesTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   noCertificatesText: {
//     textAlign: 'center',
//     color: '#4A5568',
//     paddingHorizontal: 40,
//   },
//   certificatesList: {
//     flex: 1,
//     padding: 16,
//   },
//   certificateItem: {
//     flexDirection: 'row',
//     backgroundColor: '#FFFFFF',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   certificateIcon: {
//     marginRight: 12,
//   },
//   certificateInfo: {
//     flex: 1,
//   },
//   certificateName: {
//     fontSize: 16,
//     marginBottom: 4,
//   },
//   certificateDate: {
//     color: '#718096',
//     fontSize: 14,
//     marginBottom: 8,
//   },
//   statusBadge: {
//     alignSelf: 'flex-start',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 4,
//   },
//   statusText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: '500',
//   },
// });

// export default EmployeeCertificatesScreen;

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  StatusBar as RNStatusBar
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Plus, Search } from 'lucide-react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import '@/global.css';

type CertificateType = {
  id: string;
  name: string;
  date: string;
  size: string;
};

export function EmployeeCertificatesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id, category, categoryName, employeeName, role } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [certificates, setCertificates] = useState<CertificateType[]>([
    { id: '1', name: 'Certificate_xyz.pdf', date: '10/06/2023', size: '321 KB' },
    { id: '2', name: 'Certificate_xyz.pdf', date: '10/06/2023', size: '321 KB' },
    { id: '3', name: 'Certificate_xyz.pdf', date: '10/06/2023', size: '321 KB' },
    { id: '4', name: 'Certificate_xyz.pdf', date: '10/06/2023', size: '321 KB' },
  ]);
  
  // Filter certificates based on search
  const filteredCertificates = searchQuery 
    ? certificates.filter(cert => 
        cert.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : certificates;
  
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
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold flex-1 text-center">
          {employeeName || 'Cameron Williamson'}
        </Text>
        <TouchableOpacity 
          className="w-7 h-7 bg-transparent rounded-md border-2 border-[#44A8FF] items-center justify-center"
          onPress={() => router.push({
            pathname: '/certificate-section/upload',
            params: { 
              employeeId: id,
              category,
              categoryName
            }
          } as any)}
        >
          <Plus size={20} color="#44A8FF" />
        </TouchableOpacity>
      </View>
      
      <ScrollView className="flex-1">
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
              className="ml-3 flex-1 py-2 text-gray-800 text-base leading-none outline-none"
            />
          </View>
        </View>
        
        {filteredCertificates.length === 0 ? (
          <View className="flex-1 justify-center items-center px-10 py-20">
            <Text className="text-xl font-bold text-center mb-4">No Certificate Available</Text>
            <Text className="text-[#4A5568] text-center">
              Have a certificate from someone else? Please click the plus icon above to upload your certificate.
            </Text>
          </View>
        ) : (
          <View className="px-4 pb-8">
            {filteredCertificates.map((cert) => (
              <View 
                key={cert.id}
                className="bg-white rounded-xl mb-3 overflow-hidden border border-[#E2E8F0]"
              >
                <View className="flex-row items-center p-2">
                  <View className="mr-3">
                    <View className="w-12 h-12 bg-[#F8F9FA] rounded-sm items-center justify-center">
                      <View className="bg-red-500 w-8 h-5 items-center justify-center rounded-sm">
                        <Text className="text-white text-xs font-bold">PDF</Text>
                      </View>
                    </View>
                  </View>
                  <View className="flex-1 ">
                    <Text className="text-lg font-medium mb-1">{cert.name}</Text>
                    <Text className="text-[#718096] font-thin text-base">{cert.date} · {cert.size}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

export default EmployeeCertificatesScreen;