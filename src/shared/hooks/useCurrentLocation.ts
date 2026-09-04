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
    
//     // ✅ API key இல்லன்னாலும் lat,lng string return பண்ணும்
//     return json.results?.[0]?.formatted_address || `${lat}, ${lng}`;
//   } catch {
//     return `${lat}, ${lng}`; // ✅ Always something return பண்ணும்
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
import  logger  from '@/shared/utils/logger';
import { getApiInstance } from '@/shared/helpers/ApiHelper';

export type LocationResult = {
  lat: number;
  lng: number;
  address: string;
};

const GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 10000,
};

// --- Browser GPS -------------------------------------------------------------

const getCurrentPosition = (): Promise<GeolocationPosition> =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('GEOLOCATION_NOT_SUPPORTED'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      resolve,
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error('LOCATION_PERMISSION_DENIED'));
            break;
          case error.TIMEOUT:
            reject(new Error('LOCATION_TIMEOUT'));
            break;
          default:
            reject(new Error('LOCATION_UNAVAILABLE'));
        }
      },
      GEO_OPTIONS,
    );
  });

// --- Reverse geocoding via OUR backend, using the shared axios instance ------
// (Authorization header + automatic 401 token-refresh are handled by the
// interceptors inside getApiInstance — same as every other API call in the app.)

const formatCoords = (lat: number, lng: number) => `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  const coordsFallback = formatCoords(lat, lng);

try {
  const api = getApiInstance(import.meta.env.VITE_SITE_SERVICE_BASE_URL, true);
  const { data } = await api.get('/geolocation', { params: { lat, lng } });
  return data?.address || coordsFallback;
} catch (err) {
  logger.warn('useCurrentLocation: backend geocode failed', err);
  return coordsFallback;  
}
};

// --- Hook --------------------------------------------------------------------

export const useCurrentLocation = () => {
  const getLocation = useCallback(async (): Promise<LocationResult> => {
    const position = await getCurrentPosition();
    const { latitude: lat, longitude: lng } = position.coords;
    const address = await reverseGeocode(lat, lng);

    return { lat, lng, address };
  }, []);

  return { getLocation };
};