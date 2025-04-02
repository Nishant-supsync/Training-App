import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

export default function CertificateSection() {
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getRole() {
      const savedRole = await AsyncStorage.getItem('@temp_user_role');
      setRole(savedRole);
      setIsLoading(false);
    }
    getRole();
  }, []);

  if (isLoading) {
    return <View />; // Loading placeholder
  }

  return <Redirect href={`/certificate-section/categories?role=${role}`} />;
} 