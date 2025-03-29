import { EmployeeCertificatesScreen } from '../../../src/screens/certificates';
import { useLocalSearchParams } from 'expo-router';

export default function EmployeeCertificates() {
  // We can access the employee ID from the URL
  const { id } = useLocalSearchParams();
  
  return <EmployeeCertificatesScreen />;
} 