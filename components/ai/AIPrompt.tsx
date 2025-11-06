// Created by Kien AI (leejungkiin@gmail.com)
import React from 'react';
import { TextInput } from 'react-native';

export function AIPrompt(props: React.ComponentProps<typeof TextInput>) {
  return <TextInput placeholder="Ask AI..." {...props} />;
}
