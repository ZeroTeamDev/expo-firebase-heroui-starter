// Created by Kien AI (leejungkiin@gmail.com)
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Audio, type AVPlaybackSource, type AVPlaybackStatus } from 'expo-av';
import { useTheme } from 'heroui-native';

export interface MediaAudioProps {
  source: AVPlaybackSource;
  title?: string;
  subtitle?: string;
  artworkUri?: string;
  autoPlay?: boolean;
  loop?: boolean;
  volume?: number;
  compact?: boolean;
  style?: ViewStyle;
  onStatusChange?: (status: AVPlaybackStatus) => void;
}

export function MediaAudio({
  source,
  title,
  subtitle,
  artworkUri,
  autoPlay = false,
  loop = false,
  volume = 1,
  compact = false,
  style,
  onStatusChange,
}: MediaAudioProps) {
  const { colors, theme } = useTheme();
  const soundRef = useRef<Audio.Sound | null>(null);
  const statusCallback = useRef<(status: AVPlaybackStatus) => void>();
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [isReady, setReady] = useState(false);
  const [isLoading, setLoading] = useState(true);

  statusCallback.current = (next: AVPlaybackStatus) => {
    setStatus(next);
    onStatusChange?.(next);
  };

  useEffect(() => {
    let isMounted = true;

    const setup = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        });

        const sound = new Audio.Sound();
        await sound.loadAsync(source, { shouldPlay: autoPlay, isLooping: loop, volume }, true);
        sound.setOnPlaybackStatusUpdate((next) => {
          if (isMounted) {
            statusCallback.current?.(next);
          }
        });
        soundRef.current = sound;
        if (isMounted) {
          setReady(true);
          setLoading(false);
        }
      } catch (error) {
        console.warn('MediaAudio setup failed', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    setup();

    return () => {
      isMounted = false;
      soundRef.current?.unloadAsync().catch(() => {});
    };
  }, [autoPlay, loop, source, volume]);

  const isPlaying = status?.isLoaded && status.isPlaying;
  const duration = status?.isLoaded ? status.durationMillis ?? 0 : 0;
  const position = status?.isLoaded ? status.positionMillis ?? 0 : 0;
  const progress = duration > 0 ? Math.min(position / duration, 1) : 0;

  const togglePlayback = useCallback(async () => {
    const sound = soundRef.current;
    if (!sound || !status?.isLoaded) return;
    try {
      if (status.isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    } catch (error) {
      console.warn('MediaAudio toggle failed', error);
    }
  }, [status]);

  const containerStyle = useMemo(
    () => [
      styles.container,
      {
        backgroundColor: theme === 'dark' ? 'rgba(30,41,59,0.72)' : '#ffffff',
        borderColor: theme === 'dark' ? 'rgba(148,163,184,0.22)' : 'rgba(15,23,42,0.06)',
      },
      compact && styles.compact,
      style,
    ],
    [compact, style, theme],
  );

  return (
    <View style={containerStyle}>
      <View style={styles.leading}>
        {artworkUri ? (
          <Image source={{ uri: artworkUri }} style={styles.artwork} />
        ) : (
          <View style={[styles.artwork, { backgroundColor: colors.accent, justifyContent: 'center', alignItems: 'center' }]}> 
            <Text style={styles.artworkIcon}>♫</Text>
          </View>
        )}
      </View>

      <View style={styles.body}>
        <View style={styles.metaRow}>
          <View style={styles.metaText}>
            {title ? <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={1}>{title}</Text> : null}
            {subtitle ? <Text style={[styles.subtitle, { color: colors.mutedForeground }]} numberOfLines={1}>{subtitle}</Text> : null}
          </View>

          <Pressable
            onPress={togglePlayback}
            disabled={!isReady}
            style={[styles.playChip, { backgroundColor: colors.accent, opacity: isReady ? 1 : 0.5 }]}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.accentForeground} />
            ) : (
              <Text style={[styles.playChipLabel, { color: colors.accentForeground }]}>{isPlaying ? 'Pause' : 'Play'}</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: colors.accent }]} />
        </View>

        <View style={styles.timeRow}>
          <Text style={[styles.timeLabel, { color: colors.mutedForeground }]}>{formatMillis(position)}</Text>
          <Text style={[styles.timeLabel, { color: colors.mutedForeground }]}>{duration > 0 ? formatMillis(duration) : '--:--'}</Text>
        </View>
      </View>
    </View>
  );
}

function formatMillis(millis: number) {
  if (!Number.isFinite(millis) || millis <= 0) {
    return '00:00';
  }
  const totalSeconds = Math.floor(millis / 1000);
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  compact: {
    paddingVertical: 10,
  },
  leading: {
    width: 56,
    height: 56,
  },
  artwork: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  artworkIcon: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
  },
  body: {
    flex: 1,
    gap: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  metaText: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
  },
  playChip: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  playChipLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressTrack: {
    height: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(148,163,184,0.3)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeLabel: {
    fontSize: 11,
    fontVariant: ['tabular-nums'],
  },
});



