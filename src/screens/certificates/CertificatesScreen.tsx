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
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/context/AuthContext';
import * as DocumentPicker from 'expo-document-picker';
import moment from 'moment';

// Define certificate type
type Certificate = {
  id: string;
  name: string;
  status: {
    color: string;
    text: string;
  };
  expiryDate?: string;
  employeeName?: string;
  documentUrl?: string;
};

export default function CertificatesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'manager' | 'employee'>(user?.role === 'manager' ? 'manager' : 'employee');
  const [rememberChoice, setRememberChoice] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(!viewMode);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Certificate status indicators
  const certificateStatus = {
    OVERDUE: { color: '#E53935', text: 'Overdue' },
    UPCOMING: { color: '#FFAB00', text: 'Upcoming renewal' },
    NOT_SUBMITTED: { color: '#9E9E9E', text: 'Not submitted' },
    VALID: { color: '#6FCF97', text: 'Up to date' },
  };

  // Form state for new certificate
  const [newCertificate, setNewCertificate] = useState({
    name: '',
    expiryDate: '',
    document: null as DocumentPicker.DocumentPickerAsset | null
  });

  // Mock employees data
  const employees = [
    { id: '1', name: 'John Doe (You)', avatar: 'https://via.placeholder.com/50', department: 'Kitchen' },
    { id: '2', name: 'Jane Smith', avatar: 'https://via.placeholder.com/50', department: 'Kitchen' },
    { id: '3', name: 'Mike Johnson', avatar: 'https://via.placeholder.com/50', department: 'Service' },
    { id: '4', name: 'Sarah Williams', avatar: 'https://via.placeholder.com/50', department: 'Management' },
  ];

  // Mock certificates data
  const myCertificates = [
    { 
      id: '1', 
      name: 'Food Handler Certificate', 
      status: certificateStatus.VALID,
      expiryDate: '2025-07-15',
      documentUrl: 'https://example.com/cert1.pdf'
    },
    { 
      id: '2', 
      name: 'Fire Safety Training', 
      status: certificateStatus.UPCOMING,
      expiryDate: '2024-05-10',
      documentUrl: 'https://example.com/cert2.pdf'
    },
    { 
      id: '3', 
      name: 'First Aid Certification', 
      status: certificateStatus.OVERDUE,
      expiryDate: '2024-02-01'
    },
    { 
      id: '4', 
      name: 'Alcohol Service License', 
      status: certificateStatus.NOT_SUBMITTED
    },
  ];

  // Mock employee certificates data
  const employeeCertificates: Record<string, Certificate[]> = {
    '2': [
      { 
        id: '1',
        name: 'Food Handler Certificate',
        status: certificateStatus.VALID,
        expiryDate: '2025-06-20',
        employeeName: 'Jane Smith',
        documentUrl: 'https://example.com/jane-cert1.pdf'
      },
      { 
        id: '2',
        name: 'First Aid Certification',
        status: certificateStatus.OVERDUE,
        expiryDate: '2024-01-15',
        employeeName: 'Jane Smith'
      },
    ],
    '3': [
      { 
        id: '1',
        name: 'Food Handler Certificate',
        status: certificateStatus.UPCOMING,
        expiryDate: '2024-04-18',
        employeeName: 'Mike Johnson',
        documentUrl: 'https://example.com/mike-cert1.pdf'
      },
      { 
        id: '2',
        name: 'Fire Safety Training',
        status: certificateStatus.NOT_SUBMITTED,
        employeeName: 'Mike Johnson'
      },
    ],
    '4': [
      { 
        id: '1',
        name: 'Food Handler Certificate',
        status: certificateStatus.VALID,
        expiryDate: '2025-08-22',
        employeeName: 'Sarah Williams',
        documentUrl: 'https://example.com/sarah-cert1.pdf'
      },
      { 
        id: '2',
        name: 'Management Certification',
        status: certificateStatus.VALID,
        expiryDate: '2026-01-30',
        employeeName: 'Sarah Williams',
        documentUrl: 'https://example.com/sarah-cert2.pdf'
      },
    ],
  };

  // Get the selected employee's certificates
  const getDisplayedCertificates = () => {
    if (viewMode === 'employee') {
      return myCertificates;
    } else {
      if (selectedEmployee === '1') {
        return myCertificates;
      } else if (selectedEmployee && employeeCertificates[selectedEmployee]) {
        return employeeCertificates[selectedEmployee];
      }
      return [];
    }
  };

  // Filter employees based on search
  const getFilteredEmployees = () => {
    if (!searchQuery) return employees;
    return employees.filter(employee => 
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Select role for viewing certificates
  const handleRoleSelect = (role: 'manager' | 'employee') => {
    setViewMode(role);
    if (rememberChoice) {
      // In a real app, this would be saved to AsyncStorage
      console.log('Remembering role choice:', role);
    }
    setShowRoleModal(false);
    
    // If manager, default to seeing the user's certificates first
    if (role === 'manager') {
      setSelectedEmployee('1');
    }
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
      
      setNewCertificate({
        ...newCertificate,
        document: result.assets[0]
      });
    } catch (error) {
      Alert.alert('Error', 'There was an error selecting the file');
      console.error('Document picker error:', error);
    }
  };

  // Handle adding a new certificate
  const handleAddCertificate = async () => {
    try {
      setIsUploading(true);
      
      // Validate form
      if (!newCertificate.name) {
        Alert.alert('Error', 'Please enter a certificate name');
        setIsUploading(false);
        return;
      }
      
      // In a real app, this would upload the document to a server
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success
      Alert.alert(
        'Success', 
        'Certificate added successfully',
        [{ text: 'OK', onPress: () => setShowAddModal(false) }]
      );
      
      // Reset form
      setNewCertificate({
        name: '',
        expiryDate: '',
        document: null
      });
      
    } catch (error) {
      Alert.alert('Error', 'Failed to add certificate');
      console.error('Add certificate error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Render employee item
  const renderEmployeeItem = ({ item }: { item: typeof employees[0] }) => (
    <TouchableOpacity 
      style={[styles.employeeItem, selectedEmployee === item.id && styles.selectedEmployeeItem]}
      onPress={() => setSelectedEmployee(item.id)}
    >
      <View style={styles.employeeItemContent}>
        <View style={styles.employeeAvatar}>
          <Text style={styles.employeeInitials}>{item.name.charAt(0)}</Text>
        </View>
        <View style={styles.employeeInfo}>
          <Text style={styles.employeeName}>{item.name}</Text>
          <Text style={styles.employeeDepartment}>{item.department}</Text>
        </View>
      </View>
      {selectedEmployee === item.id && (
        <View style={styles.selectedIndicator}>
          <IconSymbol name="checkmark" size={18} color="#FFFFFF" />
        </View>
      )}
    </TouchableOpacity>
  );

  // Render certificate item
  const renderCertificateItem = ({ item }: { item: Certificate }) => (
    <View style={styles.certificateItem}>
      <View style={styles.certificateHeader}>
        <View style={styles.certificateInfo}>
          <IconSymbol name="doc.text.fill" size={24} color="#2C7BE5" />
          <View style={styles.certificateNameContainer}>
            <Text style={styles.certificateName}>{item.name}</Text>
            {item.employeeName && (
              <Text style={styles.certificateEmployee}>{item.employeeName}</Text>
            )}
          </View>
        </View>
        <View style={[styles.statusIndicator, { backgroundColor: item.status.color }]} />
      </View>
      <View style={styles.certificateDetails}>
        <Text style={styles.statusText}>{item.status.text}</Text>
        {item.expiryDate && (
          <Text style={styles.expiryDate}>
            Expires: {moment(item.expiryDate).format('MMM D, YYYY')}
          </Text>
        )}
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
        <Text style={styles.headerTitle}>Certificates</Text>
        <View style={styles.headerRight} />
      </View>

      {viewMode === 'manager' && (
        <View style={styles.employeeSection}>
          <Text style={styles.sectionTitle}>Select Employee</Text>
          
          <View style={styles.searchContainer}>
            <IconSymbol name="magnifyingglass" size={20} color="#9E9E9E" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or department..."
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
            data={getFilteredEmployees()}
            renderItem={renderEmployeeItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.employeeList}
          />
        </View>
      )}

      <View style={styles.certificateSection}>
        <View style={styles.certificateHeader}>
          <Text style={styles.sectionTitle}>
            {viewMode === 'manager' ? 'Employee Certificates' : 'Your Certificates'}
          </Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <IconSymbol name="plus" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={getDisplayedCertificates()}
          renderItem={renderCertificateItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.certificateList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {viewMode === 'manager' && !selectedEmployee 
                  ? 'Select an employee to view certificates' 
                  : 'No certificates found'}
              </Text>
            </View>
          )}
        />
      </View>
      
      {/* Role Selection Modal */}
      <Modal
        visible={showRoleModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Your Role</Text>
            <Text style={styles.modalText}>
              To view certificates, please select your role:
            </Text>
            
            <TouchableOpacity 
              style={styles.roleButton}
              onPress={() => handleRoleSelect('manager')}
            >
              <Text style={styles.roleButtonText}>Manager</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.roleButton}
              onPress={() => handleRoleSelect('employee')}
            >
              <Text style={styles.roleButtonText}>Employee</Text>
            </TouchableOpacity>
            
            <View style={styles.rememberContainer}>
              <TouchableOpacity 
                style={styles.checkbox}
                onPress={() => setRememberChoice(!rememberChoice)}
              >
                {rememberChoice && <Text style={styles.checkIcon}>✓</Text>}
              </TouchableOpacity>
              <Text style={styles.rememberText}>Remember my choice</Text>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Add Certificate Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Certificate</Text>
              <TouchableOpacity 
                onPress={() => setShowAddModal(false)}
                disabled={isUploading}
              >
                <IconSymbol name="xmark" size={24} color="#4A5568" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Certificate Name</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Food Handler Certificate"
                placeholderTextColor="#A0AEC0"
                value={newCertificate.name}
                onChangeText={(text) => setNewCertificate({...newCertificate, name: text})}
                editable={!isUploading}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Expiry Date (Optional)</Text>
              <TextInput
                style={styles.formInput}
                placeholder="MM/DD/YYYY"
                placeholderTextColor="#A0AEC0"
                value={newCertificate.expiryDate}
                onChangeText={(text) => setNewCertificate({...newCertificate, expiryDate: text})}
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
                {newCertificate.document ? (
                  <Text style={styles.documentName} numberOfLines={1} ellipsizeMode="middle">
                    {newCertificate.document.name}
                  </Text>
                ) : (
                  <Text style={styles.documentPlaceholder}>
                    Tap to select a document (PDF or image)
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.addCertificateButton}
              onPress={handleAddCertificate}
              disabled={isUploading}
            >
              {isUploading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.addCertificateButtonText}>Upload Certificate</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
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
  employeeSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A2B3C',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A2B3C',
    marginLeft: 8,
    height: 44,
  },
  employeeList: {
    paddingRight: 16,
  },
  employeeItem: {
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    width: 160,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  selectedEmployeeItem: {
    borderColor: '#2C7BE5',
    backgroundColor: '#EBF5FF',
  },
  employeeItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  employeeAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2C7BE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  employeeInitials: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A2B3C',
    marginBottom: 4,
  },
  employeeDepartment: {
    fontSize: 12,
    color: '#4A5568',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#2C7BE5',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  certificateSection: {
    flex: 1,
    padding: 16,
  },
  certificateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#2C7BE5',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  certificateList: {
    paddingBottom: 40,
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
  certificateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  certificateNameContainer: {
    marginLeft: 10,
  },
  certificateName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A2B3C',
  },
  certificateEmployee: {
    fontSize: 14,
    color: '#4A5568',
    marginTop: 4,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  certificateDetails: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
    marginTop: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  expiryDate: {
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
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A2B3C',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 20,
  },
  roleButton: {
    backgroundColor: '#2C7BE5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  roleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    color: '#2C7BE5',
    fontSize: 14,
    fontWeight: 'bold',
  },
  rememberText: {
    fontSize: 14,
    color: '#4A5568',
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
  addCertificateButton: {
    backgroundColor: '#2C7BE5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  addCertificateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});