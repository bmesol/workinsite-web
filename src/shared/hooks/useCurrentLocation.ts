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

export type LocationResult = {
  lat: number;
  lng: number;
  address: string;
};

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';

const requestLocationPermission = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('GEOLOCATION_NOT_SUPPORTED'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(new Error('LOCATION_PERMISSION_DENIED'));
        } else if (error.code === error.TIMEOUT) {
          reject(new Error('LOCATION_TIMEOUT'));
        } else {
          reject(new Error('LOCATION_UNAVAILABLE'));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  });
};

/**
 * Reverse geocode: coordinates → human-readable address.
 * 1. Prefer the Maps JS SDK Geocoder if it's loaded on the page
 *    (works with referer-restricted browser keys).
 * 2. Fall back to the Geocoding HTTP endpoint.
 * 3. If everything fails, return "lat, lng" so check-in never blocks —
 *    but the real failure reason is logged to the console.
 */
const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  const coordsFallback = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

  // 1) Maps JS SDK Geocoder (browser-safe, works with referer-restricted keys)
  const g = (window as any).google;
  if (g?.maps?.Geocoder) {
    try {
      const geocoder = new g.maps.Geocoder();
      const { results } = await geocoder.geocode({ location: { lat, lng } });
      if (results?.[0]?.formatted_address) {
        return results[0].formatted_address as string;
      }
    } catch (e) {
      console.warn('[useCurrentLocation] JS SDK geocode failed:', e);
      // fall through to HTTP attempt
    }
  }

  // 2) Geocoding HTTP endpoint
  if (!GOOGLE_API_KEY) {
    console.warn(
      '[useCurrentLocation] VITE_GOOGLE_MAPS_API_KEY is empty — address will fall back to coordinates. ' +
        'Add it to your .env and restart the dev server.',
    );
    return coordsFallback;
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}&language=en`,
    );
    const json = await response.json();

    if (json.status === 'OK' && json.results?.[0]?.formatted_address) {
      return json.results[0].formatted_address as string;
    }

    // Surface the REAL reason instead of silently returning coordinates
    console.warn(
      `[useCurrentLocation] Geocoding failed — status: ${json.status}` +
        (json.error_message ? ` — ${json.error_message}` : ''),
    );
    return coordsFallback;
  } catch (e) {
    console.warn('[useCurrentLocation] Geocoding request error:', e);
    return coordsFallback;
  }
};

export const useCurrentLocation = () => {
  // useCallback so getLocation is referentially stable —
  // it's used in dependency arrays in useSupervisorDashboard / useSidebarAttendance
  const getLocation = useCallback(async (): Promise<LocationResult> => {
    const position = await requestLocationPermission();

    const { latitude, longitude } = position.coords;
    const address = await reverseGeocode(latitude, longitude);

    return {
      lat: latitude,
      lng: longitude,
      address,
    };
  }, []);

  return { getLocation };
};