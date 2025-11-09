/**
 * Admin Panel Layout
 * Created by Kien AI (leejungkiin@gmail.com)
 */

import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="config" />
      <Stack.Screen name="users" />
      <Stack.Screen name="files" />
      <Stack.Screen name="groups" />
      <Stack.Screen name="storage-test" />
    </Stack>
  );
}

