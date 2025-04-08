import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Star, ChevronRight, X, Search, SlidersHorizontal } from 'lucide-react-native';
import { ServiceProvider } from '../types';
import api from '@/src/api/apiService';
import { API_ENDPOINTS } from '@/src/api/endpoints';
import { useAuth } from '@/context/AuthContext';

interface ServiceProviderListProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onProviderSelect: (provider: ServiceProvider) => void;
}

// API response type
interface ApiProvider {
  id: number;
  service_provider: string;
  is_active: boolean;
  description: string;
  ratings: number;
  email: string;
  provider_ph_number: string;
  website: string;
}

export const ServiceProviderList: React.FC<ServiceProviderListProps> = ({
  searchQuery,
  setSearchQuery,
  onProviderSelect,
}) => {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch providers from API
  const fetchProviders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(API_ENDPOINTS.PROVIDERS_LIST);
      
      // Transform API response to match ServiceProvider type
      const transformedProviders: ServiceProvider[] = response.data.map((provider: ApiProvider) => ({
        id: provider.id.toString(),
        name: provider.service_provider,
        rating: provider.ratings,
        description: provider.description,
        primaryService: provider.service_provider, // Using service_provider as primaryService
        contactInfo: provider.provider_ph_number,
        location: provider.website // Using website as location since API doesn't provide location
      }));
      
      setProviders(transformedProviders);
    } catch (err) {
      console.error('Error fetching providers:', err);
      setError('Failed to load service providers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Call fetchProviders when component mounts
  useEffect(() => {
    fetchProviders();
  }, []);

  // Filter providers based on search query and rating
  const filteredProviders = providers.filter(provider => {
    // Filter by search query (case insensitive)
    const matchesSearch = searchQuery === '' || 
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by rating
    const matchesRating = selectedRating === null || provider.rating >= selectedRating;
    
    return matchesSearch && matchesRating;
  });

  const renderProviderItem = ({ item }: { item: ServiceProvider }) => (
    <TouchableOpacity 
      className="bg-white rounded-xl p-4 mb-3 flex-row items-center"
      onPress={() => onProviderSelect(item)}
    >
      <View className="flex-row items-center mr-3">
        <Star
          size={20}
          color="#FFD700"
          fill="#FFD700"
        />
        <Text className="text-lg font-bold ml-1">{item.rating}</Text>
      </View>
      
      <View className="h-10 w-px bg-gray-200 mx-3" />
      
      <Text className="flex-1 text-lg font-medium">{item.name}</Text>
      
      <View className="bg-gray-100 rounded-full p-3">
        <ChevronRight
          size={20}
          color="#6B7280"
        />
      </View>
    </TouchableOpacity>
  );

  const FilterModal = () => (
    <View className="absolute inset-0 bg-gray-800/50 z-10 justify-center items-center">
      <View className="bg-white rounded-2xl w-11/12 max-w-md p-6">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-bold">Add Filter</Text>
          <TouchableOpacity onPress={() => setShowFilter(false)}>
            <X
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>

        <Text className="text-gray-500 mb-4">Minimum Rating</Text>
        
        {[5, 4, 3, 2, 1].map((rating) => (
          <TouchableOpacity 
            key={rating}
            className="flex-row items-center my-2"
            onPress={() => setSelectedRating(rating)}
          >
            <View className="flex-row">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={24}
                  color="#FFD700"
                  fill={star <= rating ? "#FFD700" : "none"}
                  strokeWidth={star <= rating ? 0 : 1.5}
                />
              ))}
            </View>
            <View className="ml-auto">
              <View className={`h-5 w-5 rounded-full border-2 border-blue-500 ${selectedRating === rating ? 'bg-blue-500' : 'bg-white'}`} />
            </View>
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity 
          className="bg-blue-500 rounded-full py-4 mt-8"
          onPress={() => setShowFilter(false)}
        >
          <Text className="text-white text-center font-medium">Apply</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="py-4 mt-4 border border-blue-500 rounded-full"
          onPress={() => {
            setSelectedRating(null);
            setShowFilter(false);
          }}
        >
          <Text className="text-blue-500 text-center font-medium">Reset Filter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Search Bar */}
      <View className="px-4 mb-4">
        <View className="flex-row items-center">
          <View className="flex-1 bg-white rounded-full pl-4 pr-2 py-2.5 flex-row items-center border border-gray-200">
            <Search
              size={18}
              color="#A0AEC0"
            />
            <TextInput
              className="flex-1 ml-2 text-gray-600"
              placeholder="Search providers..."
              placeholderTextColor="#A0AEC0"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity 
            className="bg-white rounded-full p-3 ml-2 border border-gray-200"
            onPress={() => setShowFilter(true)}
          >
            <SlidersHorizontal
              size={18}
              color="#A0AEC0"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Loading and Error States */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#4299E1" />
          <Text className="mt-4 text-gray-500">Loading service providers...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-red-500 text-center">{error}</Text>
          <TouchableOpacity 
            className="mt-4 bg-blue-500 px-4 py-2 rounded-full"
            onPress={() => {
              setLoading(true);
              setError(null);
              // Retry fetching
              fetchProviders();
            }}
          >
            <Text className="text-white font-medium">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Provider List */
        <FlatList
          data={filteredProviders}
          renderItem={renderProviderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View className="items-center py-8">
              <Text className="text-gray-500">No service providers found</Text>
            </View>
          )}
        />
      )}

      {/* Filter Modal */}
      {showFilter && <FilterModal />}
    </View>
  );
};

export default ServiceProviderList;