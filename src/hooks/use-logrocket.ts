//import * as Sentry from '@sentry/nextjs'
import LogRocket from 'logrocket';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { isDefined } from '@/utils';

import { getLogRocketOptions } from '@/utils/session-recordings';
import { extractApplicationData } from '@/utils/application';
import { getApplicationTraits } from '@/utils/analytics/traits';

const shouldInitializeLogRocket =
  process.env.NEXT_PUBLIC_ENVIRONMENT === 'production' &&
  isDefined(process.env.NEXT_PUBLIC_LOGROCKET_APP_ID);

export const useLogRocket = () => {
  const pathname = usePathname();
  const logRocketInitialized = useRef(false);
  const shouldSendData = useRef(false); // Initially set to false to prevent data sending
  const applicationData = extractApplicationData();

  // Initialize LogRocket
  useEffect(() => {
    if (!logRocketInitialized.current) {
      const logRocketOptions = getLogRocketOptions({
        shouldSendData: () => shouldSendData.current, // Required to keep reference to the original value
      });
      if (shouldInitializeLogRocket) {
        LogRocket.init(
          process.env.NEXT_PUBLIC_LOGROCKET_APP_ID ?? '',
          logRocketOptions
        );
        logRocketInitialized.current = true;
      }
    }
  }, []);

  // Identify user after email is available
  useEffect(() => {
    if (logRocketInitialized.current && !shouldSendData.current) {
      shouldSendData.current = true; // Enable data sending once Logrocket is initialized
    } else if (logRocketInitialized.current && shouldSendData.current) {
      const traits = getApplicationTraits(extractApplicationData());
      if (isDefined(traits.email)) {
        LogRocket.identify(traits.email, traits);
      }
      // TODO: Add session URL to Sentry once we have sentry integration
      /* LogRocket.getSessionURL((sessionURL) => {
          const scope = Sentry.getCurrentScope()
          scope.setExtra('LogRocket session', sessionURL)
          scope.setUser(filteredData)
        }) */
    }
  }, [pathname, applicationData]);
};
