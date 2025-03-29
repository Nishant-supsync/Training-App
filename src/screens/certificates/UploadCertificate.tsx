import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity,
  SafeAreaView,
  TextInput
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

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

export function UploadCertificateScreen() {
  const router = useRouter();
  const [certificateData, setCertificateData] = useState<CertificateDataType>({
    title: '',
    issueDate: '',
    expiryDate: '',
    recipientName: '',
    restaurantAccount: '',
    file: null
  });
  const [uploadStatus, setUploadStatus] = useState<null | 'uploading' | 'success'>(null);
  
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
    }, 1500);
  };
  
  // If upload is successful, show success screen
  if (uploadStatus === 'success') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cameron Williamson</Text>
        </View>
        
        <View style={styles.successContainer}>
          <View style={styles.successBanner}>
            <Text style={styles.successIcon}>✓</Text>
            <Text style={styles.successText}>Your Certificate has been uploaded!</Text>
          </View>
          
          <View style={styles.certificatePreview}>
            <Text style={styles.previewLabel}>Certificate</Text>
            <View style={styles.certificateItem}>
              <View style={styles.certificateIcon}>
                <Text>📄</Text>
              </View>
              <View style={styles.certificateInfo}>
                <Text style={styles.certificateName}>{certificateData.file!.name}</Text>
                <Text style={styles.certificateDate}>
                  {certificateData.file!.date} · {certificateData.file!.size}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cameron Williamson</Text>
      </View>
      
      <View style={styles.uploadContainer}>
        <View style={styles.uploadHeader}>
          <Text style={styles.uploadTitle}>Upload Certificate</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text>×</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Title</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Enter your title"
            value={certificateData.title}
            onChangeText={(text) => handleInputChange('title', text)}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Issue Date</Text>
          <TextInput
            style={styles.formInput}
            placeholder="MM/DD/YY"
            value={certificateData.issueDate}
            onChangeText={(text) => handleInputChange('issueDate', text)}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Expiry Date</Text>
          <TextInput
            style={styles.formInput}
            placeholder="MM/DD/YY"
            value={certificateData.expiryDate}
            onChangeText={(text) => handleInputChange('expiryDate', text)}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Name Of Recipient</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Enter recipient name"
            value={certificateData.recipientName}
            onChangeText={(text) => handleInputChange('recipientName', text)}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Restaurant/Bar Account</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Restaurant/bar Account they belong to"
            value={certificateData.restaurantAccount}
            onChangeText={(text) => handleInputChange('restaurantAccount', text)}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Image/PDF Of The Certificate</Text>
          
          {certificateData.file ? (
            <View style={styles.filePreview}>
              <View style={styles.fileInfo}>
                <Text>📄</Text>
                <View>
                  <Text style={styles.fileName}>{certificateData.file.name}</Text>
                  <Text style={styles.fileDetails}>
                    {certificateData.file.date} · {certificateData.file.size}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={handleRemoveFile}>
                <Text style={styles.removeIcon}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.fileUploader}>
              <View style={styles.uploaderIcon}>
                <Text>📁</Text>
              </View>
              <Text style={styles.uploaderText}>Upload Certificate</Text>
              <Text style={styles.uploaderSubtext}>.pdf, .docx, JPG and csv are supported</Text>
              
              <TouchableOpacity 
                style={styles.chooseFileButton}
                onPress={handleChooseFile}
              >
                <Text style={styles.chooseFileText}>Choose File</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        <TouchableOpacity 
          style={[
            styles.uploadButton, 
            !certificateData.file && styles.uploadButtonDisabled
          ]}
          disabled={!certificateData.file}
          onPress={handleUpload}
        >
          <Text style={styles.uploadButtonText}>Upload</Text>
        </TouchableOpacity>
      </View>
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
    padding: 16,
    backgroundColor: '#F0F4F8',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  uploadContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  uploadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  fileUploader: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 24,
    backgroundColor: '#F7FAFC',
  },
  uploaderIcon: {
    marginBottom: 12,
  },
  uploaderText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  uploaderSubtext: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 16,
  },
  chooseFileButton: {
    backgroundColor: '#4299E1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  chooseFileText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  filePreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileName: {
    marginLeft: 8,
    fontWeight: '500',
  },
  fileDetails: {
    marginLeft: 8,
    fontSize: 12,
    color: '#718096',
  },
  removeIcon: {
    color: '#F56565',
  },
  uploadButton: {
    backgroundColor: '#4299E1',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  uploadButtonDisabled: {
    backgroundColor: '#A0AEC0',
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  successContainer: {
    flex: 1,
    padding: 16,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FFF4',
    borderWidth: 1,
    borderColor: '#C6F6D5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  successIcon: {
    backgroundColor: '#68D391',
    color: '#FFFFFF',
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  successText: {
    color: '#276749',
    fontWeight: '500',
  },
  certificatePreview: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  previewLabel: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 12,
  },
  certificateItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
  },
  certificateIcon: {
    marginRight: 12,
  },
  certificateInfo: {
    flex: 1,
  },
  certificateName: {
    fontSize: 16,
    marginBottom: 4,
  },
  certificateDate: {
    color: '#718096',
    fontSize: 14,
  },
});

export default UploadCertificateScreen;