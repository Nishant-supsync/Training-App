import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  TextInput,
  Modal,
  Platform,
  ActivityIndicator,
  Alert,
  Image
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/context/AuthContext';
import * as DocumentPicker from 'expo-document-picker';
import moment from 'moment';

// Define inspection certificate type
type InspectionCertificate = {
  id: string;
  type: string;
  date: string;
  status: 'pass' | 'fail' | 'pending';
  documentUrl?: string;
};

// Define service provider type
type ServiceProvider = {
  id: string;
  name: string;
  logo: string;
  rating: number;
  description: string;
  primaryService: string;
  contactInfo: string;
  location: string;
};

export default function InspectionCertificatesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'history' | 'providers'>('history');
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

  // Mock inspection certificates data
  const inspectionCertificates: InspectionCertificate[] = [
    { 
      id: '1', 
      type: 'Health Department Inspection', 
      date: '2024-03-10',
      status: 'pass',
      documentUrl: 'https://example.com/inspection1.pdf'
    },
    { 
      id: '2', 
      type: 'Fire Safety Inspection', 
      date: '2024-02-15',
      status: 'pass',
      documentUrl: 'https://example.com/inspection2.pdf'
    },
    { 
      id: '3', 
      type: 'Quarterly Kitchen Equipment Inspection', 
      date: '2023-12-05',
      status: 'fail'
    },
    { 
      id: '4', 
      type: 'Annual Building Inspection', 
      date: '2023-10-20',
      status: 'pass',
      documentUrl: 'https://example.com/inspection4.pdf'
    },
  ];

  // Mock service providers data
  const serviceProviders: ServiceProvider[] = [
    {
      id: '1',
      name: 'SafeGuard Inspections',
      logo: 'https://via.placeholder.com/150',
      rating: 4.8,
      description: 'Industry-leading health and safety inspections with certified professionals.',
      primaryService: 'Health Inspections',
      contactInfo: 'contact@safeguard.example.com\n(555) 123-4567',
      location: 'Downtown District'
    },
    {
      id: '2',
      name: 'FireCheck Services',
      logo: 'https://via.placeholder.com/150',
      rating: 4.5,
      description: 'Specialized in fire safety compliance and equipment testing for restaurants.',
      primaryService: 'Fire Safety',
      contactInfo: 'info@firecheck.example.com\n(555) 765-4321',
      location: 'Uptown Area'
    },
    {
      id: '3',
      name: 'KitchenPro Inspections',
      logo: 'https://via.placeholder.com/150',
      rating: 4.2,
      description: 'Complete kitchen equipment inspection and maintenance services.',
      primaryService: 'Kitchen Equipment',
      contactInfo: 'service@kitchenpro.example.com\n(555) 987-6543',
      location: 'West Side District'
    },
    {
      id: '4',
      name: 'ComplianceCheck',
      logo: 'https://via.placeholder.com/150',
      rating: 4.7,
      description: 'Full-service compliance inspections and certification management.',
      primaryService: 'Compliance',
      contactInfo: 'help@compliancecheck.example.com\n(555) 567-8901',
      location: 'East Side District'
    },
  ];

  // Filter inspection certificates
  const getFilteredCertificates = () => {
    if (!searchQuery) return inspectionCertificates;
    return inspectionCertificates.filter(cert => 
      cert.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Filter service providers
  const getFilteredProviders = () => {
    if (!searchQuery) return serviceProviders;
    return serviceProviders.filter(provider => 
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.primaryService.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

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

  // Render certificate item
  const renderCertificateItem = ({ item }: { item: InspectionCertificate }) => (
    <View style={styles.certificateItem}>
      <View style={styles.certificateHeader}>
        <View style={styles.certificateInfo}>
          <IconSymbol name="checkmark.seal.fill" size={24} color="#2C7BE5" />
          <Text style={styles.certificateType}>{item.type}</Text>
        </View>
        <View 
          style={[
            styles.statusBadge,
            item.status === 'pass' ? styles.passBadge : 
            item.status === 'fail' ? styles.failBadge : 
            styles.pendingBadge
          ]}
        >
          <Text style={styles.statusText}>
            {item.status === 'pass' ? 'PASS' : 
             item.status === 'fail' ? 'FAIL' : 
             'PENDING'}
          </Text>
        </View>
      </View>
      <View style={styles.certificateDetails}>
        <Text style={styles.dateText}>
          Date: {moment(item.date).format('MMM D, YYYY')}
        </Text>
        {item.documentUrl ? (
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewButtonText}>View Document</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>Upload Document</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  // Render service provider item
  const renderProviderItem = ({ item }: { item: ServiceProvider }) => (
    <TouchableOpacity 
      style={styles.providerItem}
      onPress={() => setSelectedProvider(item)}
    >
      <View style={styles.providerHeader}>
        <Image 
          source={{ uri: item.logo }}
          style={styles.providerLogo}
        />
        <View style={styles.providerInfo}>
          <Text style={styles.providerName}>{item.name}</Text>
          <Text style={styles.providerService}>{item.primaryService}</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map(star => (
              <IconSymbol 
                key={star}
                name={star <= Math.floor(item.rating) ? "star.fill" : (star <= item.rating + 0.5 ? "star.leadinghalf.filled" : "star")}
                size={16}
                color="#FFAB00"
              />
            ))}
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.providerDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.providerLocation}>
        <IconSymbol name="mappin" size={16} color="#4A5568" />
        <Text style={styles.locationText}>{item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={24} color="#1A2B3C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inspection Certificates</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            Upload & History
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'providers' && styles.activeTab]}
          onPress={() => setActiveTab('providers')}
        >
          <Text style={[styles.tabText, activeTab === 'providers' && styles.activeTabText]}>
            Service Providers
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'history' ? (
        <View style={styles.contentContainer}>
          <View style={styles.actionBar}>
            <View style={styles.searchContainer}>
              <IconSymbol name="magnifyingglass" size={20} color="#9E9E9E" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search inspections..."
                placeholderTextColor="#A0AEC0"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <IconSymbol name="xmark.circle.fill" size={20} color="#9E9E9E" />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity 
              style={styles.uploadCertButton}
              onPress={() => setShowUploadModal(true)}
            >
              <IconSymbol name="plus" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={getFilteredCertificates()}
            renderItem={renderCertificateItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No inspection certificates found</Text>
              </View>
            )}
          />
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <View style={styles.searchContainer}>
            <IconSymbol name="magnifyingglass" size={20} color="#9E9E9E" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search service providers..."
              placeholderTextColor="#A0AEC0"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <IconSymbol name="xmark.circle.fill" size={20} color="#9E9E9E" />
              </TouchableOpacity>
            )}
          </View>
          
          <FlatList
            data={getFilteredProviders()}
            renderItem={renderProviderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No service providers found</Text>
              </View>
            )}
          />
        </View>
      )}
      
      {/* Upload Inspection Modal */}
      <Modal
        visible={showUploadModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Upload Inspection Certificate</Text>
              <TouchableOpacity 
                onPress={() => setShowUploadModal(false)}
                disabled={isUploading}
              >
                <IconSymbol name="xmark" size={24} color="#4A5568" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Inspection Type</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Health Department Inspection"
                placeholderTextColor="#A0AEC0"
                value={newInspection.type}
                onChangeText={(text) => setNewInspection({...newInspection, type: text})}
                editable={!isUploading}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Inspection Date</Text>
              <TextInput
                style={styles.formInput}
                placeholder="MM/DD/YYYY"
                placeholderTextColor="#A0AEC0"
                value={newInspection.date}
                onChangeText={(text) => setNewInspection({...newInspection, date: text})}
                editable={!isUploading}
                keyboardType="numbers-and-punctuation"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Certificate Document</Text>
              <TouchableOpacity 
                style={styles.documentPicker}
                onPress={handlePickDocument}
                disabled={isUploading}
              >
                {newInspection.document ? (
                  <Text style={styles.documentName} numberOfLines={1} ellipsizeMode="middle">
                    {newInspection.document.name}
                  </Text>
                ) : (
                  <Text style={styles.documentPlaceholder}>
                    Tap to select a document (PDF or image)
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.uploadCertificateButton}
              onPress={handleAddInspection}
              disabled={isUploading}
            >
              {isUploading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.uploadCertificateButtonText}>Upload Certificate</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Provider Details Modal */}
      <Modal
        visible={!!selectedProvider}
        animationType="slide"
        transparent={true}
      >
        {selectedProvider && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Service Provider</Text>
                <TouchableOpacity onPress={() => setSelectedProvider(null)}>
                  <IconSymbol name="xmark" size={24} color="#4A5568" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.providerDetailHeader}>
                <Image 
                  source={{ uri: selectedProvider.logo }}
                  style={styles.providerDetailLogo}
                />
                <View style={styles.providerDetailInfo}>
                  <Text style={styles.providerDetailName}>{selectedProvider.name}</Text>
                  <Text style={styles.providerDetailService}>{selectedProvider.primaryService}</Text>
                  <View style={styles.ratingContainer}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <IconSymbol 
                        key={star}
                        name={star <= Math.floor(selectedProvider.rating) ? "star.fill" : (star <= selectedProvider.rating + 0.5 ? "star.leadinghalf.filled" : "star")}
                        size={16}
                        color="#FFAB00"
                      />
                    ))}
                    <Text style={styles.ratingText}>{selectedProvider.rating}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>About</Text>
                <Text style={styles.providerDetailDescription}>
                  {selectedProvider.description}
                </Text>
              </View>
              
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Location</Text>
                <View style={styles.providerLocation}>
                  <IconSymbol name="mappin" size={16} color="#4A5568" />
                  <Text style={styles.locationText}>{selectedProvider.location}</Text>
                </View>
              </View>
              
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Contact Information</Text>
                <Text style={styles.contactInfo}>{selectedProvider.contactInfo}</Text>
              </View>
              
              <TouchableOpacity style={styles.contactButton}>
                <Text style={styles.contactButtonText}>Contact Provider</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A2B3C',
  },
  headerRight: {
    width: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2C7BE5',
  },
  tabText: {
    fontSize: 16,
    color: '#4A5568',
  },
  activeTabText: {
    color: '#2C7BE5',
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  actionBar: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A2B3C',
    marginLeft: 8,
    height: 44,
  },
  uploadCertButton: {
    backgroundColor: '#2C7BE5',
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  listContent: {
    paddingBottom: 20,
  },
  certificateItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  certificateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  certificateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  certificateType: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A2B3C',
    marginLeft: 10,
    flex: 1,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  passBadge: {
    backgroundColor: '#EDF7ED',
  },
  failBadge: {
    backgroundColor: '#FDEDED',
  },
  pendingBadge: {
    backgroundColor: '#FFF8E6',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  certificateDetails: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
  },
  dateText: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 12,
  },
  uploadButton: {
    backgroundColor: '#2C7BE5',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  viewButton: {
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  viewButtonText: {
    color: '#2C7BE5',
    fontSize: 14,
    fontWeight: '500',
  },
  providerItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  providerHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  providerLogo: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  providerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A2B3C',
    marginBottom: 4,
  },
  providerService: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#4A5568',
    marginLeft: 4,
  },
  providerDescription: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 12,
  },
  providerLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#4A5568',
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#4A5568',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A2B3C',
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4A5568',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1A2B3C',
  },
  documentPicker: {
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentPlaceholder: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  documentName: {
    fontSize: 14,
    color: '#1A2B3C',
  },
  uploadCertificateButton: {
    backgroundColor: '#2C7BE5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  uploadCertificateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  providerDetailHeader: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  providerDetailLogo: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  providerDetailInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  providerDetailName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A2B3C',
    marginBottom: 4,
  },
  providerDetailService: {
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 4,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A2B3C',
    marginBottom: 8,
  },
  providerDetailDescription: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 20,
  },
  contactInfo: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 20,
  },
  contactButton: {
    backgroundColor: '#2C7BE5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});