import { UploadCertificateScreen } from '../../src/screens/certificates';
import { useLocalSearchParams } from 'expo-router';

export default function UploadCertificate() {
  // We can access the category ID from the URL if coming from category page
  const { category } = useLocalSearchParams();
  
  return <UploadCertificateScreen />;
} 