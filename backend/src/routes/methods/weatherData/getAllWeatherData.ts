import { WeatherDataRepository } from "../../../repository";
import { WeatherData } from "../../../types";

const weatherDataRepository = WeatherDataRepository;

export async function getAllWeatherData(): Promise<WeatherData[]> {
  console.log("Fetching all weather data entries");

  try {
    const allWeatherData = await weatherDataRepository.findAll();
    return allWeatherData;
  } catch (error) {
    console.error("Error fetching all weather data entries:", error);
    throw new Error(
      `Failed to fetch all weather data entries: ${JSON.stringify(error)}`
    );
  }
}
