/**
 * AI Example Screen
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Demonstrates AI operations with examples including:
 * - Chat
 * - Image analysis (URL or file upload)
 * - Document analysis (PDF upload)
 * - Audio analysis (audio file upload)
 * - Video analysis (video file upload)
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, Image } from 'react-native';
import { Card, useTheme } from 'heroui-native';
import { AppHeader } from '@/components/layout/AppHeader';
import { FormInput } from '@/components/forms/FormInput';
import { FormButton } from '@/components/forms/FormButton';
import { useAIChat, useAIVision, useAIDocument, useAIAudio, useAIVideo } from '@/hooks/use-ai';
import { Platform } from 'react-native';

// Cache for image picker module
let _imagePickerModule: any = null;
let _imagePickerChecked = false;

// Helper function to safely require image picker module
// Use same approach as document picker
function getImagePicker() {
  if (Platform.OS === 'web') return null;
  
  // Return cached result if already checked
  if (_imagePickerChecked) {
    return _imagePickerModule;
  }
  
  _imagePickerChecked = true;
  
  // Use a more defensive approach to check if module exists
  // Suppress console errors temporarily to avoid error spam
  const originalError = console.error;
  const originalWarn = console.warn;
  
  try {
    // Temporarily suppress console errors/warnings during require
    console.error = () => {};
    console.warn = () => {};
    
    try {
      // Try to require the module directly - same as document picker
      const module = require('expo-image-picker');
      
      // Restore console functions
      console.error = originalError;
      console.warn = originalWarn;
      
      // Verify it has the expected exports
      if (module && typeof module.launchImageLibraryAsync === 'function') {
        _imagePickerModule = module;
        if (__DEV__) {
          console.log('[AIExample] ✅ expo-image-picker loaded successfully');
        }
        return module;
      } else {
        if (__DEV__) {
          console.warn('[AIExample] ⚠️ expo-image-picker module loaded but missing expected exports:', {
            hasModule: !!module,
            hasLaunchImageLibraryAsync: module && typeof module.launchImageLibraryAsync === 'function',
            exports: module ? Object.keys(module) : [],
          });
        }
      }
    } catch (requireError: any) {
      // Restore console functions before handling error
      console.error = originalError;
      console.warn = originalWarn;
      
      // Module not available or not properly linked
      _imagePickerModule = null;
      return null;
    }
  } catch (outerError: any) {
    // Restore console functions in case of any unexpected error
    console.error = originalError;
    console.warn = originalWarn;
    _imagePickerModule = null;
    return null;
  }
  
  return null;
}

// Cache for document picker module
let _documentPickerModule: any = null;
let _documentPickerChecked = false;

function getDocumentPicker() {
  if (Platform.OS === 'web') return null;
  
  // Return cached result if already checked
  if (_documentPickerChecked) {
    return _documentPickerModule;
  }
  
  _documentPickerChecked = true;
  
  // Use a more defensive approach to check if module exists
  // Suppress console errors temporarily to avoid error spam
  const originalError = console.error;
  const originalWarn = console.warn;
  
  try {
    // Temporarily suppress console errors/warnings during require
    console.error = () => {};
    console.warn = () => {};
    
    try {
      // Try to require the module directly
      // This will throw if native module is not linked, which we catch below
      const module = require('expo-document-picker');
      
      // Restore console functions
      console.error = originalError;
      console.warn = originalWarn;
      
      // Verify it has the expected exports
      if (module && typeof module.getDocumentAsync === 'function') {
        _documentPickerModule = module;
        if (__DEV__) {
          console.log('[AIExample] ✅ expo-document-picker loaded successfully');
        }
        return module;
      } else {
        if (__DEV__) {
          console.warn('[AIExample] ⚠️ expo-document-picker module loaded but missing expected exports:', {
            hasModule: !!module,
            hasGetDocumentAsync: module && typeof module.getDocumentAsync === 'function',
            exports: module ? Object.keys(module) : [],
          });
        }
      }
    } catch (requireError: any) {
      // Restore console functions before handling error
      console.error = originalError;
      console.warn = originalWarn;
      
      // Module not available or not properly linked
      // Silently handle the error - this is expected if native modules aren't built yet
      _documentPickerModule = null;
      // Don't log the error to avoid console spam - it's expected behavior
      return null;
    }
  } catch (outerError: any) {
    // Restore console functions in case of any unexpected error
    console.error = originalError;
    console.warn = originalWarn;
    _documentPickerModule = null;
    return null;
  }
  
  return null;
}

export default function AIExampleScreen() {
  const { colors } = useTheme();
  
  // Chat state
  const [chatMessage, setChatMessage] = useState('');
  
  // Image state
  const [imageUrl, setImageUrl] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  
  // Document state
  const [documentUri, setDocumentUri] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState<string | null>(null);
  
  // Audio state
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [audioName, setAudioName] = useState<string | null>(null);
  
  // Video state
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string | null>(null);
  
  // Prompt state
  const [imagePrompt, setImagePrompt] = useState('Describe this image in detail');
  const [documentPrompt, setDocumentPrompt] = useState('Summarize this document');
  const [audioPrompt, setAudioPrompt] = useState('Describe what you hear in this audio');
  const [videoPrompt, setVideoPrompt] = useState('Describe what happens in this video');
  
  // Check if native modules are available (check at runtime)
  const [imagePickerAvailable, setImagePickerAvailable] = React.useState<boolean>(false);
  const [documentPickerAvailable, setDocumentPickerAvailable] = React.useState<boolean>(false);

  // Check module availability on mount and when component updates
  useEffect(() => {
    if (Platform.OS !== 'web') {
      const imgPicker = getImagePicker();
      const docPicker = getDocumentPicker();
      setImagePickerAvailable(imgPicker !== null);
      setDocumentPickerAvailable(docPicker !== null);
      
      if (__DEV__) {
        console.log('[AIExample] Native modules check:', {
          imagePicker: imgPicker !== null,
          documentPicker: docPicker !== null,
          platform: Platform.OS,
        });
      }
    }
  }, []);

  // Hooks
  const { sendMessage, messages, isStreaming: chatStreaming, currentMessage } = useAIChat();
  const { analyze: analyzeImage, loading: visionLoading, result: visionResult } = useAIVision();
  const { analyze: analyzeDoc, loading: docLoading, result: docResult } = useAIDocument();
  const { analyze: analyzeAud, loading: audioLoading, result: audioResult } = useAIAudio();
  const { analyze: analyzeVid, loading: videoLoading, result: videoResult } = useAIVideo();

  const handleSendChat = async () => {
    if (!chatMessage.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }
    try {
      await sendMessage(chatMessage);
      setChatMessage('');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  // Image picker - same approach as document picker
  const handlePickImage = async () => {
    const ImagePicker = getImagePicker();
    if (!ImagePicker) {
      Alert.alert(
        'Image Picker Not Available',
        'Image picker is not available. Please use the URL input field to provide an image URL, or rebuild the app to enable native modules.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant photo library permissions');
        return;
      }

      // Launch image library - same pattern as document picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
        setImageUrl(''); // Clear URL when using file picker
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to pick image');
    }
  };

  const handleAnalyzeImage = async () => {
    if (!imageUrl.trim() && !imageUri) {
      Alert.alert('Error', 'Please enter an image URL or pick an image');
      return;
    }
    try {
      if (imageUri) {
        await analyzeImage({ imageUri, prompt: imagePrompt });
      } else {
        await analyzeImage({ imageUrl, prompt: imagePrompt });
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  // Document picker
  const handlePickDocument = async () => {
    const DocumentPicker = getDocumentPicker();
    if (!DocumentPicker) {
      Alert.alert(
        'Native Module Required',
        'Document picker requires native modules. Please rebuild the app:\n\n1. Run: npx expo prebuild --clean\n2. Run: npx expo run:ios (or run:android)\n\nSee docs/REBUILD_NATIVE_MODULES.md for details.',
        [{ text: 'OK' }]
      );
      // Update state to reflect current status
      setDocumentPickerAvailable(false);
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setDocumentUri(result.assets[0].uri);
        setDocumentName(result.assets[0].name);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleAnalyzeDocument = async () => {
    if (!documentUri) {
      Alert.alert('Error', 'Please pick a document');
      return;
    }
    try {
      await analyzeDoc({ documentUri, prompt: documentPrompt });
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  // Audio picker
  const handlePickAudio = async () => {
    const DocumentPicker = getDocumentPicker();
    if (!DocumentPicker) {
      Alert.alert(
        'Native Module Required',
        'Audio picker requires native modules. Please rebuild the app:\n\n1. Run: npx expo prebuild --clean\n2. Run: npx expo run:ios (or run:android)\n\nSee docs/REBUILD_NATIVE_MODULES.md for details.',
        [{ text: 'OK' }]
      );
      // Update state to reflect current status
      setDocumentPickerAvailable(false);
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['audio/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setAudioUri(result.assets[0].uri);
        setAudioName(result.assets[0].name);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleAnalyzeAudio = async () => {
    if (!audioUri) {
      Alert.alert('Error', 'Please pick an audio file');
      return;
    }
    try {
      await analyzeAud({ audioUri, prompt: audioPrompt });
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  // Video picker
  const handlePickVideo = async () => {
    Alert.alert(
      'Video Picker Not Available',
      'Video picker is not available. Please use a video URL or implement video picker separately.',
      [{ text: 'OK' }]
    );
  };

  const handleAnalyzeVideo = async () => {
    if (!videoUri) {
      Alert.alert('Error', 'Please pick a video');
      return;
    }
    try {
      await analyzeVid({ videoUri, prompt: videoPrompt });
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="AI Examples" />
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Chat Example */}
        <Card className="mb-4 rounded-xl overflow-hidden">
          <Card.Body className="p-4">
            <Text style={[styles.title, { color: colors.foreground }]}>Chat Example</Text>
            <ScrollView 
              style={[styles.chatContainer, { backgroundColor: colors.muted }]}
              nestedScrollEnabled
              showsVerticalScrollIndicator={true}
            >
              {messages.length === 0 && !chatStreaming && (
                <View style={[styles.messageContainer, { backgroundColor: colors.muted }]}>
                  <Text style={[styles.messageText, { color: colors.mutedForeground, fontStyle: 'italic' }]}>
                    No messages yet. Start a conversation!
                  </Text>
                </View>
              )}
              {messages.map((msg, index) => (
                <View key={msg.id || index} style={[styles.messageContainer, { backgroundColor: colors.background }]}>
                  <Text style={[styles.messageRole, { color: colors.foreground }]}>
                    {msg.role}:
                  </Text>
                  <Text style={[styles.messageText, { color: colors.foreground }]}>
                    {msg.content || '(empty)'}
                  </Text>
                </View>
              ))}
              {chatStreaming && currentMessage && (
                <View style={[styles.messageContainer, { backgroundColor: colors.background }]}>
                  <Text style={[styles.messageRole, { color: colors.foreground }]}>
                    assistant:
                  </Text>
                  <Text style={[styles.messageText, { color: colors.foreground }]}>
                    {currentMessage}
                  </Text>
                </View>
              )}
            </ScrollView>
            <FormInput
              placeholder="Enter your message"
              value={chatMessage}
              onChangeText={setChatMessage}
              multiline
              containerStyle={styles.inputContainer}
            />
            <FormButton
              title={chatStreaming ? 'Sending...' : 'Send Message'}
              onPress={handleSendChat}
              loading={chatStreaming}
              variant="primary"
              fullWidth
            />
          </Card.Body>
        </Card>

        {/* Image Analysis Example */}
        <Card className="mb-4 rounded-xl overflow-hidden">
          <Card.Body className="p-4">
            <Text style={[styles.title, { color: colors.foreground }]}>Image Analysis</Text>
            <FormInput
              placeholder="Image URL (or pick from device)"
              value={imageUrl}
              onChangeText={setImageUrl}
              containerStyle={styles.inputContainer}
            />
            <FormInput
              placeholder="Prompt (e.g., Describe this image)"
              value={imagePrompt}
              onChangeText={setImagePrompt}
              containerStyle={styles.inputContainer}
            />
            {Platform.OS !== 'web' && (
              <FormButton
                title={imagePickerAvailable ? "Pick Image from Device" : "Pick Image (Not Available)"}
                onPress={handlePickImage}
                variant="secondary"
                style={{ marginBottom: 12 }}
                disabled={!imagePickerAvailable}
              />
            )}
            {imageUri && (
              <View style={styles.fileInfo}>
                <Image source={{ uri: imageUri }} style={styles.previewImage} />
                <Text style={[styles.fileName, { color: colors.mutedForeground }]}>Image selected</Text>
              </View>
            )}
            <FormButton
              title={visionLoading ? 'Analyzing...' : 'Analyze Image'}
              onPress={handleAnalyzeImage}
              loading={visionLoading}
              variant="primary"
              fullWidth
            />
            {visionResult && (
              <View style={[styles.resultContainer, { backgroundColor: colors.muted }]}>
                <Text style={[styles.resultText, { color: colors.foreground }]}>
                  {visionResult.description}
                </Text>
              </View>
            )}
          </Card.Body>
        </Card>

        {/* Document Analysis Example */}
        <Card className="mb-4 rounded-xl overflow-hidden">
          <Card.Body className="p-4">
            <Text style={[styles.title, { color: colors.foreground }]}>Document Analysis</Text>
            <FormInput
              placeholder="Prompt (e.g., Summarize this document)"
              value={documentPrompt}
              onChangeText={setDocumentPrompt}
              containerStyle={styles.inputContainer}
            />
            {Platform.OS !== 'web' && (
              <FormButton
                title={documentPickerAvailable ? "Pick Document" : "Pick Document (Rebuild required)"}
                onPress={handlePickDocument}
                variant="secondary"
                style={{ marginBottom: 12 }}
                disabled={!documentPickerAvailable}
              />
            )}
            <FormButton
              title={docLoading ? 'Analyzing...' : 'Analyze Document'}
              onPress={handleAnalyzeDocument}
              loading={docLoading}
              variant="primary"
              fullWidth
            />
            {documentName && (
              <View style={styles.fileInfo}>
                <Text style={[styles.fileName, { color: colors.mutedForeground }]}>
                  📄 {documentName}
                </Text>
              </View>
            )}
            {docResult && (
              <View style={[styles.resultContainer, { backgroundColor: colors.muted }]}>
                <Text style={[styles.resultText, { color: colors.foreground }]}>
                  {docResult.text}
                </Text>
              </View>
            )}
          </Card.Body>
        </Card>

        {/* Audio Analysis Example */}
        <Card className="mb-4 rounded-xl overflow-hidden">
          <Card.Body className="p-4">
            <Text style={[styles.title, { color: colors.foreground }]}>Audio Analysis</Text>
            <FormInput
              placeholder="Prompt (e.g., Describe what you hear)"
              value={audioPrompt}
              onChangeText={setAudioPrompt}
              containerStyle={styles.inputContainer}
            />
            {Platform.OS !== 'web' && (
              <FormButton
                title={documentPickerAvailable ? "Pick Audio" : "Pick Audio (Rebuild required)"}
                onPress={handlePickAudio}
                variant="secondary"
                style={{ marginBottom: 12 }}
                disabled={!documentPickerAvailable}
              />
            )}
            <FormButton
              title={audioLoading ? 'Analyzing...' : 'Analyze Audio'}
              onPress={handleAnalyzeAudio}
              loading={audioLoading}
              variant="primary"
              fullWidth
            />
            {audioName && (
              <View style={styles.fileInfo}>
                <Text style={[styles.fileName, { color: colors.mutedForeground }]}>
                  🎵 {audioName}
                </Text>
              </View>
            )}
            {audioResult && (
              <View style={[styles.resultContainer, { backgroundColor: colors.muted }]}>
                <Text style={[styles.resultText, { color: colors.foreground }]}>
                  {audioResult.description || audioResult.transcript}
                </Text>
              </View>
            )}
          </Card.Body>
        </Card>

        {/* Video Analysis Example */}
        <Card className="mb-4 rounded-xl overflow-hidden">
          <Card.Body className="p-4">
            <Text style={[styles.title, { color: colors.foreground }]}>Video Analysis</Text>
            <FormInput
              placeholder="Prompt (e.g., Describe what happens in this video)"
              value={videoPrompt}
              onChangeText={setVideoPrompt}
              containerStyle={styles.inputContainer}
            />
            {Platform.OS !== 'web' && (
              <FormButton
                title="Pick Video from Device (Not Available)"
                onPress={handlePickVideo}
                variant="secondary"
                style={{ marginBottom: 12 }}
                disabled={true}
              />
            )}
            <FormButton
              title={videoLoading ? 'Analyzing...' : 'Analyze Video'}
              onPress={handleAnalyzeVideo}
              loading={videoLoading}
              variant="primary"
              fullWidth
            />
            {videoName && (
              <View style={styles.fileInfo}>
                <Text style={[styles.fileName, { color: colors.mutedForeground }]}>
                  🎬 {videoName}
                </Text>
              </View>
            )}
            {videoResult && (
              <View style={[styles.resultContainer, { backgroundColor: colors.muted }]}>
                <Text style={[styles.resultText, { color: colors.foreground }]}>
                  {videoResult.description}
                </Text>
              </View>
            )}
          </Card.Body>
        </Card>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  chatContainer: {
    maxHeight: 200,
    marginBottom: 12,
    padding: 8,
    borderRadius: 8,
  },
  messageContainer: {
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
  },
  messageRole: {
    fontWeight: 'bold',
    fontSize: 12,
    opacity: 0.8,
  },
  messageText: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    flexShrink: 1,
  },
  inputContainer: {
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  halfButton: {
    flex: 1,
  },
  fileInfo: {
    marginTop: 12,
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
  },
  fileName: {
    fontSize: 14,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  resultContainer: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
  },
  resultText: {
    fontSize: 14,
    lineHeight: 20,
    flexShrink: 1,
  },
});
