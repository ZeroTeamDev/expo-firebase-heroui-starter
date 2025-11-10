// Created by Kien AI (leejungkiin@gmail.com)
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, GestureResponderEvent, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import { useThemeColor } from '@/hooks/use-theme-color';

type RecordingState = 'idle' | 'recording' | 'error';
type PermissionState = 'granted' | 'denied' | 'undetermined' | 'checking';

export interface AIChipProps {
  /** Optional label rendered next to the microphone icon */
  label?: string;
  /** Triggered when recording successfully completes */
  onRecordingComplete?: (payload: { uri: string; duration: number }) => void;
  /** Triggered when the chip encounters an error */
  onError?: (error: Error) => void;
  /** Called when recording state toggles */
  onStateChange?: (state: RecordingState) => void;
  /** Custom press handler - invoked after internal toggle logic */
  onPress?: (event: GestureResponderEvent, state: RecordingState) => void;
  /** Override component style */
  style?: StyleProp<ViewStyle>;
  /** Size multiplier for padding and waveform height */
  size?: 'sm' | 'md' | 'lg';
  /** Show loader while requesting permissions */
  showLoadingIndicator?: boolean;
}

class SkiaErrorBoundary extends React.Component<{ onError: () => void }, { hasError: boolean }> {
  constructor(props: { onError: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

const SAMPLE_COUNT = 36;
const WAVEFORM_HEIGHT = {
  sm: 20,
  md: 24,
  lg: 30,
} as const;
const WAVEFORM_WIDTH = {
  sm: 44,
  md: 56,
  lg: 72,
} as const;
const PADDING_VERTICAL = {
  sm: 6,
  md: 8,
  lg: 10,
} as const;
const PADDING_HORIZONTAL = {
  sm: 10,
  md: 14,
  lg: 18,
} as const;

const recordingOptions: Audio.RecordingOptions = {
  ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
  isMeteringEnabled: true,
};

export function AIChip({
  label = 'Hold to talk',
  onRecordingComplete,
  onError,
  onStateChange,
  onPress,
  style,
  size = 'md',
  showLoadingIndicator = true,
}: AIChipProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [permissionStatus, setPermissionStatus] = useState<PermissionState>('checking');
  const [samples, setSamples] = useState<number[]>(() => Array.from({ length: SAMPLE_COUNT }, () => 0));
  const [error, setError] = useState<Error | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const meteringIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const backgroundColor = useThemeColor({ light: '#1f2933', dark: '#111827' }, 'background');
  const activeColor = useThemeColor({}, 'tint');
  const errorColor = '#f87171';
  const isSkiaAvailable = useMemo(() => {
    try {
      if (!Skia || typeof Skia.Path?.Make !== 'function' || !Skia.CanvasKit) {
        return false;
      }
      const testPath = Skia.Path.Make();
      testPath.lineTo?.(0, 0);
      testPath.close?.();
      return true;
    } catch (error) {
      console.warn('[AIChip] Skia unavailable, using fallback waveform.', error);
      return false;
    }
  }, []);
  const [skiaEnabled, setSkiaEnabled] = useState(isSkiaAvailable);

  const waveformHeight = WAVEFORM_HEIGHT[size];
  const waveformWidth = WAVEFORM_WIDTH[size];
  const paddingVertical = PADDING_VERTICAL[size];
  const paddingHorizontal = PADDING_HORIZONTAL[size];

  const updatePermission = useCallback(async () => {
    try {
      const status = await Audio.requestPermissionsAsync();
      setPermissionStatus((status.status as PermissionState) ?? 'undetermined');
      return (status.status as PermissionState) ?? 'undetermined';
    } catch (err) {
      const permissionError = new Error('Failed to request microphone permission');
      setError(permissionError);
      onError?.(permissionError);
      setPermissionStatus('denied');
      return 'denied';
    }
  }, [onError]);

  useEffect(() => {
    // Prepare audio mode once at mount
    (async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
        const { status } = await Audio.getPermissionsAsync();
        setPermissionStatus((status as PermissionState) ?? 'undetermined');
      } catch (err) {
        const audioError = err instanceof Error ? err : new Error('Failed to initialize audio mode');
        setError(audioError);
        setPermissionStatus('denied');
        onError?.(audioError);
      }
    })();

    return () => {
      if (meteringIntervalRef.current) {
        clearInterval(meteringIntervalRef.current);
      }
    };
  }, [onError]);

  useEffect(() => {
    onStateChange?.(recordingState);
  }, [onStateChange, recordingState]);

  const pushSample = useCallback((value: number) => {
    setSamples((prev) => {
      const next = prev.slice(1);
      next.push(value);
      return next;
    });
  }, []);

  const handleMeteringUpdate = useCallback(async () => {
    const recording = recordingRef.current;
    if (!recording) return;

    try {
      const status = await recording.getStatusAsync();
      if (!status.canRecord) return;

      const metering = (status as Audio.RecordingStatus & { metering?: number }).metering;
      if (typeof metering === 'number') {
        // Normalize metering (dB) to 0..1 range
        const normalized = Math.min(Math.max((metering + 160) / 160, 0), 1);
        pushSample(normalized);
      } else {
        // Fallback: generate small decay when metering unavailable
        pushSample(Math.random() * 0.15);
      }
    } catch (err) {
      const meteringError = err instanceof Error ? err : new Error('Unable to read recording status');
      setError(meteringError);
      pushSample(0);
    }
  }, [pushSample]);

  const startMetering = useCallback(() => {
    if (meteringIntervalRef.current) {
      clearInterval(meteringIntervalRef.current);
    }
    meteringIntervalRef.current = setInterval(handleMeteringUpdate, 100);
  }, [handleMeteringUpdate]);

  const stopMetering = useCallback(() => {
    if (meteringIntervalRef.current) {
      clearInterval(meteringIntervalRef.current);
      meteringIntervalRef.current = null;
    }
    setSamples((prev) => prev.map(() => 0));
  }, []);

  const stopRecording = useCallback(async () => {
    if (!recordingRef.current) return;

    try {
      const recording = recordingRef.current;
      const status = await recording.getStatusAsync();
      if (status.isDoneRecording) {
        return;
      }

      await recording.stopAndUnloadAsync();
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const uri = recording.getURI();
      if (uri) {
        onRecordingComplete?.({ uri, duration: status.durationMillis ?? 0 });
      }
    } catch (err) {
      const stopError = err instanceof Error ? err : new Error('Failed to stop recording');
      setError(stopError);
      onError?.(stopError);
      setRecordingState('error');
    } finally {
      stopMetering();
      recordingRef.current = null;
      setRecordingState('idle');
    }
  }, [onError, onRecordingComplete, stopMetering]);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      const status = permissionStatus === 'granted' ? 'granted' : await updatePermission();
      if (status !== 'granted') {
        throw new Error('Microphone permission is required to record audio');
      }

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setRecordingState('recording');

      const { recording } = await Audio.Recording.createAsync(recordingOptions);
      recordingRef.current = recording;
      startMetering();
    } catch (err) {
      const recordingError = err instanceof Error ? err : new Error('Failed to start recording');
      setError(recordingError);
      setRecordingState('error');
      stopMetering();
      onError?.(recordingError);
    }
  }, [permissionStatus, startMetering, stopMetering, updatePermission, onError]);

  useEffect(() => {
    return () => {
      stopMetering();
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch(() => undefined);
        recordingRef.current = null;
      }
    };
  }, [stopMetering]);

  const waveformPath = useMemo(() => {
    if (!skiaEnabled) {
      return null;
    }
    const path = Skia.Path.Make();
    if (!path) return null;

    const width = waveformWidth;
    const mid = waveformHeight / 2;

    path.moveTo(0, mid);
    samples.forEach((value, index) => {
      const x = (index / (SAMPLE_COUNT - 1)) * width;
      const y = mid - value * mid;
      path.lineTo(x, y);
    });
    path.lineTo(width, mid);
    return path;
  }, [skiaEnabled, samples, waveformHeight]);

  const fallbackWaveform = useMemo(() => {
    if (skiaEnabled) {
      return [];
    }

    const barCount = 12;
    const step = Math.max(1, Math.floor(samples.length / barCount));
    return samples.filter((_, index) => index % step === 0).slice(-barCount);
  }, [skiaEnabled, samples]);

  const handlePress = useCallback(
    async (event: GestureResponderEvent) => {
      const isCurrentlyRecording = recordingState === 'recording';
      const nextState: RecordingState = isCurrentlyRecording ? 'idle' : 'recording';

      if (isCurrentlyRecording) {
        await stopRecording();
      } else {
        await startRecording();
      }

      onPress?.(event, nextState);
    },
    [onPress, recordingState, startRecording, stopRecording]
  );

  const isLoading = permissionStatus === 'checking' && showLoadingIndicator;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ busy: recordingState === 'recording', disabled: permissionStatus === 'denied' }}
      accessibilityLabel="AI voice assistant trigger"
      onPress={handlePress}
      style={({ pressed }) => [
        styles.chip,
        {
          paddingHorizontal,
          paddingVertical,
          backgroundColor:
            recordingState === 'error'
              ? errorColor
              : recordingState === 'recording'
              ? activeColor
              : backgroundColor,
          opacity: pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      <View style={styles.content}>
        <View style={[styles.waveformContainer, { height: waveformHeight, width: waveformWidth }]}> 
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : skiaEnabled && waveformPath ? (
            <SkiaErrorBoundary onError={() => setSkiaEnabled(false)}>
              <Canvas style={{ width: waveformWidth, height: waveformHeight }}>
                <Path path={waveformPath} style="stroke" strokeWidth={2} color="white" />
              </Canvas>
            </SkiaErrorBoundary>
          ) : (
            <View style={[styles.fallbackWaveform, { height: waveformHeight, width: waveformWidth }]}> 
              {fallbackWaveform.map((value, index) => (
                <View
                  key={`wave-${index}`}
                  style={[
                    styles.fallbackBar,
                    {
                      height: Math.max(4, value * waveformHeight),
                      opacity: recordingState === 'recording' ? 1 : 0.4,
                    },
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        <Text style={styles.label} numberOfLines={1}>
          {recordingState === 'recording' ? 'Listening…' : label}
        </Text>
      </View>

      {error && recordingState === 'error' && (
        <Text style={styles.errorText} numberOfLines={1}>
          {error.message}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 999,
    minWidth: 140,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
  },
  waveformContainer: {
    overflow: 'hidden',
    justifyContent: 'center',
  },
  fallbackWaveform: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 2,
  },
  fallbackBar: {
    width: 4,
    borderRadius: 999,
    backgroundColor: '#fff',
  },
  label: {
    color: '#fff',
    fontWeight: '600',
    flexShrink: 1,
  },
  errorText: {
    marginTop: 4,
    color: '#FFEDED',
    fontSize: 12,
  },
});
