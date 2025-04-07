// import HomeScreen from '@/src/screens/home/home';

// export default function Home() {
//   return <HomeScreen />;
// }

import HomeScreen from '@/src/screens/home/home';
import { useAuth } from '@/context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

export default function Home() {
  const { isSignedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2C7BE5" />
      </View>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return <HomeScreen />;
}