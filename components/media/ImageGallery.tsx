// Created by Kien AI (leejungkiin@gmail.com)
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'heroui-native';
import { MediaImage, type MediaImageProps } from './Image';

export interface MediaGalleryItem {
  id: string;
  imageProps: MediaImageProps;
  caption?: string;
}

export interface MediaImageGalleryProps {
  items: MediaGalleryItem[];
  initialIndex?: number;
  onChange?: (index: number) => void;
}

export function MediaImageGallery({ items, initialIndex = 0, onChange }: MediaImageGalleryProps) {
  const { colors, theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(Math.min(Math.max(initialIndex, 0), Math.max(items.length - 1, 0)));

  const handleSelect = (index: number) => {
    setActiveIndex(index);
    onChange?.(index);
  };

  const activeItem = items[activeIndex];

  const galleryBackground = useMemo(
    () => ({ backgroundColor: theme === 'dark' ? 'rgba(148,163,184,0.08)' : 'rgba(30,41,59,0.04)' }),
    [theme],
  );

  return (
    <View style={[styles.container, galleryBackground]}>
      {activeItem ? (
        <View style={styles.preview}>
          <MediaImage
            {...activeItem.imageProps}
            aspectRatio={activeItem.imageProps.aspectRatio ?? 3 / 2}
            borderRadius={20}
            style={styles.previewImage}
          />
          {activeItem.caption ? (
            <Text style={[styles.caption, { color: colors.mutedForeground }]}>{activeItem.caption}</Text>
          ) : null}
        </View>
      ) : null}

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.thumbnailList}
        renderItem={({ item, index }) => {
          const isActive = index === activeIndex;
          return (
            <Pressable
              onPress={() => handleSelect(index)}
              style={[styles.thumbnailWrapper, isActive && { borderColor: colors.accent }]}
              accessibilityRole="button"
              accessibilityLabel={`View image ${index + 1}`}
            >
              <MediaImage
                {...item.imageProps}
                aspectRatio={1}
                borderRadius={12}
                style={[styles.thumbnailImage, { borderColor: isActive ? colors.accent : 'transparent' }]}
              />
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 16,
    gap: 16,
  },
  preview: {
    gap: 12,
  },
  previewImage: {
    width: '100%',
  },
  caption: {
    fontSize: 13,
  },
  thumbnailList: {
    gap: 12,
  },
  thumbnailWrapper: {
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 16,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: 72,
    height: 72,
    borderWidth: 1,
    borderColor: 'transparent',
  },
});



