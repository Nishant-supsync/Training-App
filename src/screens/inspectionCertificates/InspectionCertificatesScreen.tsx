import { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import * as DocumentPicker from 'expo-document-picker';
import moment from 'moment';

// Import subcomponents
import { Header } from './components/Header';
import { HistoryList } from './components/HistoryList';
import { UploadForm } from './components/UploadForm';
import { ServiceProviderList } from './components/ServiceProviderList';
import { ProviderDetailsModal } from './components/ProviderDetailsModal';
import { UploadModal } from './components/UploadModal';
import { InspectionCertificate, ServiceProvider, TabType, SubTabType } from './types';

export default function InspectionCertificatesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [mainTab, setMainTab] = useState<TabType>('upload');
  const [subTab, setSubTab] = useState<SubTabType>('upload');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);

  // Form state for new inspection
  const [newInspection, setNewInspection] = useState({
    type: '',
    date: moment().format('MM/DD/YYYY'),
    document: null as DocumentPicker.DocumentPickerAsset | null
  });

  // Handle document picking
  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true
      });

      if (result.canceled) {
        return;
      }

      setNewInspection({
        ...newInspection,
        document: result.assets[0]
      });
    } catch (error) {
      Alert.alert('Error', 'There was an error selecting the file');
      console.error('Document picker error:', error);
    }
  };

  // Handle adding a new inspection
  const handleAddInspection = async () => {
    try {
      setIsUploading(true);

      // Validate form
      if (!newInspection.type) {
        Alert.alert('Error', 'Please enter an inspection type');
        setIsUploading(false);
        return;
      }

      if (!newInspection.document) {
        Alert.alert('Error', 'Please select a document to upload');
        setIsUploading(false);
        return;
      }

      // In a real app, this would upload the document to a server
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Success
      Alert.alert(
        'Success',
        'Inspection certificate uploaded successfully',
        [{ text: 'OK', onPress: () => setShowUploadModal(false) }]
      );

      // Reset form
      setNewInspection({
        type: '',
        date: moment().format('MM/DD/YYYY'),
        document: null
      });

    } catch (error) {
      Alert.alert('Error', 'Failed to upload inspection certificate');
      console.error('Add inspection error:', error);
    } finally {
      setIsUploading(false);
    }
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
          <UploadForm
            onPickDocument={handlePickDocument}
            onSubmit={handleAddInspection}
            newInspection={newInspection}
            setNewInspection={setNewInspection}
          />
        ) : (
          <HistoryList
            onUploadPress={() => setShowUploadModal(true)}
          />
        )
      )}

      {/* Upload Inspection Modal */}
      <UploadModal
        visible={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        isUploading={isUploading}
        newInspection={newInspection}
        setNewInspection={setNewInspection}
        onPickDocument={handlePickDocument}
        onSubmit={handleAddInspection}
      />

      {/* Provider Details Modal */}
      <ProviderDetailsModal
        provider={selectedProvider}
        onClose={() => setSelectedProvider(null)}
      />
    </SafeAreaView>
  );
}