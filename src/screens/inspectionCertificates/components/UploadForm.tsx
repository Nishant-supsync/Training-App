// import React from 'react';
// import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
// import * as DocumentPicker from 'expo-document-picker';

// interface UploadFormProps {
//   onPickDocument: () => Promise<void>;
//   onSubmit: () => Promise<void>;
//   newInspection: {
//     type: string;
//     date: string;
//     document: DocumentPicker.DocumentPickerAsset | null;
//   };
//   setNewInspection: (inspection: any) => void;
// }

// export const UploadForm: React.FC<UploadFormProps> = ({
//   onPickDocument,
//   onSubmit,
//   newInspection,
//   setNewInspection,
// }) => {
//   return (
//     <ScrollView className="flex-1 p-4">
//       <View className="mb-4">
//         <Text className="text-gray-600 mb-2">Certificate Type</Text>
//         <TextInput
//           className="bg-white border border-gray-200 rounded-lg p-4"
//           placeholder="Select the type of certificate"
//           value={newInspection.type}
//           onChangeText={(text) => setNewInspection({ ...newInspection, type: text })}
//         />
//       </View>

//       <View className="mb-4">
//         <Text className="text-gray-600 mb-2">Inspection Certificate</Text>
//         <View className="bg-white border border-gray-200 border-dashed rounded-lg p-8 items-center">
//           <Text className="text-gray-800 mb-2">Upload Certificate</Text>
//           <Text className="text-gray-400 text-sm">pdf, docx, and csv are supported</Text>
//           <TouchableOpacity 
//             className="mt-4 bg-blue-500 px-6 py-2 rounded-lg"
//             onPress={onPickDocument}
//           >
//             <Text className="text-white">Choose File</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       <View className="mb-4">
//         <Text className="text-gray-600 mb-2">Date Of Inspection</Text>
//         <TextInput
//           className="bg-white border border-gray-200 rounded-lg p-4"
//           placeholder="MM/DD/YY"
//           value={newInspection.date}
//           onChangeText={(text) => setNewInspection({ ...newInspection, date: text })}
//         />
//       </View>

//       <View className="mb-4">
//         <Text className="text-gray-600 mb-2">Renewal Frequency</Text>
//         <TextInput
//           className="bg-white border border-gray-200 rounded-lg p-4"
//           placeholder="-"
//         />
//       </View>

//       <TouchableOpacity 
//         className="bg-blue-500 rounded-lg p-4 mt-6"
//         onPress={onSubmit}
//       >
//         <Text className="text-white text-center font-medium">Upload Certificate</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }; 

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Modal,
  Image,
  Platform
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import dayjs from 'dayjs';
import { Ionicons } from '@expo/vector-icons';

// Certificate type options with their renewal periods
const certificateTypes = [
  { id: '1', label: 'Fire Safety Certificate', renewalPeriod: '6 Months' },
  { id: '2', label: 'Health and Hygiene Certificate', renewalPeriod: '12 Months' },
  { id: '3', label: 'Building Safety Certificate', renewalPeriod: '24 Months' },
  { id: '4', label: 'Electrical System Certificate', renewalPeriod: '12 Months' },
  { id: '5', label: 'Environmental Compliance Certificate', renewalPeriod: '3 Months' },
  { id: '6', label: 'Lorem Ipsum', renewalPeriod: 'Every 3 Months' },
];

interface UploadFormProps {
  onPickDocument: () => Promise<void>;
  onSubmit: () => Promise<void>;
  newInspection: {
    type: string;
    date: string;
    document: DocumentPicker.DocumentPickerAsset | null;
    renewalFrequency?: string;
  };
  setNewInspection: (inspection: any) => void;
}

export const UploadForm: React.FC<UploadFormProps> = ({
  onPickDocument,
  onSubmit,
  newInspection,
  setNewInspection,
}) => {
  // State for the dropdown modal
  const [dropdownVisible, setDropdownVisible] = useState(false);
  // State for the selected certificate type
  const [selectedType, setSelectedType] = useState<{id: string, label: string, renewalPeriod: string} | null>(null);
  // State for the document (placeholder for when a document is selected)
  const [selectedDocument, setSelectedDocument] = useState<{name: string, dateUploaded: string, size: string} | null>(null);

  // Handle certificate type selection
  const handleSelectCertificateType = (type: {id: string, label: string, renewalPeriod: string}) => {
    setSelectedType(type);
    setNewInspection({
      ...newInspection,
      type: type.label,
      renewalFrequency: type.renewalPeriod
    });
    setDropdownVisible(false);
  };

  // Handle date selection
  const handleDateChange = (text: string) => {
    // Allow any input, but limit to 10 characters (MM/DD/YYYY format)
    if (text.length <= 10) {
      // Remove any non-numeric characters except '/'
      const sanitizedText = text.replace(/[^\d/]/g, '');
      
      // Automatically add '/' after MM and DD
      let formattedText = sanitizedText;
      if (sanitizedText.length === 2 && newInspection.date.length !== 3) {
        formattedText = sanitizedText + '/';
      } else if (sanitizedText.length === 5 && newInspection.date.length !== 6) {
        formattedText = sanitizedText + '/';
      }

      setNewInspection({
        ...newInspection,
        date: formattedText
      });
    }
  };

  // For handling document selection (this would work with the onPickDocument prop)
  const handleDocumentSelection = async () => {
    await onPickDocument();
    if (newInspection.document) {
      const currentDate = dayjs().format('MM/DD/YYYY');
      setSelectedDocument({
        name: newInspection.document?.name ?? '',
        dateUploaded: currentDate,
        size: `${Math.round(newInspection.document?.size ?? 0 / 1024)} KB`
      });
    }
  };

  // Effect to update the document state when the newInspection.document changes
  useEffect(() => {
    if (newInspection.document) {
      const currentDate = dayjs().format('MM/DD/YYYY');
      setSelectedDocument({
        name: newInspection.document?.name ?? '',
        dateUploaded: currentDate,
        size: `${Math.round((newInspection.document?.size ?? 0) / 1024)} KB`
      });
    }
  }, [newInspection.document]);

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerClassName="p-4">
      {/* Certificate Type Selection */}
      <View className="mb-5">
        <Text className="text-sm text-gray-500 mb-2">Certificate Type</Text>
        <TouchableOpacity 
          className="bg-white border border-gray-200 rounded-lg p-4 flex-row justify-between items-center"
          onPress={() => setDropdownVisible(true)}
        >
          <Text className={selectedType ? "text-gray-800" : "text-gray-400"}>
            {selectedType ? selectedType.label : 'Select the type of certificate'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#a0aec0" />
        </TouchableOpacity>
      </View>

      {/* Inspection Certificate Section */}
      <View className="mb-5">
        <Text className="text-sm text-gray-500 mb-2">Inspection Certificate</Text>
        
        {selectedDocument ? (
          // Document preview when a document is selected
          <View className="bg-white rounded-lg p-4 mb-2">
            <View className="flex-row items-center">
              <View className="bg-red-400 w-9 h-9 rounded justify-center items-center mr-3">
                <Text className="text-white font-bold">PDF</Text>
              </View>
              <View className="flex-1">
                <Text className="font-medium mb-1">{selectedDocument.name}</Text>
                <Text className="text-gray-500 text-xs">
                  {selectedDocument.dateUploaded} · {selectedDocument.size}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedDocument(null)}>
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // Upload area when no document is selected
          <View className="bg-white border border-gray-200 border-dashed rounded-lg p-4 items-center py-8">
            <View className="w-12 h-12 rounded-full border border-gray-200 justify-center items-center mb-3">
              <Ionicons name="document-outline" size={24} color="#94a3b8" />
            </View>
            <Text className="font-medium mb-1">Upload Certificate</Text>
            <Text className="text-gray-400 text-xs mb-4">
              pdf, docx, and csv are supported
            </Text>
            <TouchableOpacity 
              className="bg-blue-500 px-4 py-2 rounded-lg"
              onPress={handleDocumentSelection}
            >
              <Text className="text-white font-medium">Choose File</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Date Of Inspection */}
      <View className="mb-5">
        <Text className="text-sm text-gray-500 mb-2">Date Of Inspection</Text>
        <TextInput
          className="bg-white border border-gray-200 rounded-lg p-4"
          placeholder="MM/DD/YYYY"
          placeholderTextColor="#a0aec0"
          value={newInspection.date}
          onChangeText={handleDateChange}
          keyboardType="numbers-and-punctuation"
        />
      </View>

      {/* Renewal Frequency */}
      <View className="mb-5">
        <Text className="text-sm text-gray-500 mb-2">Renewal Frequency</Text>
        <View className="bg-white border border-gray-200 rounded-lg p-4">
          <Text className={selectedType ? "text-gray-800" : "text-gray-400"}>
            {selectedType ? selectedType.renewalPeriod : '-'}
          </Text>
        </View>
      </View>

      {/* Upload Button */}
      <TouchableOpacity 
        className="bg-blue-500 py-4 rounded-lg items-center mt-4"
        onPress={onSubmit}
        disabled={!selectedType || !newInspection.date || !selectedDocument}
      >
        <Text className="text-white font-semibold text-base">Upload Certificate</Text>
      </TouchableOpacity>

      {/* Certificate Type Dropdown Modal */}
      <Modal
        visible={dropdownVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-10/12 max-h-3/4 bg-white rounded-xl p-4 shadow-lg">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold">Select Certificate Type</Text>
              <TouchableOpacity onPress={() => setDropdownVisible(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            
            <ScrollView>
              {certificateTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  className="py-3 border-b border-gray-200"
                  onPress={() => handleSelectCertificateType(type)}
                >
                  <Text className="text-base">{type.label}</Text>
                  <Text className="text-xs text-gray-500">
                    Renewal: {type.renewalPeriod}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};