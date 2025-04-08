import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

// Import subcomponents
import { Header } from './components/Header';
import { HistoryList } from './components/HistoryList';
import { UploadForm } from './components/UploadForm';
import { ServiceProviderList } from './components/ServiceProviderList';
import { ProviderDetailsModal } from './components/ProviderDetailsModal';
import { ServiceProvider, TabType, SubTabType } from './types';

export default function InspectionCertificatesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [mainTab, setMainTab] = useState<TabType>('upload');
  const [subTab, setSubTab] = useState<SubTabType>('upload');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);

  // Function to switch to upload tab
  const handleUploadPress = () => {
    setMainTab('upload');
    setSubTab('upload');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header />

      
      <View className="flex-row px-4 mb-4">
        <TouchableOpacity
          className={`flex-1 py-2 border-b-2 ${mainTab === 'upload' ? 'border-blue-500' : 'border-transparent'}`}
          onPress={() => setMainTab('upload')}
        >
          <Text className={`text-center text-lg ${mainTab === 'upload' ? 'text-blue-500' : 'text-gray-500'}`}>
            Upload & History
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-2 border-b-2 ${mainTab === 'providers' ? 'border-blue-500' : 'border-transparent'}`}
          onPress={() => setMainTab('providers')}
        >
          <Text className={`text-center text-lg ${mainTab === 'providers' ? 'text-blue-500' : 'text-gray-500'}`}>
            Service Providers
          </Text>
        </TouchableOpacity>
      </View>

      {mainTab === 'upload' && (
        <View className="px-4 mb-4">
          <View className="flex-row bg-gray-100 rounded-full p-1">
            <TouchableOpacity
              className={`flex-1 py-2 rounded-full ${subTab === "upload" ? "bg-blue-500" : ""
                }`}
              onPress={() => setSubTab("upload")}
            >
              <Text className={`text-center text-lg font-medium ${subTab === "upload" ? "text-white" : "text-gray-500"
                }`}>
                Upload
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 py-2 rounded-full ${subTab === "history" ? "bg-blue-500" : ""
                }`}
              onPress={() => setSubTab("history")}
            >
              <Text className={`text-center text-lg font-medium ${subTab === "history" ? "text-white" : "text-gray-500"
                }`}>
                History
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {mainTab === 'providers' ? (
        <ServiceProviderList
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onProviderSelect={setSelectedProvider}
        />
      ) : (
        subTab === 'upload' ? (
          <UploadForm />
        ) : (
          <HistoryList onUploadPress={handleUploadPress} />
        )
      )}

      {/* Provider Details Modal */}
      <ProviderDetailsModal
        provider={selectedProvider}
        onClose={() => setSelectedProvider(null)}
      />
    </SafeAreaView>
  );
}