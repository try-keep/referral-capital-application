import { useEffect } from 'react';
import { filterObjectEmptyValues, isDefined } from '@/utils';

import { analytics } from '@/lib/segment';
import { useApplicationData } from './';
import { usePathname, useSearchParams } from 'next/navigation';

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
  const applicationData = useApplicationData();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      analytics.page(
        {
          page: url,
        },
        undefined,
        {
          traits: {
            ...(isDefined(applicationData)
              ? filterObjectEmptyValues({
                  email: applicationData.email,
                  phone: applicationData.phone,
                  firstName: applicationData.firstName,
                  lastName: applicationData.lastName,
                  businessName: applicationData.businessName,
                })
              : {}),
          },
        }
      );
    };
    handleRouteChange(pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  //Track initial page view on page load when analytics is ready
  useEffect(() => {
    console.log('analytics.ready', pathname);
    analytics.ready(() => {
      analytics.page({ page: pathname }, undefined, {
        traits: {
          ...(isDefined(applicationData)
            ? filterObjectEmptyValues({
                email: applicationData.email,
                phone: applicationData.phone,
                firstName: applicationData.firstName,
                lastName: applicationData.lastName,
                businessName: applicationData.businessName,
              })
            : {}),
        },
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
