/**
 * BottomSheetWithSteps Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * A wrapper for the BottomSheet to handle multi-step navigation.
 */
import React from 'react';
import { View } from 'react-native';
import { BottomSheet } from './BottomSheet';
import type { BottomSheetWithStepsProps } from './BottomSheet.types';

export const BottomSheetWithSteps = ({
  steps,
  currentStepId,
  ...rest
}: BottomSheetWithStepsProps) => {
  const currentStep = steps.find((step) => step.id === currentStepId);

  return (
    <BottomSheet {...rest}>
      <View key={currentStepId}>
        {currentStep ? currentStep.component : null}
      </View>
    </BottomSheet>
  );
};
