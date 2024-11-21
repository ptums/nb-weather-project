export type WeatherData = {
  date: number;
  highTemp: number;
  lowTemp: number;
  weather:
    | "CLEAR"
    | "MAINLY_CLEAR"
    | "PARTLY_CLOUDY"
    | "OVERCAST"
    | "FOG"
    | "RAIN"
    | "DRIZZLE"
    | "SNOW"
    | "RAIN_SHOWERS"
    | "SNOW_SHOWERS"
    | "THUNDERSTORM"
    | "SUNNY"
    | "UNKNOWN";
  windSpeed: number;
  queryId: number;
};

export type WeatherQueries = {
  id: number;
  query: string;
  userId: string;
};

export type WeatherQueriesPayload = {
  userId: string;
  query: string;
};

export type WeatherDataPayload = {
  queryId: number;
  query: string;
};

export type PayloadTypes = WeatherQueriesPayload | WeatherDataPayload;

export type FormattedChartData = {
  date: number;
  [key: string]: number | string | null;
};

export type CompareWeatherData = {
  id: string;
  weatherData: WeatherData[];
  month: number;
  year: number;
  query: string;
};
