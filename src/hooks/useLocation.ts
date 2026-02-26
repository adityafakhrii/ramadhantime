import { useState, useEffect, useCallback } from 'react';

export interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationData | null>(() => {
    const saved = localStorage.getItem('ramadhan-location');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectLocation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: false,
        });
      });

      const { latitude, longitude } = pos.coords;

      // Reverse geocode using free API
      const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=id`
      );
      const data = await res.json();
      const city = data.city || data.locality || data.principalSubdivision || 'Unknown';

      const loc: LocationData = { latitude, longitude, city };
      setLocation(loc);
      localStorage.setItem('ramadhan-location', JSON.stringify(loc));
    } catch (err) {
      setError('Izin lokasi ditolak atau gagal. Silakan atur lokasi manual.');
      console.error('Geolocation error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const setManualCity = useCallback(async (cityName: string) => {
    setLoading(true);
    setError(null);
    try {
      // Use geocoding to find coords
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=id`
      );
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const r = data.results[0];
        const loc: LocationData = {
          latitude: r.latitude,
          longitude: r.longitude,
          city: r.name,
        };
        setLocation(loc);
        localStorage.setItem('ramadhan-location', JSON.stringify(loc));
      } else {
        setError('Kota tidak ditemukan.');
      }
    } catch {
      setError('Gagal mencari kota.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Try auto-detect on first load if no saved location
    const saved = localStorage.getItem('ramadhan-location');
    if (!saved && navigator.geolocation) {
      detectLocation();
    }
  }, [detectLocation]);

  const setResolvedCity = useCallback((loc: LocationData) => {
    setLocation(loc);
    localStorage.setItem('ramadhan-location', JSON.stringify(loc));
  }, []);

  return { location, loading, error, detectLocation, setManualCity, setResolvedCity };
}
