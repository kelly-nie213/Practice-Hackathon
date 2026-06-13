export type WeatherCondition =
  | 'Sunny'
  | 'Partly Cloudy'
  | 'Cloudy'
  | 'Foggy'
  | 'Drizzling'
  | 'Raining'
  | 'Snowing'
  | 'Thunderstorms';

export interface WeatherData {
  temperatureF: number;
  condition: WeatherCondition;
  iconName: string; // Ionicons name
}

function wmoToCondition(code: number): { condition: WeatherCondition; iconName: string } {
  if (code === 0) return { condition: 'Sunny', iconName: 'sunny' };
  if (code <= 2) return { condition: 'Partly Cloudy', iconName: 'partly-sunny' };
  if (code === 3) return { condition: 'Cloudy', iconName: 'cloud' };
  if (code <= 49) return { condition: 'Foggy', iconName: 'cloud' };
  if (code <= 57) return { condition: 'Drizzling', iconName: 'rainy' };
  if (code <= 67) return { condition: 'Raining', iconName: 'rainy' };
  if (code <= 77) return { condition: 'Snowing', iconName: 'snow' };
  if (code <= 82) return { condition: 'Raining', iconName: 'rainy' };
  return { condition: 'Thunderstorms', iconName: 'thunderstorm' };
}

export async function fetchWeather(lat: number, lng: number): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weathercode&temperature_unit=fahrenheit&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Weather fetch failed');
  const json = await res.json();
  const tempF = Math.round(json.current.temperature_2m as number);
  const code = json.current.weathercode as number;
  const { condition, iconName } = wmoToCondition(code);
  return { temperatureF: tempF, condition, iconName };
}
