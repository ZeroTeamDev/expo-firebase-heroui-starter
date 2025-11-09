/**
 * Feature Guard Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Component that renders based on feature flag
 */

import React, { ReactNode } from 'react';
import { useIsFeatureEnabled } from '@/hooks/use-config';
import type { GlobalConfig } from '@/services/config/global-config.service';

interface FeatureGuardProps {
  children: ReactNode;
  feature: keyof GlobalConfig;
  fallback?: ReactNode;
}

export function FeatureGuard({ children, feature, fallback = null }: FeatureGuardProps) {
  const isEnabled = useIsFeatureEnabled(feature);

  if (!isEnabled) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

