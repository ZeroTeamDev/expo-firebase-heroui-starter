// Created by Kien AI (leejungkiin@gmail.com)
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { ResizeMode, Video, type AVPlaybackSource, type AVPlaybackStatus } from 'expo-av';
import { useTheme } from 'heroui-native';

export interface MediaVideoProps {
  source: AVPlaybackSource;
  posterSource?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  showControls?: boolean;
  aspectRatio?: number;
  borderRadius?: number;
  overlay?: React.ReactNode;
  style?: ViewStyle;
  onStatusChange?: (status: AVPlaybackStatus) => void;
  onPressPlay?: () => void;
}

export function MediaVideo({
  source,
  posterSource,
  autoPlay = false,
  loop = false,
  muted = false,
  showControls = true,
  aspectRatio = 16 / 9,
  borderRadius = 16,
  overlay,
  style,
  onStatusChange,
  onPressPlay,
}: MediaVideoProps) {
  const { colors, theme } = useTheme();
  const videoRef = useRef<Video | null>(null);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [isBuffering, setBuffering] = useState(true);

  const handleStatusUpdate = useCallback(
    (next: AVPlaybackStatus) => {
      setStatus(next);
      setBuffering(!(next.isLoaded && !next.isBuffering));
      onStatusChange?.(next);
    },
    [onStatusChange],
  );

  useEffect(() => {
    return () => {
      videoRef.current?.unloadAsync().catch(() => {});
    };
  }, []);

  const isPlaying = status?.isLoaded && status.isPlaying;
  const isLoaded = status?.isLoaded ?? false;

  const togglePlayback = useCallback(async () => {
    if (!videoRef.current || !isLoaded) return;
    try {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
        onPressPlay?.();
      }
    } catch (error) {
      console.warn('MediaVideo toggle error', error);
    }
  }, [isLoaded, isPlaying, onPressPlay]);

  const containerStyle = useMemo(
    () => [
      styles.container,
      {
        aspectRatio,
        borderRadius,
        backgroundColor: theme === 'dark' ? 'rgba(15,23,42,0.75)' : 'rgba(15,23,42,0.08)',
      },
      style,
    ],
    [aspectRatio, borderRadius, style, theme],
  );

  return (
    <View style={containerStyle}>
      <Video
        ref={videoRef}
        source={source}
        style={[StyleSheet.absoluteFill, { borderRadius }]}
        resizeMode={ResizeMode.CONTAIN}
        posterSource={posterSource ? { uri: posterSource } : undefined}
        shouldPlay={autoPlay}
        isLooping={loop}
        isMuted={muted}
        useNativeControls={showControls}
        onPlaybackStatusUpdate={handleStatusUpdate}
      />

      {isBuffering ? (
        <View style={styles.bufferingOverlay}>
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      ) : null}

      {!showControls ? (
        <Pressable
          style={styles.playOverlay}
          onPress={togglePlayback}
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? 'Pause video' : 'Play video'}
        >
          <View
            style={[
              styles.playButton,
              {
                backgroundColor: isPlaying ? 'rgba(15,23,42,0.55)' : colors.accent,
              },
            ]}
          >
            <Text style={[styles.playLabel, { color: colors.accentForeground }]}>{isPlaying ? '❚❚' : '▶'}</Text>
          </View>
        </Pressable>
      ) : null}

      {overlay ? <View style={styles.overlay}>{overlay}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  bufferingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 52,
    height: 52,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.24,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  playLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
  },
});


