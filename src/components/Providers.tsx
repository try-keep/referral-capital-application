'use client';

import { useLogRocket, usePageSegmentAnalytics } from '@/hooks';
import { PropsWithChildren } from 'react';

export function Providers({ children }: PropsWithChildren) {
  usePageSegmentAnalytics();
  useLogRocket();
  return <>{children}</>;
}
