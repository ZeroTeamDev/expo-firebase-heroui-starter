/**
 * Firebase Storage Test Screen
 * Created by Kien AI (leejungkiin@gmail.com)
 * 
 * Test Firebase Storage configuration and upload functionality
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from 'heroui-native';
import { AppHeader } from '@/components/layout/AppHeader';
import { useTabBarPadding } from '@/hooks/use-tab-bar-padding';
import { runFirebaseStorageTests } from '@/scripts/test-firebase-storage';
import { uploadFile } from '@/services/storage/storage.service';
import * as DocumentPicker from 'expo-document-picker';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/components/feedback/Toast';

export default function StorageTestScreen() {
  const { colors, theme } = useTheme();
  const { user } = useAuthStore();
  const { showToast } = useToast();
  const bottomPadding = useTabBarPadding();
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const addResult = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setResults(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const runTests = async () => {
    setTesting(true);
    setResults([]);
    addResult('🚀 Starting Firebase Storage tests...');
    addResult('');
    
    try {
      // Capture console output
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;
      
      const logs: string[] = [];
      
      console.log = (...args: any[]) => {
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        logs.push(message);
        originalLog(...args);
      };
      
      console.error = (...args: any[]) => {
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        logs.push(`❌ ${message}`);
        originalError(...args);
      };
      
      console.warn = (...args: any[]) => {
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        logs.push(`⚠️ ${message}`);
        originalWarn(...args);
      };
      
      await runFirebaseStorageTests();
      
      // Restore original console methods
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      
      setResults(prev => [...prev, ...logs]);
      addResult('');
      addResult('✅ Tests completed!');
      
      showToast({
        title: 'Tests Completed',
        message: 'Check results below',
        variant: 'success',
      });
    } catch (error) {
      addResult(`❌ Test error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      showToast({
        title: 'Test Error',
        message: error instanceof Error ? error.message : 'Unknown error',
        variant: 'error',
      });
    } finally {
      setTesting(false);
    }
  };

  const testUpload = async () => {
    if (!user) {
      Alert.alert('Error', 'Please log in first');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      addResult('📁 Selecting file...');
      
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });
      
      if (result.canceled) {
        addResult('❌ File selection cancelled');
        setUploading(false);
        return;
      }
      
      const file = result.assets[0];
      const fileSizeKB = ((file.size || 0) / 1024).toFixed(2);
      addResult(`✅ Selected: ${file.name} (${fileSizeKB} KB)`);
      
      const storagePath = `users/${user.uid}/test/${Date.now()}_${file.name}`;
      addResult(`📤 Uploading to: ${storagePath}`);
      
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
            addResult(`⏳ Progress: ${progress}%`);
          },
        }
      );
      
      addResult('✅ Upload successful!');
      setUploadProgress(100);
      showToast({
        title: 'Upload Success',
        message: 'File uploaded successfully!',
        variant: 'success',
      });
    } catch (error) {
      addResult(`❌ Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      showToast({
        title: 'Upload Error',
        message: error instanceof Error ? error.message : 'Upload failed',
        variant: 'error',
      });
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 16,
      paddingBottom: bottomPadding + 16,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 12,
      color: colors.foreground,
    },
    button: {
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 12,
      minHeight: 50,
      justifyContent: 'center',
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    buttonSecondary: {
      backgroundColor: colors.secondary || colors.muted,
    },
    buttonDanger: {
      backgroundColor: colors.danger || '#ff3b30',
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    resultsContainer: {
      flex: 1,
      backgroundColor: colors.card || colors.surface1,
      borderRadius: 12,
      padding: 12,
      minHeight: 200,
      maxHeight: 400,
    },
    resultsTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
      color: colors.foreground,
    },
    resultsScroll: {
      flex: 1,
    },
    resultItem: {
      fontSize: 11,
      fontFamily: 'monospace',
      color: colors.foreground,
      marginBottom: 4,
      lineHeight: 16,
    },
    progressContainer: {
      marginTop: 8,
      marginBottom: 16,
    },
    progressBar: {
      height: 6,
      backgroundColor: colors.muted,
      borderRadius: 3,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.primary,
      width: `${uploadProgress}%`,
      transition: 'width 0.3s ease',
    },
    progressText: {
      fontSize: 12,
      color: colors.mutedForeground,
      marginTop: 4,
      textAlign: 'center',
    },
    infoBox: {
      backgroundColor: colors.surface2 || colors.muted + '20',
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
    },
    infoText: {
      fontSize: 13,
      color: colors.foreground,
      lineHeight: 18,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 12,
    },
    buttonHalf: {
      flex: 1,
    },
  });

  return (
    <View style={styles.container}>
      <AppHeader title="Storage Test" />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuration Tests</Text>
          
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Run comprehensive tests to verify Firebase Storage configuration,
              authentication, bucket access, and security rules.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, testing && styles.buttonDisabled]}
            onPress={runTests}
            disabled={testing}
          >
            {testing ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Run Configuration Tests</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload Test</Text>
          
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Test file upload functionality with a real file.
              Select any file to upload to Firebase Storage.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary, uploading && styles.buttonDisabled]}
            onPress={testUpload}
            disabled={uploading || !user}
          >
            {uploading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>
                {user ? 'Test File Upload' : 'Login Required'}
              </Text>
            )}
          </TouchableOpacity>

          {uploading && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={styles.progressFill} />
              </View>
              <Text style={styles.progressText}>{uploadProgress}%</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={styles.sectionTitle}>Test Results</Text>
            {results.length > 0 && (
              <TouchableOpacity
                style={[styles.button, styles.buttonDanger, { paddingHorizontal: 12, paddingVertical: 8, marginBottom: 0, minHeight: 36 }]}
                onPress={clearResults}
              >
                <Text style={[styles.buttonText, { fontSize: 14 }]}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.resultsContainer}>
            {results.length === 0 ? (
              <Text style={[styles.resultItem, { opacity: 0.5, textAlign: 'center', marginTop: 20 }]}>
                No test results yet. Run tests to see results here.
              </Text>
            ) : (
              <ScrollView style={styles.resultsScroll} nestedScrollEnabled>
                {results.map((result, index) => (
                  <Text key={index} style={styles.resultItem}>
                    {result}
                  </Text>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

