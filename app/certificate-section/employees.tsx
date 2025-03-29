import { EmployeeListScreen } from '../../src/screens/certificates';
import { useLocalSearchParams } from 'expo-router';

export default function EmployeeList() {
  // We can access the category ID from the URL
  const { category } = useLocalSearchParams();
  
  return <EmployeeListScreen />;
} 