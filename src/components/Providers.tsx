'use client';

import { usePageSegmentAnalytics } from '@/hooks/use-page-segment-analytics';
import { PropsWithChildren } from 'react';

export function Providers({ children }: PropsWithChildren) {
  usePageSegmentAnalytics();
  return <>{children}</>;
}
