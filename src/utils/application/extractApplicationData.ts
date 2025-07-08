import { isDefined } from '../misc';

export function extractApplicationData() {
  if (typeof window !== 'undefined' && isDefined(window.localStorage)) {
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
