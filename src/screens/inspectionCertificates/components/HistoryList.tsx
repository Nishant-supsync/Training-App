import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { InspectionCertificate } from '../types';
import moment from 'moment';

interface HistoryListProps {
  certificates: InspectionCertificate[];
  onUploadPress: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ certificates, onUploadPress }) => {
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

  return (
    <View style={styles.container}>
      <FlatList
        data={certificates}
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
      
      <TouchableOpacity 
        style={styles.uploadButton}
        onPress={onUploadPress}
      >
        <Text style={styles.uploadButtonText}>Upload Certificate</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#4A5568',
    textAlign: 'center',
  },
}); 