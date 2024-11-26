import { WeatherDataRepository } from "../../../repository";
import { WeatherData } from "../../../types";

const weatherDataRepository = WeatherDataRepository;

export async function getWeatherDataById(id: number): Promise<WeatherData[]> {
  console.log(`Fetching weather data with query id: ${id}`);

  try {
    const weatherData = await weatherDataRepository.findByQueryId(id);
    return weatherData;
  } catch (error) {
    console.error(`Error fetching weather data with id ${id}:`, error);
    throw new Error(`Failed to fetch weather data: ${JSON.stringify(error)}`);
  }
}
