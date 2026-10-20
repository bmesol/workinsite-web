import ReactGA from 'react-ga4';

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string;

export function initAnalytics(): void {
  if (!MEASUREMENT_ID) return;
  ReactGA.initialize(MEASUREMENT_ID, {
    gaOptions: {
      send_page_view: false,
    },
  });
}

export function trackPageView(path: string, title?: string): void {
  if (!MEASUREMENT_ID) return;
  ReactGA.send({
    hitType: 'pageview',
    page: path,
    title: title ?? document.title,
  });
}

export function trackEvent(
  action: string,
  params?: Record<string, string | number | boolean>,
): void {
  if (!MEASUREMENT_ID) return;
  ReactGA.event(action, params ?? {});
}

// NEVER pass phone numbers, names, or personal data here
export function setUserProperties(props: {
  user_role?: string;
  app_version?: string;
}): void {
  if (!MEASUREMENT_ID) return;
  ReactGA.set(props);
}
