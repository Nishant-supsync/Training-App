import React from 'react';
import { View, Text, TouchableOpacity, Image, Modal, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ServiceProvider } from '../types';

interface ProviderDetailsModalProps {
  provider: ServiceProvider | null;
  onClose: () => void;
}

export const ProviderDetailsModal: React.FC<ProviderDetailsModalProps> = ({
  provider,
  onClose,
}) => {
  if (!provider) return null;

  return (
    <Modal
      visible={!!provider}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Service Provider</Text>
            <TouchableOpacity onPress={onClose}>
              <IconSymbol name="xmark" size={24} color="#4A5568" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.providerDetailHeader}>
            <Image 
              source={{ uri: provider.logo }}
              style={styles.providerDetailLogo}
            />
            <View style={styles.providerDetailInfo}>
              <Text style={styles.providerDetailName}>{provider.name}</Text>
              <Text style={styles.providerDetailService}>{provider.primaryService}</Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map(star => (
                  <IconSymbol 
                    key={star}
                    name={star <= Math.floor(provider.rating) ? "star.fill" : (star <= provider.rating + 0.5 ? "star.leadinghalf.filled" : "star")}
                    size={16}
                    color="#FFAB00"
                  />
                ))}
                <Text style={styles.ratingText}>{provider.rating}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.providerDetailDescription}>
              {provider.description}
            </Text>
          </View>
          
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.providerLocation}>
              <IconSymbol name="mappin" size={16} color="#4A5568" />
              <Text style={styles.locationText}>{provider.location}</Text>
            </View>
          </View>
          
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <Text style={styles.contactInfo}>{provider.contactInfo}</Text>
          </View>
          
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>Contact Provider</Text>
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
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#4A5568',
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
  providerLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#4A5568',
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