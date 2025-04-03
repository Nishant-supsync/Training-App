import React from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

interface UploadFormProps {
  onPickDocument: () => Promise<void>;
  onSubmit: () => Promise<void>;
  newInspection: {
    type: string;
    date: string;
    document: DocumentPicker.DocumentPickerAsset | null;
  };
  setNewInspection: (inspection: any) => void;
}

export const UploadForm: React.FC<UploadFormProps> = ({
  onPickDocument,
  onSubmit,
  newInspection,
  setNewInspection,
}) => {
  return (
    <ScrollView className="flex-1 p-4">
      <View className="mb-4">
        <Text className="text-gray-600 mb-2">Certificate Type</Text>
        <TextInput
          className="bg-white border border-gray-200 rounded-lg p-4"
          placeholder="Select the type of certificate"
          value={newInspection.type}
          onChangeText={(text) => setNewInspection({ ...newInspection, type: text })}
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-600 mb-2">Inspection Certificate</Text>
        <View className="bg-white border border-gray-200 border-dashed rounded-lg p-8 items-center">
          <Text className="text-gray-800 mb-2">Upload Certificate</Text>
          <Text className="text-gray-400 text-sm">pdf, docx, and csv are supported</Text>
          <TouchableOpacity 
            className="mt-4 bg-blue-500 px-6 py-2 rounded-lg"
            onPress={onPickDocument}
          >
            <Text className="text-white">Choose File</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="mb-4">
        <Text className="text-gray-600 mb-2">Date Of Inspection</Text>
        <TextInput
          className="bg-white border border-gray-200 rounded-lg p-4"
          placeholder="MM/DD/YY"
          value={newInspection.date}
          onChangeText={(text) => setNewInspection({ ...newInspection, date: text })}
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-600 mb-2">Renewal Frequency</Text>
        <TextInput
          className="bg-white border border-gray-200 rounded-lg p-4"
          placeholder="-"
        />
      </View>

      <TouchableOpacity 
        className="bg-blue-500 rounded-lg p-4 mt-6"
        onPress={onSubmit}
      >
        <Text className="text-white text-center font-medium">Upload Certificate</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}; 