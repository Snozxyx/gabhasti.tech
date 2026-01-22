declare global {
  interface Window {
    dataLayer?: Record<string, any>[];
    gtag?: (...args: any[]) => void;
  }
}

let gaInitialized = false;

const getMeasurementId = () => import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

export const initGA = () => {
  if (gaInitialized) return;
  const measurementId = getMeasurementId();
  if (!measurementId || typeof window === 'undefined') return;

  if (!window.dataLayer) {
    window.dataLayer = [];
  }

  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', measurementId);

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  gaInitialized = true;
};

export const sendPageView = (path: string) => {
  const measurementId = getMeasurementId();
  if (!measurementId || !window.gtag) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
};
