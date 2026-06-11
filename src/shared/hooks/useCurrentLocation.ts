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

const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
    );
    const json = await response.json();
    
    // ✅ API key இல்லன்னாலும் lat,lng string return பண்ணும்
    return json.results?.[0]?.formatted_address || `${lat}, ${lng}`;
  } catch {
    return `${lat}, ${lng}`; // ✅ Always something return பண்ணும்
  }
};

export const useCurrentLocation = () => {
  const getLocation = async (): Promise<LocationResult> => {
    const position = await requestLocationPermission();

    const { latitude, longitude } = position.coords;
    const address = await reverseGeocode(latitude, longitude);

    return {
      lat: latitude,
      lng: longitude,
      address,
    };
  };

  return { getLocation };
};