// Created by Kien AI (leejungkiin@gmail.com)
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Image as ExpoImage, type ImageSource } from 'expo-image';
import { useTheme } from 'heroui-native';

export type ImageContentFit = 'cover' | 'contain' | 'fill' | 'scale-down';

export interface MediaImageProps {
  source: ImageSource;
  alt?: string;
  aspectRatio?: number;
  borderRadius?: number;
  contentFit?: ImageContentFit;
  transitionDuration?: number;
  blurhash?: string;
  loadingIndicator?: React.ReactNode;
  overlayContent?: React.ReactNode;
  style?: ViewStyle;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export function MediaImage({
  source,
  alt,
  aspectRatio,
  borderRadius = 16,
  contentFit = 'cover',
  transitionDuration = 240,
  blurhash,
  loadingIndicator,
  overlayContent,
  style,
  onLoad,
  onError,
}: MediaImageProps) {
  const { colors, theme } = useTheme();
  const [isLoaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const indicator = loadingIndicator ?? (
    <ActivityIndicator size="small" color={colors.accent} />
  );

  const handleLoad = () => {
    setLoaded(true);
    setHasError(false);
    onLoad?.();
  };

  const handleError = (error: Error) => {
    setHasError(true);
    onError?.(error);
  };

  const containerStyle = useMemo(
    () => [
      styles.container,
      {
        borderRadius,
        backgroundColor: theme === 'dark' ? 'rgba(15,23,42,0.6)' : 'rgba(148,163,184,0.18)',
        aspectRatio,
      },
      style,
    ],
    [aspectRatio, borderRadius, style, theme],
  );

  return (
    <View style={containerStyle} accessibilityRole="image" accessibilityLabel={alt}>
      {hasError ? (
        <View style={styles.errorState}>
          <Text style={[styles.errorTitle, { color: colors.mutedForeground }]}>Unable to load image</Text>
          {alt ? <Text style={[styles.errorSubtitle, { color: colors.mutedForeground }]}>{alt}</Text> : null}
        </View>
      ) : null}

      <ExpoImage
        source={source}
        style={[StyleSheet.absoluteFill, { borderRadius }]}
        contentFit={contentFit}
        transition={transitionDuration}
        placeholder={blurhash}
        cachePolicy="memory-disk"
        onLoad={handleLoad}
        onError={handleError}
      />

      {!isLoaded && !hasError ? <View style={styles.loading}>{indicator}</View> : null}
      {overlayContent ? <View pointerEvents="none" style={styles.overlay}>{overlayContent}</View> : null}

      {Platform.OS === 'web' ? (
        <Text style={styles.altText}>{alt}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    minHeight: 120,
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'stretch',
  },
  altText: {
    position: 'absolute',
    opacity: 0,
    height: 0,
    width: 0,
  },
  errorState: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 6,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  errorSubtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
});



