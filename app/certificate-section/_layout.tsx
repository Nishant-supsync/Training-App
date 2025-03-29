import { Stack } from 'expo-router';

export default function CertificatesLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index"
        options={{
          headerShown: false,
          title: 'Certificates'
        }}
      />
      <Stack.Screen 
        name="categories"
        options={{
          headerShown: false,
          title: 'Certificate Categories'
        }}
      />
      <Stack.Screen 
        name="employees"
        options={{
          headerShown: false,
          title: 'Employees'
        }}
      />
      <Stack.Screen 
        name="employee/[id]"
        options={{
          headerShown: false,
          title: 'Employee Certificates'
        }}
      />
      <Stack.Screen 
        name="upload"
        options={{
          headerShown: false,
          title: 'Upload Certificate'
        }}
      />
    </Stack>
  );
} 