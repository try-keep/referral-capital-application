import LogRocket from 'logrocket';
import { obfuscateObject } from '@/utils';

type LogRocketOptions = Parameters<typeof LogRocket.init>[1];

export function getLogRocketOptions(
  customOptions: LogRocketOptions
): LogRocketOptions {
  const logRocketOptions: LogRocketOptions = {
    dom: {
      // prevent recording certain elements from the DOM
    },
    network: {
      requestSanitizer: (request) => {
        request.headers = obfuscateObject(request.headers);
        try {
          const parsedBody = JSON.parse(request.body ?? '');
          request.body = obfuscateObject(parsedBody);
        } catch (err) {
          request.body = null as any;
        }
        return request;
      },
      responseSanitizer: (response) => {
        response.headers = obfuscateObject(response.headers);
        try {
          const parsedBody = JSON.parse(response.body ?? '');
          response.body = obfuscateObject(parsedBody);
        } catch (err) {
          response.body = null as any;
        }
        return response;
      },
    },
    ...customOptions,
  };

  return logRocketOptions;
}
