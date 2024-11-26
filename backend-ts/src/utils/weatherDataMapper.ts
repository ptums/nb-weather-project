import { OpenMeteoData, WeatherData, Weather } from "../types";

export function mapOpenMeteoToWeatherData(
  data: OpenMeteoData,
  queryId: number
): WeatherData[] {
  console.log("queryId in mapper:", queryId);

  return data.daily.time.map((time, index) => ({
    date: new Date(time),
    highTemp: data.daily.temperature_2m_max[index],
    lowTemp: data.daily.temperature_2m_min[index],
    queryId: queryId,
    weather: mapWeatherCode(data.daily.weathercode[index]),
    windSpeed: data.daily.windspeed_10m_max[index],
  }));
}

function mapWeatherCode(code: number): Weather {
  switch (code) {
    case 0:
      return Weather.CLEAR;
    case 1:
    case 2:
      return Weather.MAINLY_CLEAR;
    case 3:
      return Weather.PARTLY_CLOUDY;
    case 45:
    case 48:
      return Weather.FOG;
    case 51:
    case 53:
    case 55:
      return Weather.DRIZZLE;
    case 61:
    case 63:
    case 65:
      return Weather.RAIN;
    case 71:
    case 73:
    case 75:
      return Weather.SNOW;
    case 80:
    case 81:
    case 82:
      return Weather.RAIN_SHOWERS;
    case 85:
    case 86:
      return Weather.SNOW_SHOWERS;
    case 95:
    case 96:
    case 99:
      return Weather.THUNDERSTORM;
    default:
      return Weather.UNKNOWN;
  }
}
