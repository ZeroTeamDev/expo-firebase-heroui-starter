/**
 * BottomSheet Types
 * Created by Kien AI (leejungkiin@gmail.com)
 */
import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';

export interface BottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  children: ReactNode;
  containerStyle?: ViewStyle;
  maxHeight?: number; // Percentage from 0 to 1, defaults to 0.9
}

export interface BottomSheetHeaderProps {
  title: string;
  onClose: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

export interface BottomSheetStep {
  id: string;
  component: ReactNode;
}

export interface BottomSheetWithStepsProps
  extends Omit<BottomSheetProps, 'children'> {
  steps: BottomSheetStep[];
  currentStepId: string;
}
