/**
 * Database Browser Screen
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Browse and query Firestore collections
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'heroui-native';
import { AppHeader } from '@/components/layout/AppHeader';
import { Card } from 'heroui-native';
import { FormInput } from '@/components/forms/FormInput';
import { FormButton } from '@/components/forms/FormButton';
import { useCollection } from '@/hooks/use-firestore';
import { Spinner } from '@/components/feedback/Spinner';
import { EmptyState } from '@/components/data/EmptyState';
import { ErrorState } from '@/components/data/ErrorState';
import { DataCard } from '@/components/data';

export default function DatabaseBrowserScreen() {
  const { colors } = useTheme();
  const [collectionPath, setCollectionPath] = useState('users');
  const [queryPath, setQueryPath] = useState('');

  const { data: documents, loading, error } = useCollection(
    queryPath || collectionPath,
    {
      subscribe: true,
      limit: 50,
    },
  );

  const handleQuery = () => {
    if (queryPath) {
      setCollectionPath(queryPath);
      setQueryPath('');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="Database Browser" subtitle="Browse Firestore collections" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card className="mb-4 rounded-xl">
          <Card.Body style={{ padding: 16, gap: 12 }}>
            <FormInput
              label="Collection Path"
              placeholder="e.g., users, posts/comments"
              value={collectionPath}
              onChangeText={setCollectionPath}
            />
            <FormInput
              label="Query Path (optional)"
              placeholder="e.g., users?orderBy=createdAt&limit=10"
              value={queryPath}
              onChangeText={setQueryPath}
            />
            <FormButton title="Query" onPress={handleQuery} />
          </Card.Body>
        </Card>

        {loading && <Spinner />}
        {error && <ErrorState message={error.message} />}
        {!loading && !error && documents && documents.length === 0 && (
          <EmptyState message="No documents found" />
        )}

        {documents && documents.length > 0 && (
          <View style={styles.documents}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Documents ({documents.length})
            </Text>
            {documents.map((doc: any, index: number) => (
              <DataCard
                key={doc.id || index}
                title={doc.id || `Document ${index + 1}`}
                description={JSON.stringify(doc, null, 2)}
                condensed
                style={{ marginBottom: 12 }}
              />
            ))}
          </View>
        )}
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
  documents: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
});

