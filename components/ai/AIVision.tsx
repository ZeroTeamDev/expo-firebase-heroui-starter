// Created by Kien AI (leejungkiin@gmail.com)
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useAIVision } from '@/hooks/use-ai';

interface AIVisionResult {
  description?: string;
  usage?: {
    totalTokens?: number;
  };
}

export interface AIVisionProps {
  defaultPrompt?: string;
  onResult?: (result: AIVisionResult | null) => void;
  onCopy?: (description: string) => void;
}

export function AIVision({ defaultPrompt = 'Describe this image in detail', onResult, onCopy }: AIVisionProps) {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { analyze, loading, result } = useAIVision({
    onSuccess: (res) => onResult?.(res as AIVisionResult),
    onError: (err) => setError(err.message),
  });

  const previewSource = useMemo(() => {
    if (imageUri) return { uri: imageUri };
    if (imageUrl.trim()) return { uri: imageUrl.trim() };
    return null;
  }, [imageUri, imageUrl]);

  const handlePickImage = useCallback(async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Use URL Input', 'Image picker is not available on web builds. Please paste an image URL instead.');
      return;
    }

    try {
      const ImagePicker = await import('expo-image-picker');
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please grant photo library permissions to select an image.');
        return;
      }

      const selection = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        quality: 0.9,
      });

      if (!selection.canceled && selection.assets?.length) {
        const asset = selection.assets[0];
        setImageUri(asset.uri);
        setImageUrl('');
        setError(null);
      }
    } catch (pickError: any) {
      setError(pickError.message || 'Failed to select image');
    }
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!previewSource) {
      Alert.alert('No image selected', 'Please select an image or provide an image URL.');
      return;
    }

    try {
      setError(null);
      await analyze({
        prompt,
        imageUri: imageUri || undefined,
        imageUrl: imageUri ? undefined : imageUrl,
      });
    } catch (analyzeError: any) {
      setError(analyzeError.message || 'Failed to analyze image');
    }
  }, [analyze, imageUri, imageUrl, previewSource, prompt]);

  const handleReset = useCallback(() => {
    setPrompt(defaultPrompt);
    setImageUri(null);
    setImageUrl('');
    onResult?.(null);
    setError(null);
  }, [defaultPrompt, onResult]);

  const handleCopy = useCallback(async () => {
    if (!result?.description) return;
    try {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(result.description);
      }
      setCopied(true);
      onCopy?.(result.description);
      await Haptics.selectionAsync();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [onCopy, result?.description]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Vision Analysis</Text>

      <View style={styles.row}>
        <Pressable onPress={handlePickImage} style={({ pressed }) => [styles.actionButton, pressed && styles.actionPressed]}>
          <Text style={styles.actionLabel}>Upload Image</Text>
        </Pressable>

        <Pressable onPress={handleReset} style={({ pressed }) => [styles.secondaryButton, pressed && styles.actionPressed]}>
          <Text style={styles.secondaryLabel}>Reset</Text>
        </Pressable>
      </View>

      <TextInput
        placeholder="or paste image URL"
        value={imageUrl}
        onChangeText={setImageUrl}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType={Platform.select({ ios: 'url', android: 'default', default: 'url' })}
      />

      <TextInput
        placeholder="Enter analysis prompt"
        value={prompt}
        onChangeText={setPrompt}
        style={[styles.input, styles.promptInput]}
        multiline
      />

      {previewSource && (
        <View style={styles.previewContainer}>
          <Image source={previewSource} style={styles.previewImage} contentFit="cover" />
        </View>
      )}

      <Pressable
        onPress={handleAnalyze}
        disabled={loading}
        style={({ pressed }) => [styles.analyzeButton, (pressed || loading) && styles.analyzePressed]}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.analyzeLabel}>Analyze Image</Text>}
      </Pressable>

      {error && <Text style={styles.error}>{error}</Text>}

      {result?.description && (
        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultTitle}>Analysis Result</Text>
            <Pressable onPress={handleCopy} style={({ pressed }) => [styles.copyButton, pressed && styles.copyPressed]}>
              <Text style={styles.copyLabel}>{copied ? 'Copied' : 'Copy'}</Text>
            </Pressable>
          </View>
          <Text style={styles.resultText}>{result.description}</Text>
          {result.usage?.totalTokens != null && (
            <Text style={styles.resultMeta}>{result.usage.totalTokens} tokens</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#e2e8f0',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  actionPressed: {
    opacity: 0.85,
  },
  actionLabel: {
    color: '#fff',
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  secondaryLabel: {
    color: '#f8fafc',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#e2e8f0',
  },
  promptInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  previewContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
  },
  previewImage: {
    width: '100%',
    height: 220,
  },
  analyzeButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  analyzePressed: {
    opacity: 0.9,
  },
  analyzeLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: '#fca5a5',
    fontSize: 13,
  },
  resultCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
    gap: 8,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultTitle: {
    color: '#cbd5f5',
    fontWeight: '600',
    fontSize: 15,
  },
  copyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  copyPressed: {
    opacity: 0.8,
  },
  copyLabel: {
    color: '#e2e8f0',
    fontWeight: '500',
  },
  resultText: {
    color: '#e2e8f0',
    fontSize: 15,
    lineHeight: 22,
  },
  resultMeta: {
    color: '#94a3b8',
    fontSize: 12,
  },
});


