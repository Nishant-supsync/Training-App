import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

type CertificateType = {
  id: string;
  name: string;
  date: string;
  size: string;
};

export function EmployeeCertificatesScreen() {
  const router = useRouter();
  const [certificates, setCertificates] = useState<CertificateType[]>([
    { id: '1', name: 'Certificate_xyz.pdf', date: '10/06/2023', size: '321 KB' },
    { id: '2', name: 'Certificate_xyz.pdf', date: '10/06/2023', size: '321 KB' },
    { id: '3', name: 'Certificate_xyz.pdf', date: '10/06/2023', size: '321 KB' },
    { id: '4', name: 'Certificate_xyz.pdf', date: '10/06/2023', size: '321 KB' },
  ]);
  
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
        <Text style={styles.headerTitle}>Cameron Williamson</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/certificate-section/upload' as any)}
        >
          <Text>+</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.sectionTitle}>Certificates</Text>
      
      {certificates.length === 0 ? (
        <View style={styles.noCertificatesContainer}>
          <Text style={styles.noCertificatesTitle}>No Certificate Available</Text>
          <Text style={styles.noCertificatesText}>
            Have a certificate from someone else? Please click the <Text style={styles.boldText}>plus</Text> icon above to upload your certificate.
          </Text>
        </View>
      ) : (
        <View style={styles.certificatesList}>
          {certificates.map((cert) => (
            <View key={cert.id} style={styles.certificateItem}>
              <View style={styles.certificateIcon}>
                <Text>📄</Text>
              </View>
              <View style={styles.certificateInfo}>
                <Text style={styles.certificateName}>{cert.name}</Text>
                <Text style={styles.certificateDate}>{cert.date} · {cert.size}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
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
  noCertificatesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  noCertificatesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noCertificatesText: {
    textAlign: 'center',
    color: '#4A5568',
    paddingHorizontal: 40,
  },
  boldText: {
    fontWeight: 'bold',
  },
  certificatesList: {
    padding: 16,
  },
  certificateItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  certificateIcon: {
    marginRight: 12,
  },
  certificateInfo: {
    flex: 1,
  },
  certificateName: {
    fontSize: 16,
    marginBottom: 4,
  },
  certificateDate: {
    color: '#718096',
    fontSize: 14,
  },
});

export default EmployeeCertificatesScreen; 