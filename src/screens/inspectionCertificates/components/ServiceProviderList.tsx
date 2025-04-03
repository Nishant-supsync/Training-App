import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ServiceProvider } from '../types';

interface ServiceProviderListProps {
  providers: ServiceProvider[];
  onProviderSelect: (provider: ServiceProvider) => void;
}

export const ServiceProviderList: React.FC<ServiceProviderListProps> = ({ 
  providers, 
  onProviderSelect 
}) => {
  const renderProviderItem = ({ item }: { item: ServiceProvider }) => (
    <TouchableOpacity 
      style={styles.providerItem}
      onPress={() => onProviderSelect(item)}
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
    <FlatList
      data={providers}
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
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
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
    marginLeft: 4,
    fontSize: 14,
    color: '#4A5568',
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
    marginLeft: 4,
    fontSize: 14,
    color: '#4A5568',
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