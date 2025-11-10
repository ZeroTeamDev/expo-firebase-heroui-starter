// Created by Kien AI (leejungkiin@gmail.com)
import React, { useCallback } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'heroui-native';
import * as DocumentPicker from 'expo-document-picker';

export interface SelectedFile {
  name: string;
  size?: number;
  mimeType?: string | null;
  uri: string;
}

export interface FormFileUploadProps {
  label?: string;
  helperText?: string;
  error?: string;
  value?: SelectedFile[];
  defaultValue?: SelectedFile[];
  onChange?: (files: SelectedFile[]) => void;
  allowMultiple?: boolean;
  accept?: string[];
  disabled?: boolean;
  maxSizeBytes?: number;
  onRemove?: (file: SelectedFile) => void;
}

export function FormFileUpload({
  label,
  helperText,
  error,
  value,
  defaultValue = [],
  onChange,
  allowMultiple = false,
  accept,
  disabled = false,
  maxSizeBytes,
  onRemove,
}: FormFileUploadProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';
  const controlled = value !== undefined;
  const [internalFiles, setInternalFiles] = React.useState<SelectedFile[]>(defaultValue);
  const files = controlled ? value ?? [] : internalFiles;

  const pickFiles = useCallback(async () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      if (allowMultiple) input.multiple = true;
      if (accept && accept.length) {
        input.accept = accept.join(',');
      }
      input.onchange = () => {
        if (!input.files) return;
        const next: SelectedFile[] = Array.from(input.files).map((file) => ({
          name: file.name,
          size: file.size,
          mimeType: file.type,
          uri: URL.createObjectURL(file),
        }));
        const filtered = maxSizeBytes
          ? next.filter((file) => !file.size || file.size <= maxSizeBytes)
          : next;
        if (!controlled) {
          setInternalFiles(filtered);
        }
        onChange?.(filtered);
      };
      input.click();
      return;
    }

    const result = await DocumentPicker.getDocumentAsync({
      multiple: allowMultiple,
      type: accept?.length ? accept : '*/*',
      copyToCacheDirectory: false,
    });

    if (result.type === 'cancel') return;

    const selected = Array.isArray(result.assets) ? result.assets : [result];
    const mapped: SelectedFile[] = selected.map((asset) => ({
      name: asset.name ?? 'file',
      size: asset.size,
      mimeType: asset.mimeType ?? asset.type ?? null,
      uri: asset.uri,
    }));

    const filtered = maxSizeBytes
      ? mapped.filter((file) => !file.size || file.size <= maxSizeBytes)
      : mapped;

    if (!controlled) {
      setInternalFiles(filtered);
    }
    onChange?.(filtered);
  }, [accept, allowMultiple, controlled, maxSizeBytes, onChange]);

  const removeFile = useCallback(
    (file: SelectedFile) => {
      const next = files.filter((item) => item.uri !== file.uri);
      if (!controlled) {
        setInternalFiles(next);
      }
      onChange?.(next);
      onRemove?.(file);
    },
    [controlled, files, onChange, onRemove],
  );

  return (
    <View style={{ marginBottom: 16 }}>
      {label && (
        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.foreground, marginBottom: 8 }}>
          {label}
        </Text>
      )}

      <Pressable
        onPress={pickFiles}
        disabled={disabled}
        style={[
          styles.dropzone,
          {
            borderColor: error ? colors.danger : colors.border || colors.muted,
            backgroundColor: isDark ? 'rgba(15,23,42,0.6)' : 'rgba(148,163,184,0.08)',
            opacity: disabled ? 0.6 : 1,
          },
        ]}
      >
        <Text style={{ color: colors.foreground, fontWeight: '600' }}>Tap to upload</Text>
        <Text style={{ color: colors.mutedForeground || (isDark ? '#94a3b8' : '#64748b'), fontSize: 12 }}>
          {allowMultiple ? 'Select one or more files' : 'Select a file'}
        </Text>
        {accept && accept.length ? (
          <Text style={{ color: colors.mutedForeground || '#94a3b8', fontSize: 11 }}>
            Accepted: {accept.join(', ')}
          </Text>
        ) : null}
        {maxSizeBytes ? (
          <Text style={{ color: colors.mutedForeground || '#94a3b8', fontSize: 11 }}>
            Max size: {(maxSizeBytes / (1024 * 1024)).toFixed(1)} MB
          </Text>
        ) : null}
      </Pressable>

      {error ? (
        <Text style={{ color: colors.danger, fontSize: 12, marginTop: 4 }}>{error}</Text>
      ) : helperText ? (
        <Text style={{ color: colors.mutedForeground || (isDark ? '#94a3b8' : '#64748b'), fontSize: 12, marginTop: 4 }}>
          {helperText}
        </Text>
      ) : null}

      {files.length > 0 ? (
        <View style={{ marginTop: 12, gap: 8 }}>
          {files.map((file) => (
            <View
              key={file.uri}
              style={[
                styles.fileRow,
                { backgroundColor: isDark ? 'rgba(15,23,42,0.4)' : 'rgba(148,163,184,0.12)' },
              ]}
            >
              <View>
                <Text style={{ color: colors.foreground, fontWeight: '600' }}>{file.name}</Text>
                <Text style={{ color: colors.mutedForeground || '#94a3b8', fontSize: 12 }}>
                  {file.mimeType ?? 'Unknown'}{file.size ? ` · ${(file.size / 1024).toFixed(1)} KB` : ''}
                </Text>
              </View>
              <Pressable onPress={() => removeFile(file)} hitSlop={8}>
                <Text style={{ color: colors.accent, fontWeight: '600' }}>Remove</Text>
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  dropzone: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 6,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
});


