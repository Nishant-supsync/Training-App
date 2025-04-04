import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, ActivityIndicator, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import * as DocumentPicker from 'expo-document-picker';

interface UploadModalProps {
  visible: boolean;
  onClose: () => void;
  isUploading: boolean;
  newInspection: {
    type: string;
    date: string;
    document: DocumentPicker.DocumentPickerAsset | null;
  };
  setNewInspection: (inspection: any) => void;
  onPickDocument: () => Promise<void>;
  onSubmit: () => Promise<void>;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  visible,
  onClose,
  isUploading,
  newInspection,
  setNewInspection,
  onPickDocument,
  onSubmit,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Upload Inspection Certificate</Text>
            <TouchableOpacity 
              onPress={onClose}
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
              onPress={onPickDocument}
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
            onPress={onSubmit}
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
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '90%',
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
    fontWeight: '600',
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
  },
  documentName: {
    fontSize: 14,
    color: '#2C7BE5',
    textAlign: 'center',
  },
  documentPlaceholder: {
    fontSize: 14,
    color: '#A0AEC0',
    textAlign: 'center',
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
}); 