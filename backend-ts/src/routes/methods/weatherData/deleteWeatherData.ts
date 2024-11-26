import { WeatherDataRepository } from "../../../repository/weatherDataRepository";

const weatherDataRepository = WeatherDataRepository;

export async function deleteWeatherData(id: number): Promise<void> {
  console.log(`Deleting weather data with id: ${id}`);

  try {
    const exists = await weatherDataRepository.existsById(id);
    if (exists) {
      await weatherDataRepository.deleteById(id);
    } else {
      console.warn(`Weather data with id ${id} not found`);
      throw new Error("Weather data not found");
    }
  } catch (error) {
    console.error(`Error deleting weather data with id ${id}:`, error);
    throw new Error(`Failed to delete weather data: ${JSON.stringify(error)}`);
  }
}
