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
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { Card, useTheme } from 'heroui-native';
import { AppHeader } from '@/components/layout/AppHeader';
import { FormInput } from '@/components/forms/FormInput';
import { FormButton } from '@/components/forms/FormButton';
import { useAIChat, useAIDocument, useAIAudio, useAIVideo } from '@/hooks/use-ai';
import { AIChip } from '@/components/ai/AIChip';
import { AIConversation } from '@/components/ai/AIConversation';
import { AIVision } from '@/components/ai/AIVision';
import { Platform } from 'react-native';

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
  const conversationId = 'ai-example-demo';
  const chatController = useAIChat(conversationId);
  const [voiceTranscript, setVoiceTranscript] = useState<string | null>(null);
  
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
  const [documentPrompt, setDocumentPrompt] = useState('Summarize this document');
  const [audioPrompt, setAudioPrompt] = useState('Describe what you hear in this audio');
  const [videoPrompt, setVideoPrompt] = useState('Describe what happens in this video');
  
  const [documentPickerAvailable, setDocumentPickerAvailable] = React.useState<boolean>(false);

  // Check module availability on mount and when component updates
  useEffect(() => {
    if (Platform.OS !== 'web') {
      const docPicker = getDocumentPicker();
      setDocumentPickerAvailable(docPicker !== null);
    }
  }, []);

  // Hooks
  const { analyze: analyzeDoc, loading: docLoading, result: docResult } = useAIDocument();
  const { analyze: analyzeAud, loading: audioLoading, result: audioResult } = useAIAudio();
  const { analyze: analyzeVid, loading: videoLoading, result: videoResult } = useAIVideo();
  const { analyze: transcribeAudio, loading: voiceLoading } = useAIAudio();

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

  const handleVoiceRecordingComplete = async ({ uri }: { uri: string; duration: number }) => {
    try {
      setVoiceTranscript('Transcribing voice input…');
      const transcription = await transcribeAudio({
        audioUri: uri,
        prompt: 'Transcribe this spoken audio into plain text',
      });
      const transcript = transcription?.description?.trim();
      if (transcript) {
        setVoiceTranscript(transcript);
        await chatController.startChat({ message: transcript, conversationId });
      } else {
        setVoiceTranscript('No speech detected');
      }
    } catch (error: any) {
      const message = error?.message || 'Failed to transcribe audio';
      setVoiceTranscript(message);
      Alert.alert('Voice Input Error', message);
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
          <Card.Body className="p-4" style={{ gap: 16 }}>
            <View style={styles.voiceRow}>
              <AIChip
                style={styles.voiceChip}
                onRecordingComplete={handleVoiceRecordingComplete}
                showLoadingIndicator
              />
              <View style={styles.voiceInfo}>
                <Text style={[styles.voiceLabel, { color: colors.foreground }]}>Voice capture</Text>
                <Text style={[styles.voiceStatus, { color: colors.mutedForeground }]}>
                  {voiceLoading ? 'Transcribing audio…' : voiceTranscript ? `Last prompt: ${voiceTranscript}` : 'Hold the chip to talk'}
                  </Text>
                </View>
                </View>

            <AIConversation
              conversationId={conversationId}
              controller={chatController}
              title="AI Conversation"
            />
          </Card.Body>
        </Card>

        {/* Image Analysis Example */}
        <Card className="mb-4 rounded-xl overflow-hidden">
          <Card.Body className="p-4">
            <AIVision />
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
  voiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  voiceChip: {
    flexShrink: 0,
  },
  voiceInfo: {
    flex: 1,
    gap: 4,
  },
  voiceLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  voiceStatus: {
    fontSize: 12,
  },
  inputContainer: {
    marginBottom: 12,
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
