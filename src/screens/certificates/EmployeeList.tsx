import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
  ImageSourcePropType
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

type EmployeeType = {
  id: string;
  name: string;
  avatar: ImageSourcePropType;
  certificates: number;
};

export function EmployeeListScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState<'all' | 'available' | 'none'>('all');
  
  // This would be fetched based on the category in a real app
  const employees: EmployeeType[] = [
    { id: '1', name: 'Cameron Williamson', avatar: { uri: 'https://randomuser.me/api/portraits/men/32.jpg' }, certificates: 4 },
    { id: '2', name: 'Cameron Williamson', avatar: { uri: 'https://randomuser.me/api/portraits/men/32.jpg' }, certificates: 0 },
    { id: '3', name: 'Cameron Williamson', avatar: { uri: 'https://randomuser.me/api/portraits/men/32.jpg' }, certificates: 0 },
    { id: '4', name: 'Cameron Williamson', avatar: { uri: 'https://randomuser.me/api/portraits/men/32.jpg' }, certificates: 2 },
    { id: '5', name: 'Cameron Williamson', avatar: { uri: 'https://randomuser.me/api/portraits/men/32.jpg' }, certificates: 2 },
    { id: '6', name: 'Cameron Williamson', avatar: { uri: 'https://randomuser.me/api/portraits/men/32.jpg' }, certificates: 2 },
  ];
  
  const getFilteredEmployees = () => {
    let filtered = employees;
    
    if (searchQuery) {
      filtered = filtered.filter(emp => 
        emp.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (filterValue === 'available') {
      filtered = filtered.filter(emp => emp.certificates > 0);
    } else if (filterValue === 'none') {
      filtered = filtered.filter(emp => emp.certificates === 0);
    }
    
    return filtered;
  };
  
  const handleEmployeeSelect = (employee: EmployeeType) => {
    router.push(`/certificate-section/employee/${employee.id}` as any);
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
        <Text style={styles.headerTitle}>Food Manager</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/certificate-section/upload' as any)}
        >
          <Text>+</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.sectionTitle}>Employees</Text>
      
      <View style={styles.searchContainer}>
        <Text>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, filterValue === 'all' && styles.activeFilter]}
          onPress={() => setFilterValue('all')}
        >
          <Text style={styles.filterButtonText}>All</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterButton, filterValue === 'available' && styles.activeFilter]}
          onPress={() => setFilterValue('available')}
        >
          <Text style={styles.filterButtonText}>Certificate Available</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterButton, filterValue === 'none' && styles.activeFilter]}
          onPress={() => setFilterValue('none')}
        >
          <Text style={styles.filterButtonText}>No Certificate</Text>
        </TouchableOpacity>
      </View>
      
      {getFilteredEmployees().map((employee) => (
        <TouchableOpacity 
          key={employee.id}
          style={styles.employeeItem}
          onPress={() => handleEmployeeSelect(employee)}
        >
          <View style={styles.employeeInfo}>
            <Image source={employee.avatar} style={styles.employeeAvatar} />
            <Text style={styles.employeeName}>{employee.name}</Text>
          </View>
          <View style={styles.employeeStatus}>
            {employee.certificates > 0 ? (
              <Text style={styles.certificateCount}>{employee.certificates} Certificates</Text>
            ) : (
              <Text style={styles.noCertificate}>No Certificates Available</Text>
            )}
            <Text>›</Text>
          </View>
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
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4299E1',
    justifyContent: 'center',
    alignItems: 'center',
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
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 8,
  },
  filterButton: {
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: '#EBF8FF',
    borderColor: '#4299E1',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#4A5568',
  },
  employeeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  employeeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  employeeAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  employeeName: {
    fontSize: 16,
  },
  employeeStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  certificateCount: {
    color: '#4299E1',
    marginRight: 8,
  },
  noCertificate: {
    color: '#A0AEC0',
    marginRight: 8,
  },
});

export default EmployeeListScreen; 