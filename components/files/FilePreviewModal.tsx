/**
 * File Preview Modal
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Modal component for previewing files (PDF, TXT, MD, Images)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useTheme } from 'heroui-native';
import * as WebBrowser from 'expo-web-browser';
import { Image } from 'expo-image';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getFileUrl } from '@/services/storage/storage.service';
import type { FileMetadata } from '@/services/permissions/permission.service';

interface FilePreviewModalProps {
  file: FileMetadata | null;
  visible: boolean;
  onClose: () => void;
}

export function FilePreviewModal({
  file,
  visible,
  onClose,
}: FilePreviewModalProps) {
  const { colors, theme } = useTheme();
  const [downloadURL, setDownloadURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string | null>(null);

  // Get file type from mimeType or file extension
  const getFileType = (file: FileMetadata): 'image' | 'pdf' | 'text' | 'unknown' => {
    const mimeType = file.mimeType?.toLowerCase() || '';
    const fileName = file.name?.toLowerCase() || '';
    
    // Check for images
    if (
      mimeType.startsWith('image/') ||
      fileName.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i)
    ) {
      return 'image';
    }
    
    // Check for PDF
    if (
      mimeType === 'application/pdf' ||
      fileName.endsWith('.pdf')
    ) {
      return 'pdf';
    }
    
    // Check for text files
    if (
      mimeType.startsWith('text/') ||
      fileName.match(/\.(txt|md|markdown|json|xml|html|css|js|ts|tsx|jsx)$/i)
    ) {
      return 'text';
    }
    
    return 'unknown';
  };

  // Load download URL and content
  useEffect(() => {
    if (!file || !visible) {
      setDownloadURL(null);
      setTextContent(null);
      setError(null);
      return;
    }

    const loadFile = async () => {
      setLoading(true);
      setError(null);

      try {
        // Try to use cached downloadURL first, fallback to getting from storage
        let url: string;
        if (file.downloadURL) {
          url = file.downloadURL;
          setDownloadURL(url);
        } else {
          // Get download URL from storage if not cached
          url = await getFileUrl(file.storagePath);
          setDownloadURL(url);
        }

        // For text files, fetch and display content
        const fileType = getFileType(file);
        if (fileType === 'text') {
          try {
            const response = await fetch(url);
            if (response.ok) {
              const text = await response.text();
              setTextContent(text);
            } else if (response.status === 401 || response.status === 403) {
              // Token may have expired, try to get a new URL
              if (file.downloadURL) {
                console.warn('[FilePreview] Cached URL expired, fetching new URL');
                const newUrl = await getFileUrl(file.storagePath);
                setDownloadURL(newUrl);
                const newResponse = await fetch(newUrl);
                if (newResponse.ok) {
                  const text = await newResponse.text();
                  setTextContent(text);
                } else {
                  throw new Error(`Failed to fetch file: ${newResponse.status}`);
                }
              } else {
                throw new Error(`Failed to fetch file: ${response.status}`);
              }
            } else {
              throw new Error(`Failed to fetch file: ${response.status}`);
            }
          } catch (fetchError) {
            console.error('[FilePreview] Failed to fetch text content:', fetchError);
            // If we have a cached URL that failed, try getting a new one
            if (file.downloadURL && fetchError instanceof Error && fetchError.message.includes('401')) {
              try {
                const newUrl = await getFileUrl(file.storagePath);
                setDownloadURL(newUrl);
                const newResponse = await fetch(newUrl);
                if (newResponse.ok) {
                  const text = await newResponse.text();
                  setTextContent(text);
                } else {
                  setError('Failed to load file content');
                }
              } catch (retryError) {
                setError('Failed to load file content');
              }
            } else {
              setError('Failed to load file content');
            }
          }
        }
      } catch (err) {
        console.error('[FilePreview] Failed to load file:', err);
        // If cached URL failed, try getting a new one
        if (file.downloadURL && err instanceof Error) {
          try {
            const newUrl = await getFileUrl(file.storagePath);
            setDownloadURL(newUrl);
          } catch (retryError) {
            setError(err instanceof Error ? err.message : 'Failed to load file');
          }
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load file');
        }
      } finally {
        setLoading(false);
      }
    };

    loadFile();
  }, [file, visible]);

  const fileType = file ? getFileType(file) : 'unknown';

  const handleOpenInBrowser = async () => {
    if (!downloadURL) return;
    
    try {
      await WebBrowser.openBrowserAsync(downloadURL, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
        enableBarCollapsing: false,
        showTitle: true,
        toolbarColor: colors.background,
      });
    } catch (err) {
      console.error('[FilePreview] Failed to open in browser:', err);
      setError('Failed to open file in browser');
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
            Loading file...
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <IconSymbol
            name="exclamationmark.triangle.fill"
            size={48}
            color={colors.destructive}
          />
          <Text style={[styles.errorText, { color: colors.destructive }]}>
            {error}
          </Text>
          {downloadURL && (
            <TouchableOpacity
              onPress={handleOpenInBrowser}
              style={[styles.openButton, { backgroundColor: colors.accent }]}
            >
              <Text style={styles.openButtonText}>Open in Browser</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    if (!downloadURL) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
            No file selected
          </Text>
        </View>
      );
    }

    switch (fileType) {
      case 'image':
        return (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: downloadURL }}
              style={styles.image}
              contentFit="contain"
              transition={200}
              placeholderContentFit="contain"
            />
          </View>
        );

      case 'text':
        return (
          <ScrollView
            style={styles.textContainer}
            contentContainerStyle={styles.textContentContainer}
          >
            <View style={[styles.textWrapper, { backgroundColor: colors.surface1 }]}>
              <Text
                style={[styles.textContent, { color: colors.foreground }]}
                selectable
              >
                {textContent || 'Loading content...'}
              </Text>
            </View>
          </ScrollView>
        );

      case 'pdf':
        return (
          <View style={styles.pdfContainer}>
            <IconSymbol
              name="doc.fill"
              size={64}
              color={colors.accent}
            />
            <Text style={[styles.pdfText, { color: colors.foreground }]}>
              PDF Preview
            </Text>
            <Text style={[styles.pdfSubtext, { color: colors.mutedForeground }]}>
              Click the button below to open in browser
            </Text>
            <TouchableOpacity
              onPress={handleOpenInBrowser}
              style={[styles.openButton, { backgroundColor: colors.accent }]}
            >
              <Text style={styles.openButtonText}>Open PDF</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return (
          <View style={styles.unknownContainer}>
            <IconSymbol
              name="doc.fill"
              size={64}
              color={colors.mutedForeground}
            />
            <Text style={[styles.unknownText, { color: colors.foreground }]}>
              Preview not available
            </Text>
            <Text style={[styles.unknownSubtext, { color: colors.mutedForeground }]}>
              This file type cannot be previewed
            </Text>
            {downloadURL && (
              <TouchableOpacity
                onPress={handleOpenInBrowser}
                style={[styles.openButton, { backgroundColor: colors.accent }]}
              >
                <Text style={styles.openButtonText}>Open in Browser</Text>
              </TouchableOpacity>
            )}
          </View>
        );
    }
  };

  if (!file) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={styles.headerLeft}>
            <IconSymbol
              name={
                fileType === 'image'
                  ? 'photo.fill'
                  : fileType === 'pdf'
                  ? 'doc.fill'
                  : fileType === 'text'
                  ? 'doc.text.fill'
                  : 'doc.fill'
              }
              size={24}
              color={colors.accent}
            />
            <View style={styles.headerTextContainer}>
              <Text
                style={[styles.headerTitle, { color: colors.foreground }]}
                numberOfLines={1}
              >
                {file.name}
              </Text>
              <Text
                style={[styles.headerSubtitle, { color: colors.mutedForeground }]}
                numberOfLines={1}
              >
                {file.mimeType || 'Unknown type'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.closeButton, { backgroundColor: colors.surface1 }]}
          >
            <IconSymbol name="xmark" size={20} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>{renderContent()}</View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  headerTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorText: {
    marginTop: 16,
    fontSize: 14,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  image: {
    width: '100%',
    flex: 1,
    minHeight: 200,
  },
  textContainer: {
    flex: 1,
  },
  textContentContainer: {
    padding: 16,
  },
  textWrapper: {
    padding: 16,
    borderRadius: 8,
  },
  textContent: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 20,
  },
  pdfContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  pdfText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  pdfSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  unknownContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  unknownText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  unknownSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  openButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 24,
  },
  openButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

