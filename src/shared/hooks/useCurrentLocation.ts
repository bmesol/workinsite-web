// export type LocationResult = {
//   lat: number;
//   lng: number;
//   address: string;
// };

// const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';

// const requestLocationPermission = (): Promise<GeolocationPosition> => {
//   return new Promise((resolve, reject) => {
//     if (!navigator.geolocation) {
//       reject(new Error('GEOLOCATION_NOT_SUPPORTED'));
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (position) => resolve(position),
//       (error) => {
//         if (error.code === error.PERMISSION_DENIED) {
//           reject(new Error('LOCATION_PERMISSION_DENIED'));
//         } else {
//           reject(new Error('LOCATION_UNAVAILABLE'));
//         }
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 15000,
//         maximumAge: 10000,
//       },
//     );
//   });
// };

// const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
//   try {
//     const response = await fetch(
//       `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
//     );
//     const json = await response.json();
    
//     return json.results?.[0]?.formatted_address || `${lat}, ${lng}`;
//   } catch {
//     return `${lat}, ${lng}`;
//   }
// };

// export const useCurrentLocation = () => {
//   const getLocation = async (): Promise<LocationResult> => {
//     const position = await requestLocationPermission();

//     const { latitude, longitude } = position.coords;
//     const address = await reverseGeocode(latitude, longitude);

//     return {
//       lat: latitude,
//       lng: longitude,
//       address,
//     };
//   };

//   return { getLocation };
// };


import { useCallback } from 'react';
import axios from 'axios';
import logger from '@/shared/utils/logger';
import { getApiInstance } from '@/shared/helpers/ApiHelper';

export type LocationResult = {
  lat: number;
  lng: number;
  address: string;
  geoError?: string;
};

export type LocationErrorCode =
  | 'GEOLOCATION_NOT_SUPPORTED'
  | 'LOCATION_PERMISSION_DENIED'
  | 'LOCATION_TIMEOUT'
  | 'LOCATION_UNAVAILABLE';

// message = code, so old checks like `err.message === 'LOCATION_TIMEOUT'` still work
export class LocationError extends Error {
  code: LocationErrorCode;

  constructor(code: LocationErrorCode) {
    super(code);
    this.name = 'LocationError';
    this.code = code;
  }
}

const GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 10000,
};

// --- Browser GPS -------------------------------------------------------------

const getCurrentPosition = (): Promise<GeolocationPosition> =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new LocationError('GEOLOCATION_NOT_SUPPORTED'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      resolve,
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new LocationError('LOCATION_PERMISSION_DENIED'));
            break;
          case error.TIMEOUT:
            reject(new LocationError('LOCATION_TIMEOUT'));
            break;
          default:
            reject(new LocationError('LOCATION_UNAVAILABLE'));
        }
      },
      GEO_OPTIONS,
    );
  });

// --- Reverse geocoding via OUR backend ---------------------------------------
// (Authorization header + 401 token-refresh are handled by getApiInstance
// interceptors, same as every other API call in the app.)

const formatCoords = (lat: number, lng: number) => `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

const reverseGeocode = async (
  lat: number,
  lng: number,
  siteId?: number,
): Promise<{ address: string; geoError?: string }> => {
  const coordsFallback = formatCoords(lat, lng);

  try {
    const api = getApiInstance(import.meta.env.VITE_SITE_SERVICE_BASE_URL, true);

    const params: { lat: number; lng: number; siteId?: number } = { lat, lng };
    if (siteId !== undefined) params.siteId = siteId;

    const { data } = await api.get('/geolocation', { params, timeout: 5000 });
    return { address: data?.address || coordsFallback };
  } catch (err: unknown) {
    let geoError: string | undefined;

    if (axios.isAxiosError(err)) {
      const errData = err.response?.data;
      geoError =
        (Array.isArray(errData) && errData[0]?.message) ||
        errData?.message ||
        `Address lookup failed (${err.response?.status ?? 'network error'})`;
    }

    logger.warn('useCurrentLocation: backend geocode failed', err);
    return { address: coordsFallback, geoError };
  }
};

// --- Hook --------------------------------------------------------------------

export const useCurrentLocation = () => {
  const getLocation = useCallback(async (siteId?: number): Promise<LocationResult> => {
    const position = await getCurrentPosition();
    const { latitude: lat, longitude: lng } = position.coords;
    const { address, geoError } = await reverseGeocode(lat, lng, siteId);

    return { lat, lng, address, geoError };
  }, []);

  return { getLocation };
};