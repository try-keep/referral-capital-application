import { useEffect } from 'react';

import { analytics } from '@/lib/segment';
import { usePathname, useSearchParams } from 'next/navigation';
import { getApplicationTraits } from '@/utils/analytics/traits';
import { isDefined } from '@/utils';

function extractApplicationData() {
  if (isDefined(window.localStorage)) {
    const data = localStorage.getItem('referralApplicationData');
    try {
      return isDefined(data) ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error parsing application data', error);
      return {};
    }
  }
  return {};
}

/**
 * Hook to track page views and send application data to Segment
 * @description Ideally, this should be dependant on the router events, but as we're using the same page for all the steps,
 * we can rely on the pathname and search params to track the page views for now.
 * @todo: Refactor this to use the router events when we have steps separated in different pages
 * @todo: Parse and track the utm params (campaign, source, medium, etc)
 */
export const usePageSegmentAnalytics = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const applicationData = extractApplicationData();

  useEffect(() => {
    const handleRouteChange = (pathname: string) => {
      analytics.page(
        {
          page: pathname,
        },
        undefined,
        {
          traits: getApplicationTraits(applicationData),
        }
      );
    };
    handleRouteChange(pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);
};
