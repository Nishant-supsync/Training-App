import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  TextInput, 
  Keyboard,
  KeyboardAvoidingView, 
  Platform,
  Dimensions
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bell, Book, AlertTriangle, Search } from 'lucide-react-native';
import moment from 'moment';

export default function HomeScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('your');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmployeeCerts, setFilteredEmployeeCerts] = useState<EmployeeCertificate[]>([]);
  const isManager = true; // This would come from authentication context in a real app
  const scrollViewRef = useRef<ScrollView>(null);
  const searchInputRef = useRef<TextInput>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { height: screenHeight } = Dimensions.get('window');

  // Type definitions for our data
  type CertificateStatus = {
    color: string;
    textColor: string;
    dot: string;
    text: string;
  };

  type MyCertificate = {
    id: string;
    name: string;
    status: CertificateStatus;
    expiryDate?: string;
  };

  type EmployeeCertificate = {
    id: string;
    employeeName: string;
    certificateName: string;
    status: CertificateStatus;
    expiryDate?: string;
  };

  // Helper function to get greeting based on time of day
  const getGreeting = () => {
    const hour = moment().hour();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Certificate status indicators
  const certificateStatus = {
    OVERDUE: { color: 'bg-red-100', textColor: 'text-red-600', dot: 'bg-red-500', text: 'Overdue' },
    UPCOMING: { color: 'bg-orange-100', textColor: 'text-orange-600', dot: 'bg-orange-400', text: 'Upcoming renewal' },
    NOT_SUBMITTED: { color: 'bg-blue-100', textColor: 'text-blue-600', dot: 'bg-blue-400', text: 'Not submitted' },
    VALID: { color: 'bg-green-100', textColor: 'text-green-600', dot: 'bg-green-400', text: 'Up to date' },
  };

  // Mock certificates data
  const myCertificates: MyCertificate[] = [
    {
      id: '1',
      name: 'Food Handler Certificate',
      status: certificateStatus.VALID,
      expiryDate: '2025-07-15'
    },
    {
      id: '2',
      name: 'Fire Safety Training',
      status: certificateStatus.UPCOMING,
      expiryDate: '2024-05-10'
    },
    {
      id: '3',
      name: 'First Aid Certification',
      status: certificateStatus.OVERDUE,
      expiryDate: '2024-02-01'
    },
    {
      id: '4',
      name: 'Workplace Safety Training',
      status: certificateStatus.VALID,
      expiryDate: '2025-03-20'
    },
    {
      id: '5',
      name: 'Food Allergen Awareness',
      status: certificateStatus.UPCOMING,
      expiryDate: '2024-06-15'
    },
    {
      id: '6',
      name: 'ServSafe Manager Certification',
      status: certificateStatus.VALID,
      expiryDate: '2025-09-30'
    }
  ];

  const employeeCertificates: EmployeeCertificate[] = [
    {
      id: '1',
      employeeName: 'Jane Smith',
      certificateName: 'Food Handler Certificate',
      status: certificateStatus.VALID,
      expiryDate: '2025-06-20'
    },
    {
      id: '2',
      employeeName: 'Mike Johnson',
      certificateName: 'First Aid Certification',
      status: certificateStatus.OVERDUE,
      expiryDate: '2024-01-15'
    },
    {
      id: '3',
      employeeName: 'Sarah Williams',
      certificateName: 'Fire Safety Training',
      status: certificateStatus.NOT_SUBMITTED
    },
    {
      id: '4',
      employeeName: 'Tom Brown',
      certificateName: 'Food Allergen Awareness',
      status: certificateStatus.VALID,
      expiryDate: '2025-04-10'
    },
    {
      id: '5',
      employeeName: 'Emily Davis',
      certificateName: 'Workplace Safety Training',
      status: certificateStatus.UPCOMING,
      expiryDate: '2024-04-30'
    },
    {
      id: '6',
      employeeName: 'Chris Wilson',
      certificateName: 'ServSafe Manager Certification',
      status: certificateStatus.OVERDUE,
      expiryDate: '2024-01-01'
    }
  ];

  // Filter employee certificates based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEmployeeCerts(employeeCertificates);
    } else {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = employeeCertificates.filter(cert =>
        cert.employeeName.toLowerCase().includes(lowercaseQuery) ||
        cert.certificateName.toLowerCase().includes(lowercaseQuery)
      );
      setFilteredEmployeeCerts(filtered);
    }
  }, [searchQuery]);

  // Initialize filtered certificates
  useEffect(() => {
    setFilteredEmployeeCerts(employeeCertificates);
  }, []);

  // Enhanced keyboard handling
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardVisible(true);
        setKeyboardHeight(e.endCoordinates.height);
        // Ensure search field is visible when keyboard appears
        if (activeTab === 'employee' && searchInputRef.current) {
          setTimeout(() => {
            scrollViewRef.current?.scrollTo({ y: 0, animated: true });
          }, 100);
        }
      }
    );
    
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [activeTab]);

  // Effect to handle tab change
  useEffect(() => {
    if (keyboardVisible && activeTab === 'your') {
      Keyboard.dismiss();
    }
  }, [activeTab, keyboardVisible]);

  interface InfoCardProps {
    label: string;
    value: string | number;
  }

  const InfoCard = ({ label, value }: InfoCardProps) => {
    return (
      <View className="flex-1 bg-white rounded-xl p-2 mr-2">
        <Text className="text-xs text-gray-500">{label}</Text>
        <Text className="font-medium text-sm">{value}</Text>
      </View>
    );
  };

  // Handle tab change and reset scroll position
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Reset scroll position when changing tabs
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  // Calculate bottom padding based on keyboard state
  const getBottomPadding = () => {
    if (!keyboardVisible) return 'pb-20';
    return Platform.OS === 'ios' ? 'pb-2' : 'pb-4';
  };

  // Calculate content container padding for scroll view
  const getContentContainerStyle = () => {
    const basePadding = 20;
    return { 
      paddingBottom: keyboardVisible 
        ? Math.max(keyboardHeight * 0.5, 120) 
        : basePadding 
    };
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <SafeAreaView className="flex-1 bg-[#F5F5FA]">
        <StatusBar />

        {/* Header - Conditionally hide header when keyboard is visible on Android */}
        <View className={`p-4 ${Platform.OS === 'android' && keyboardVisible && activeTab === 'employee' ? 'hidden' : ''}`}>
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <Image
                source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                className="w-12 h-12 rounded-xl"
              />
              <View className="ml-3">
                <Text className="text-gray-500">{getGreeting()}</Text>
                <Text className="font-semibold text-lg">John 👋</Text>
              </View>
            </View>
            <View className="relative">
              <TouchableOpacity className="p-2 rounded-full bg-white shadow-sm">
                <Bell size={20} color="#6b7280" />
              </TouchableOpacity>
              <View className="absolute top-0 right-0 w-4 h-4 rounded-full bg-red-500 items-center justify-center">
                <Text className="text-white text-xs">3</Text>
              </View>
            </View>
          </View>
        </View>

        <View className={`px-4 flex-1 ${getBottomPadding()}`}>
          {/* Quick Access Hub - Hide when keyboard is visible */}
          {(!keyboardVisible || activeTab === 'your') && (
            <View className="mb-6">
              <Text className="text-lg font-semibold mb-3">Quick Access Hub</Text>
              <View className="flex-row justify-between gap-4">
                <TouchableOpacity
                  className="flex-1 bg-orange-100 rounded-2xl p-4 items-center"
                  onPress={() => router.push('/risk-management')}
                >
                  <View className="h-12 w-12 bg-white rounded-full items-center justify-center mb-2 shadow-sm">
                    <AlertTriangle size={24} color="#FF8A65" />
                  </View>
                  <Text className="font-medium text-center">Risk Management</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 bg-purple-100 rounded-2xl p-4 items-center"
                  onPress={() => alert('Training functionality coming soon!')}
                >
                  <View className="h-12 w-12 bg-white rounded-full items-center justify-center mb-2 shadow-sm">
                    <Book size={24} color="#9B7ADB" />
                  </View>
                  <Text className="font-medium text-center">Training</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Certificates Section */}
          <View className="flex-1">
            {/* Only show certificate title when keyboard is not visible or on your certificates tab */}
            {(!keyboardVisible || activeTab === 'your') && (
              <Text className="text-lg font-semibold mb-3">Certificates</Text>
            )}

            {/* Tab Navigation */}
            <View className="flex-row justify-center items-center border-b border-gray-200 mb-4">
              <TouchableOpacity
                className={`px-4 py-2 ${activeTab === 'your' ? 'border-b-2 border-blue-600' : ''}`}
                onPress={() => handleTabChange('your')}
              >
                <Text className={activeTab === 'your' ? 'text-blue-600 font-medium' : 'text-gray-500'}>
                  Your Certificates
                </Text>
              </TouchableOpacity>

              {isManager && (
                <TouchableOpacity
                  className={`px-4 py-2 ${activeTab === 'employee' ? 'border-b-2 border-blue-600' : ''}`}
                  onPress={() => handleTabChange('employee')}
                >
                  <Text className={activeTab === 'employee' ? 'text-blue-600 font-medium' : 'text-gray-500'}>
                    Employee Certificates
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Certificate List */}
            {activeTab === 'your' ? (
              <ScrollView 
                ref={scrollViewRef}
                className="flex-1" 
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <View>
                  {myCertificates.map((cert) => (
                    <View
                      key={cert.id}
                      className={`flex-row items-center justify-between p-4 rounded-2xl mb-3 ${cert.status.color}`}
                    >
                      <View>
                        <Text className="font-medium text-base">{cert.name}</Text>
                        <View className="flex-row items-center mt-1">
                          <View className={`w-2 h-2 rounded-full mr-2 ${cert.status.dot}`} />
                          <Text className={`text-sm ${cert.status.textColor}`}>{cert.status.text}</Text>
                        </View>
                        {cert.expiryDate && (
                          <Text className="text-gray-500 text-xs mt-1">
                            Expires: {moment(cert.expiryDate).format('MMM D, YYYY')}
                          </Text>
                        )}
                      </View>
                      <TouchableOpacity className="bg-white px-4 py-2 rounded-lg shadow-sm">
                        <Text className="text-blue-600 font-medium">Upload</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </ScrollView>
            ) : (
              <View className="flex-1">
                {/* Always keep the search bar visible when in employee tab */}
                <View className={`flex-row items-center bg-white px-4 py-3 rounded-xl mb-4 shadow-sm border border-gray-100 ${keyboardVisible ? 'z-10' : ''}`}>
                  <Search size={20} color="#9CA3AF" />
                  <TextInput
                    ref={searchInputRef}
                    className="ml-3 flex-1 text-gray-800 text-base leading-none outline-none"
                    placeholder="Search employee or certificate..."
                    placeholderTextColor="#9CA3AF"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onFocus={() => {
                      // Scroll handling is now in the keyboard show listener
                    }}
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')} className="ml-2">
                      <Text className="text-blue-600 font-medium">Clear</Text>
                    </TouchableOpacity>
                  )}
                </View>
                
                <ScrollView 
                  ref={scrollViewRef}
                  className="flex-1" 
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={getContentContainerStyle()}
                >
                  {filteredEmployeeCerts.length > 0 ? (
                    filteredEmployeeCerts.map((cert) => (
                      <View
                        key={cert.id}
                        className={`flex-row items-center justify-between p-4 rounded-2xl mb-3 ${cert.status.color}`}
                      >
                        <View>
                          <Text className="font-medium text-base">{cert.certificateName}</Text>
                          <Text className="text-gray-500 text-xs mb-1">{cert.employeeName}</Text>
                          <View className="flex-row items-center mt-1">
                            <View className={`w-2 h-2 rounded-full mr-2 ${cert.status.dot}`} />
                            <Text className={`text-sm ${cert.status.textColor}`}>{cert.status.text}</Text>
                          </View>
                          {cert.expiryDate && (
                            <Text className="text-gray-500 text-xs mt-1">
                              Expires: {moment(cert.expiryDate).format('MMM D, YYYY')}
                            </Text>
                          )}
                        </View>
                        <TouchableOpacity 
                          className="bg-white px-4 py-2 rounded-lg shadow-sm"
                          onPress={() => {
                            Keyboard.dismiss();
                            // Handle upload functionality
                          }}
                        >
                          <Text className="text-blue-600 font-medium">Upload</Text>
                        </TouchableOpacity>
                      </View>
                    ))
                  ) : (
                    <View className="items-center justify-center py-8">
                      <Text className="text-gray-500">No certificates found</Text>
                    </View>
                  )}
                </ScrollView>
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}