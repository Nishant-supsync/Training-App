import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity,
  SafeAreaView,
  TextInput
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';

type CategoryType = {
  id: string;
  name: string;
};

export function CertificateCategoriesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [userRole, setUserRole] = useState<'manager' | 'employee' | null>(null);
  
  // Load user role on component mount and handle redirection
  useEffect(() => {
    const loadUserRoleAndRedirect = async () => {
      try {
        // First check if we have a role from params
        let role = params.role as 'manager' | 'employee' | undefined;
        
        if (!role) {
          // Then check temp storage (from role selection)
          const tempRole = await AsyncStorage.getItem('@temp_user_role');
          if (tempRole && (tempRole === 'manager' || tempRole === 'employee')) {
            role = tempRole as 'manager' | 'employee';
          }
        }
        
        if (!role && user?.role) {
          // Use user context from auth
          role = user.role;
        }
        
        if (!role) {
          // Finally check permanent preference
          const savedRole = await AsyncStorage.getItem('@user_role_preference');
          if (savedRole && (savedRole === 'manager' || savedRole === 'employee')) {
            role = savedRole as 'manager' | 'employee';
          } else {
            // Default to employee if no role is found
            role = 'employee';
          }
        }
        
        setUserRole(role);
        
      } catch (error) {
        console.error('Error loading user role:', error);
        setUserRole('employee'); // Default to employee on error
      }
    };
    
    loadUserRoleAndRedirect();
  }, [params.role, user]);
  
  const certificateCategories: CategoryType[] = [
    { id: '1', name: 'Food Manager' },
    { id: '2', name: 'Food Handler' },
    { id: '3', name: 'Allergen awareness' },
    { id: '4', name: 'Alcohol server training' },
    { id: '5', name: 'Sexual harassment prevention - employee' },
    { id: '6', name: 'Sexual harassment prevention - Manager' },
    { id: '7', name: 'CPR, First Aid, AED' },
    { id: '8', name: 'Active Shooter Training' },
    { id: '9', name: 'Cannabis Safety' },
  ];
  
  const handleCategorySelect = (category: CategoryType) => {
    // Route based on user role
    if (userRole === 'employee') {
      // Employees go to their certificates list for the selected category
      router.push({
        pathname: '/certificate-section/employee/1',
        params: { 
          category: category.id,
          categoryName: category.name,
          role: userRole,
          name: user?.name || 'Your'
        }
      } as any);
    } else {
      // Managers go to employee list
      router.push(`/certificate-section/employees?category=${category.id}` as any);
    }
  };
  
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
        <Text style={styles.headerTitle}>Certificates</Text>
        <View style={styles.headerRight} />
      </View>
      
      <Text style={styles.sectionTitle}>Select a certification category</Text>
      
      <View style={styles.searchContainer}>
        <Text>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {certificateCategories.map((category) => (
        <TouchableOpacity 
          key={category.id}
          style={styles.categoryItem}
          onPress={() => handleCategorySelect(category)}
        >
          <Text style={styles.categoryName}>{category.name}</Text>
          <Text>›</Text>
        </TouchableOpacity>
      ))}
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
  headerRight: {
    width: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    padding: 16,
    paddingBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 8,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    padding: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  categoryName: {
    fontSize: 16,
  },
});

export default CertificateCategoriesScreen; 