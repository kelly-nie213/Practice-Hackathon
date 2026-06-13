import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchWeather, WeatherData } from '../services/weather';

const CACHE_KEY = '@memowell/weather_cache';
const CACHE_TTL_MS = 30 * 60 * 1000;

interface Cached {
  data: WeatherData;
  fetchedAt: number;
}

interface UseWeatherResult {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
}

export function useWeather(lat: number | null, lng: number | null): UseWeatherResult {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lat === null || lng === null) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const raw = await AsyncStorage.getItem(CACHE_KEY);
        if (raw) {
          const cached: Cached = JSON.parse(raw);
          if (Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
            if (!cancelled) { setWeather(cached.data); setLoading(false); }
            return;
          }
        }
        const data = await fetchWeather(lat, lng);
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ data, fetchedAt: Date.now() }));
        if (!cancelled) setWeather(data);
      } catch (e: any) {
        if (!cancelled) setError(e.message ?? 'Weather unavailable');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [lat, lng]);

  return { weather, loading, error };
}
