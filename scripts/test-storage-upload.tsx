/**
 * React Native Component to Test Firebase Storage Upload
 * Created by Kien AI (leejungkiin@gmail.com)
 * 
 * This component can be imported into your app to test upload functionality
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useTheme } from '@heroui/react-native';
import { runFirebaseStorageTests } from './test-firebase-storage';
import { uploadFile } from '../services/storage/storage.service';
import * as DocumentPicker from 'expo-document-picker';

export function StorageTestScreen() {
  const { colors, theme } = useTheme();
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const runTests = async () => {
    setTesting(true);
    setResults([]);
    addResult('Starting Firebase Storage tests...');
    
    try {
      // Capture console.log output
      const originalLog = console.log;
      const logs: string[] = [];
      
      console.log = (...args: any[]) => {
        logs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '));
        originalLog(...args);
      };
      
      await runFirebaseStorageTests();
      
      console.log = originalLog;
      setResults(prev => [...prev, ...logs]);
      addResult('Tests completed!');
    } catch (error) {
      addResult(`Test error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setTesting(false);
    }
  };

  const testUpload = async () => {
    try {
      setUploading(true);
      setUploadProgress(0);
      addResult('Selecting file...');
      
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });
      
      if (result.canceled) {
        addResult('File selection cancelled');
        setUploading(false);
        return;
      }
      
      const file = result.assets[0];
      addResult(`Selected file: ${file.name} (${(file.size || 0) / 1024} KB)`);
      
      const userId = 'test-user-id'; // Replace with actual user ID
      const storagePath = `users/${userId}/test/${Date.now()}_${file.name}`;
      
      addResult(`Uploading to: ${storagePath}`);
      
      await uploadFile(
        {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || 'application/octet-stream',
          size: file.size || 0,
        },
        storagePath,
        {
          onProgress: (progress) => {
            setUploadProgress(progress);
            addResult(`Upload progress: ${progress}%`);
          },
        }
      );
      
      addResult('✅ Upload successful!');
      Alert.alert('Success', 'File uploaded successfully!');
    } catch (error) {
      addResult(`❌ Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      Alert.alert('Error', error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      color: colors.foreground,
    },
    button: {
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 16,
    },
    buttonDisabled: {
      backgroundColor: colors.muted,
      opacity: 0.5,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    resultsContainer: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 12,
      marginTop: 16,
    },
    resultsTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 8,
      color: colors.foreground,
    },
    resultItem: {
      fontSize: 12,
      fontFamily: 'monospace',
      color: colors.foreground,
      marginBottom: 4,
    },
    progressBar: {
      height: 4,
      backgroundColor: colors.muted,
      borderRadius: 2,
      marginTop: 8,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.primary,
      width: `${uploadProgress}%`,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Storage Test</Text>
      
      <TouchableOpacity
        style={[styles.button, testing && styles.buttonDisabled]}
        onPress={runTests}
        disabled={testing}
      >
        <Text style={styles.buttonText}>
          {testing ? 'Running Tests...' : 'Run Configuration Tests'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, uploading && styles.buttonDisabled]}
        onPress={testUpload}
        disabled={uploading}
      >
        <Text style={styles.buttonText}>
          {uploading ? `Uploading... ${uploadProgress}%` : 'Test File Upload'}
        </Text>
      </TouchableOpacity>
      
      {uploading && (
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>
      )}
      
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Test Results:</Text>
        <ScrollView>
          {results.map((result, index) => (
            <Text key={index} style={styles.resultItem}>
              {result}
            </Text>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

export default StorageTestScreen;

