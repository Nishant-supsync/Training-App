// import React from 'react';
// import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
// import { StatusBar } from 'expo-status-bar';
// import { useRouter } from 'expo-router';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { ChevronLeft, Shield, ChevronRight } from 'lucide-react-native';
// import '@/global.css';

// type RiskManagementTile = {
//   id: string;
//   title: string;
//   icon: React.ReactNode;
//   bgColor: string;
//   route?: string;
// };

// import Award from '@/assets/icons/riskManagement/award.png';
// import Certificate from '@/assets/icons/riskManagement/document-text.png';
// import File from '@/assets/icons/riskManagement/clipboardtext.png';
// import Manager from '@/assets/icons/riskManagement/chartsquare.png';
// import Sign from '@/assets/icons/riskManagement/edit.png';
// import Tip from '@/assets/icons/riskManagement/note-2.png';


// export default function RiskManagementScreen() {
//   const router = useRouter();

//   // Custom icon components for the tiles
//   const CertificateIcon = () => (
//     <View className="w-12 h-12 bg-white rounded-full items-center justify-center">
//       <Image source={Award} className="w-6 h-6" />
//     </View>
//   );

//   const InspectionIcon = () => (
//     <View className="w-12 h-12 bg-white rounded-full items-center justify-center">
//       <Image source={Certificate} className="w-6 h-6" />
//     </View>
//   );

//   const IncidentIcon = () => (
//     <View className="w-12 h-12 bg-white rounded-full items-center justify-center">
//       <Image source={File} className="w-6 h-6" />
//     </View>
//   );

//   const ManagersIcon = () => (
//     <View className="w-12 h-12 bg-white rounded-full items-center justify-center">
//       <Image source={Manager} className="w-6 h-6" />
//     </View>
//   );

//   const SignOffsIcon = () => (
//     <View className="w-12 h-12 bg-white rounded-full items-center justify-center">
//       <Image source={Sign} className="w-6 h-6" />
//     </View>
//   );

//   const TipsIcon = () => (
//     <View className="w-12 h-12 bg-white rounded-full items-center justify-center">
//       <Image source={Tip} className="w-6 h-6" />
//     </View>
//   );

//   // Risk management tiles data with exact colors from image
//   const riskManagementTiles: RiskManagementTile[] = [
//     {
//       id: '1',
//       title: 'Your Certificate',
//       icon: <CertificateIcon />,
//       bgColor: 'bg-[#42C6B6]/20',
//       route: '/certificates'
//     },
//     {
//       id: '2',
//       title: 'Inspection Certificate',
//       icon: <InspectionIcon />,
//       bgColor: 'bg-[#E8F1C3]',
//       route: '/inspection-certificates'
//     },
//     {
//       id: '3',
//       title: 'File An Incident Report',
//       icon: <IncidentIcon />,
//       bgColor: 'bg-[#F39873]/20',
//     },
//     {
//       id: '4',
//       title: 'File A Managers Report',
//       icon: <ManagersIcon />,
//       bgColor: 'bg-[#B35CE4]/20',
//     },
//     {
//       id: '5',
//       title: 'Employee Sign-Offs',
//       icon: <SignOffsIcon />,
//       bgColor: 'bg-[#69B9FF]/15',
//     },
//     {
//       id: '6',
//       title: 'Tips',
//       icon: <TipsIcon />,
//       bgColor: 'bg-[#FFF1CA]',
//     },
//   ];

//   const handleTilePress = (tile: RiskManagementTile) => {
//     if (tile.route) {
//       router.push(tile.route as any);
//     } else {
//       alert(`${tile.title} functionality coming soon!`);
//     }
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-[#EBF2F7]"> {/* Exact background color from image */}
//       <StatusBar style="dark" />

//       {/* Header */}
//       <View className="flex-row items-center justify-between px-4 py-3">
//         <TouchableOpacity onPress={() => router.back()}>
//           <ChevronLeft size={24} color="#000" />
//         </TouchableOpacity>
//         <View className="flex-row items-center">
//           <Text className="text-xl font-semibold text-[#1A2B3C]">Risk Management</Text>
//           {/* <View className="ml-2 w-6 h-6 bg-[#E53935] rounded-full items-center justify-center">
//             <Text className="text-white font-medium text-sm">2</Text>
//           </View> */}
//         </View>
//         <View className="w-10" /> {/* Empty view for flex spacing */}
//       </View>

//       <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
//         {/* Character Speech Bubble */}
//         <View className="flex-row mt-2 mb-6">
//           <Image
//             source={require('@/assets/images/riskManagement/delo_wave.png')}
//             className="w-20 h-20"
//             resizeMode="contain"
//           />
//           <View className="flex-1 flex justify-center items-center bg-white p-4 rounded-2xl ml-2">
//             <Text className="text-base text-[#1A2B3C]">
//               DeLo Here! Please submit your monthly safety report.
//             </Text>
//           </View>
//         </View>

//         {/* Insurance Policy Button */}
//         <View className="mb-6">
//           <TouchableOpacity 
//             className="bg-[#60A5FA] rounded-3xl py-4 px-5"
//             style={{
//               shadowColor: 'rgba(96, 165, 250, 0.4)',
//               shadowOffset: { width: 0, height: 4 },
//               shadowRadius: 12,
//               elevation: 8
//             }}
//           >
//             <View className="flex-row items-center justify-between">
//               <View className="flex-row items-center">
//                 <View className="w-12 h-12 bg-white rounded-full items-center justify-center ">
//                   <Shield size={24} color="#3B82F6" />
//                 </View>
//                 <Text className="text-white text-xl font-medium ml-3">
//                   View your Insurance Policy
//                 </Text>
//               </View>
//               <ChevronRight size={24} color="#fff" />
//             </View>
//           </TouchableOpacity>
//         </View>

//         {/* Tiles Grid */}
//         <View className="flex-row flex-wrap justify-between">
//           {riskManagementTiles.map(tile => (
//             <TouchableOpacity
//               key={tile.id}
//               className={`w-[48%] ${tile.bgColor} rounded-3xl p-5 mb-4 `}
//               onPress={() => handleTilePress(tile)}
//             >
//               <View className="items-start">
//                 <View className="mb-3">
//                   {tile.icon}
//                 </View>
//                 <Text className="text-base font-medium text-[#1A2B3C]">
//                   {tile.title}
//                 </Text>
//               </View>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }



import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Shield, ChevronRight } from 'lucide-react-native';
import '@/global.css';
import { useAuth } from '@/context/AuthContext';

import Award from '@/assets/icons/riskManagement/award.png';
import Certificate from '@/assets/icons/riskManagement/document-text.png';
import File from '@/assets/icons/riskManagement/clipboardtext.png';
import Manager from '@/assets/icons/riskManagement/chartsquare.png';
import Sign from '@/assets/icons/riskManagement/edit.png';
import Tip from '@/assets/icons/riskManagement/note-2.png';

export default function RiskManagementScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const riskManagementTiles = [
    {
      id: '1',
      title: 'Your Certificate',
      image: Award,
      bgColor: 'bg-[#42C6B6]/20',
      route: '/certificate-section'
    },
    {
      id: '2',
      title: 'Inspection Certificate',
      image: Certificate,
      bgColor: 'bg-[#E8F1C3]',
      route: '/inspection-certificates'
    },
    {
      id: '3',
      title: 'File An Incident Report',
      image: File,
      bgColor: 'bg-[#F39873]/20',
    },
    {
      id: '4',
      title: 'File A Managers Report',
      image: Manager,
      bgColor: 'bg-[#B35CE4]/20',
    },
    {
      id: '5',
      title: 'Employee Sign-Offs',
      image: Sign,
      bgColor: 'bg-[#69B9FF]/15',
    },
    {
      id: '6',
      title: 'Tips',
      image: Tip,
      bgColor: 'bg-[#FFF1CA]',
    },
  ];

  const handleTilePress = (tile: { id: string; title: string; image: number; bgColor: string; route: string; } | { id: string; title: string; image: number; bgColor: string; route?: undefined; }) => {
    if (tile.route) {
      router.push(tile.route as any);
    } else {
      Alert.alert(`${tile.title} functionality coming soon!`);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#EBF2F7]">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <View className="flex-row items-center">
          <Text className="text-xl font-semibold text-[#1A2B3C]">Risk Management</Text>
        </View>
        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Character Speech Bubble */}
        <View className="flex-row mt-2 mb-6">
          <Image
            source={require('@/assets/images/riskManagement/delo_wave.png')}
            className="w-20 h-20"
            resizeMode="contain"
          />
          <View className="flex-1 flex justify-center items-center bg-white p-4 rounded-2xl ml-2">
            <Text className="text-base text-[#1A2B3C]">
              DeLo Here! Please submit your monthly safety report.
            </Text>
          </View>
        </View>

        {/* Insurance Policy Button */}
        <View className="mb-6">
          <TouchableOpacity
            className="bg-[#60A5FA] rounded-3xl py-4 px-5"
            style={{
              shadowColor: 'rgba(96, 165, 250, 0.4)',
              shadowOffset: { width: 0, height: 4 },
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-white rounded-full items-center justify-center">
                  <Shield size={24} color="#3B82F6" />
                </View>
                <Text className="text-white text-xl font-medium ml-3">
                  View your Insurance Policy
                </Text>
              </View>
              <ChevronRight size={24} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Tiles Grid */}
        <View className="flex-row flex-wrap justify-between">
          {riskManagementTiles.map((tile) => (
            <TouchableOpacity
              key={tile.id}
              className={`w-[48%] ${tile.bgColor} rounded-3xl p-5 mb-4`}
              onPress={() => handleTilePress(tile)}
            >
              <View className="items-start">
                <View className="w-12 h-12 bg-white rounded-full items-center justify-center mb-3">
                  <Image source={tile.image} className="w-6 h-6" />
                </View>
                <Text className="text-base font-medium text-[#1A2B3C]">
                  {tile.title}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
