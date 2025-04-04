// import React from 'react';
// import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, TextInput } from 'react-native';
// import { IconSymbol } from '@/components/ui/IconSymbol';
// import { ServiceProvider } from '../types';

// interface ServiceProviderListProps {
//   providers: ServiceProvider[];
//   searchQuery: string;
//   setSearchQuery: (query: string) => void;
//   onProviderSelect: (provider: ServiceProvider) => void;
// }

// export const ServiceProviderList: React.FC<ServiceProviderListProps> = ({
//   providers,
//   searchQuery,
//   setSearchQuery,
//   onProviderSelect,
// }) => {
//   const renderProviderItem = ({ item }: { item: ServiceProvider }) => (
//     <TouchableOpacity 
//       style={styles.providerItem}
//       onPress={() => onProviderSelect(item)}
//     >
//       <View style={styles.providerHeader}>
//         <Image 
//           source={{ uri: item.logo }}
//           style={styles.providerLogo}
//         />
//         <View style={styles.providerInfo}>
//           <Text style={styles.providerName}>{item.name}</Text>
//           <Text style={styles.providerService}>{item.primaryService}</Text>
//           <View style={styles.ratingContainer}>
//             {[1, 2, 3, 4, 5].map(star => (
//               <IconSymbol 
//                 key={star}
//                 name={star <= Math.floor(item.rating) ? "star.fill" : (star <= item.rating + 0.5 ? "star.leadinghalf.filled" : "star")}
//                 size={16}
//                 color="#FFAB00"
//               />
//             ))}
//             <Text style={styles.ratingText}>{item.rating}</Text>
//           </View>
//         </View>
//       </View>
//       <Text style={styles.providerDescription} numberOfLines={2}>
//         {item.description}
//       </Text>
//       <View style={styles.providerFooter}>
//         <Text style={styles.locationText}>{item.location}</Text>
//         <TouchableOpacity style={styles.contactButton}>
//           <Text style={styles.contactButtonText}>Contact</Text>
//         </TouchableOpacity>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.searchContainer}>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search providers..."
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//         />
//       </View>

//       <FlatList
//         data={providers}
//         renderItem={renderProviderItem}
//         keyExtractor={item => item.id}
//         contentContainerStyle={styles.listContent}
//         showsVerticalScrollIndicator={false}
//         ListEmptyComponent={() => (
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>No service providers found</Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#E2E8F0',
//   },
//   searchInput: {
//     flex: 1,
//     height: 44,
//     fontSize: 16,
//     color: '#1A2B3C',
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
//   providerItem: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   providerHeader: {
//     flexDirection: 'row',
//     marginBottom: 12,
//   },
//   providerLogo: {
//     width: 60,
//     height: 60,
//     borderRadius: 8,
//     marginRight: 12,
//   },
//   providerInfo: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   providerName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1A2B3C',
//     marginBottom: 4,
//   },
//   providerService: {
//     fontSize: 14,
//     color: '#4A5568',
//     marginBottom: 4,
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   ratingText: {
//     marginLeft: 4,
//     fontSize: 14,
//     color: '#4A5568',
//   },
//   providerDescription: {
//     fontSize: 14,
//     color: '#4A5568',
//     lineHeight: 20,
//     marginBottom: 12,
//   },
//   providerFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   locationText: {
//     fontSize: 14,
//     color: '#4A5568',
//   },
//   contactButton: {
//     backgroundColor: '#2C7BE5',
//     borderRadius: 6,
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//   },
//   contactButtonText: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#4A5568',
//     textAlign: 'center',
//   },
// }); 































import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ServiceProvider } from '../types';

interface ServiceProviderListProps {
  providers: ServiceProvider[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onProviderSelect: (provider: ServiceProvider) => void;
}

const MOCK_SERVICE_PROVIDERS: ServiceProvider[] = [
  {
    id: '1',
    name: 'Elite Inspection Services',
    logo: 'https://example.com/elite-logo.png',
    rating: 2,
    description: 'Professional home inspection services with over 15 years of experience. Certified and insured inspectors.',
    primaryService: 'Home Inspection',
    contactInfo: '212-555-1234',
    location: 'New York, NY'
  },
  {
    id: '2',
    name: 'SafeGuard Inspectors',
    logo: 'https://example.com/safeguard-logo.png',
    rating: 4.9,
    description: 'Comprehensive commercial building inspections. Same-day reports and thermal imaging included.',
    primaryService: 'Commercial Inspection',
    contactInfo: '718-555-5678',
    location: 'Brooklyn, NY'
  },
  {
    id: '3',
    name: 'Quality Property Check',
    logo: 'https://example.com/quality-logo.png',
    rating: 3.7,
    description: 'Detailed residential inspections with free follow-up consultations. Licensed and certified.',
    primaryService: 'Residential Inspection',
    contactInfo: '347-555-9012',
    location: 'Queens, NY'
  },
  {
    id: '4',
    name: 'Pro Building Inspectors',
    logo: 'https://example.com/pro-logo.png',
    rating: 4.6,
    description: 'Specialized in multi-family and apartment building inspections. Over 5000 inspections completed.',
    primaryService: 'Multi-Family Inspection',
    contactInfo: '718-555-3456',
    location: 'Bronx, NY'
  },
  {
    id: '5',
    name: 'Certified Home Check',
    logo: 'https://example.com/certified-logo.png',
    rating: 4.9,
    description: 'Thorough home inspections with same-day digital reports. Serving the tri-state area.',
    primaryService: 'Home Inspection',
    contactInfo: '718-555-7890',
    location: 'Staten Island, NY'
  }
];

export const ServiceProviderList: React.FC<ServiceProviderListProps> = ({
  providers,
  searchQuery,
  setSearchQuery,
  onProviderSelect,
}) => {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  // Filter providers based on rating
  const filteredProviders = MOCK_SERVICE_PROVIDERS.filter(provider => {
    if (selectedRating === null) return true;
    return provider.rating >= selectedRating;
  });

  const renderProviderItem = ({ item }: { item: ServiceProvider }) => (
    <TouchableOpacity 
      className="bg-white rounded-xl p-4 mb-3 flex-row items-center"
      onPress={() => onProviderSelect(item)}
    >
      <View className="flex-row items-center mr-3">
        <IconSymbol
          name="star.fill"
          size={20}
          color="#FFD700"
        />
        <Text className="text-lg font-bold ml-1">{item.rating}</Text>
      </View>
      
      <View className="h-10 w-px bg-gray-200 mx-3" />
      
      <Text className="flex-1 text-lg font-medium">{item.name}</Text>
      
      <View className="bg-gray-100 rounded-full p-3">
        <IconSymbol
          name="chevron.right"
          size={16}
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
            <IconSymbol
              name="xmark"
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
                <IconSymbol
                  key={star}
                  name={star <= rating ? "star.fill" : "star"}
                  size={24}
                  color="#FFD700"
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
            <IconSymbol
              name="magnifyingglass"
              size={18}
              color="#A0AEC0"
            />
            <TextInput
              className="flex-1 ml-2 text-gray-600"
              placeholder="Search by zip code"
              placeholderTextColor="#A0AEC0"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity 
            className="bg-white rounded-full p-3 ml-2 border border-gray-200"
            onPress={() => setShowFilter(true)}
          >
            <IconSymbol
              name="slider.horizontal.3"
              size={18}
              color="#A0AEC0"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Provider List */}
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

      {/* Filter Modal */}
      {showFilter && <FilterModal />}
    </View>
  );
};

export default ServiceProviderList;









// import React from 'react';
// import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
// import { IconSymbol } from '@/components/ui/IconSymbol';
// import { ServiceProvider } from '../types';


// interface ServiceProviderListProps {
//   providers: ServiceProvider[];
//   searchQuery: string;
//   setSearchQuery: (query: string) => void;
//   onProviderSelect: (provider: ServiceProvider) => void;
// }

// export const ServiceProviderList: React.FC<ServiceProviderListProps> = ({
//   providers,
//   searchQuery,
//   setSearchQuery,
//   onProviderSelect,
// }) => {
//   const renderProviderItem = ({ item }: { item: ServiceProvider }) => (
//     <TouchableOpacity 
//       className="bg-white rounded-2xl p-5 mb-4 shadow-sm"
//       onPress={() => onProviderSelect(item)}
//     >
//       {/* Star rating and name in a row */}
//       <View className="flex-row items-center">
//         <View className="flex-row items-center">
//           <IconSymbol
//             name="star.fill"
//             size={20}
//             color="#FFAB00"
//           />
//           <Text className="text-xl font-bold ml-1 text-gray-800">{item.rating}</Text>
//         </View>
        
//         <View className="w-px h-9 bg-gray-200 mx-3" />
        
//         <Text className="flex-1 text-lg font-medium text-gray-800">{item.name}</Text>
        
//         <View className="bg-gray-100 rounded-full p-3">
//           <IconSymbol
//             name="chevron.right"
//             size={16}
//             color="#6B7280"
//           />
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View className="flex-1 bg-gray-50 p-4">
//       <View className="flex-row items-center mb-6">
//         <View className="flex-1 flex-row items-center bg-white rounded-full px-4 py-2.5 mr-2.5 border border-gray-200 shadow-sm">
//           <IconSymbol
//             name="magnifyingglass"
//             size={18}
//             color="#A0AEC0"
//           />
//           <TextInput
//             className="flex-1 ml-2 text-base text-gray-600"
//             placeholder="Search by zip code"
//             placeholderTextColor="#A0AEC0"
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//           />
//         </View>
//         <TouchableOpacity className="bg-white rounded-full p-3 border border-gray-200 shadow-sm">
//           <IconSymbol
//             name="slider.horizontal.3"
//             size={18}
//             color="#A0AEC0"
//           />
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         data={providers}
//         renderItem={renderProviderItem}
//         keyExtractor={item => item.id}
//         contentContainerStyle={{ paddingBottom: 20 }}
//         showsVerticalScrollIndicator={false}
//         ListEmptyComponent={() => (
//           <View className="items-center py-8">
//             <Text className="text-base text-gray-500">No service providers found</Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// };