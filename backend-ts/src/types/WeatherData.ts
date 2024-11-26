export enum Weather {
  CLEAR = "CLEAR",
  MAINLY_CLEAR = "MAINLY_CLEAR",
  PARTLY_CLOUDY = "PARTLY_CLOUDY",
  OVERCAST = "OVERCAST",
  FOG = "FOG",
  DRIZZLE = "DRIZZLE",
  RAIN = "RAIN",
  SNOW = "SNOW",
  RAIN_SHOWERS = "RAIN_SHOWERS",
  SNOW_SHOWERS = "SNOW_SHOWERS",
  THUNDERSTORM = "THUNDERSTORM",
  UNKNOWN = "UNKNOWN",
}

export interface WeatherData {
  id?: number;
  highTemp: number;
  lowTemp: number;
  weather: string;
  windSpeed: number;
  queryId: number;
  date: Date;
}
