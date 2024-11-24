import { WeatherDataRepository } from "../../../repository";
import { WeatherData } from "../../../types";

const weatherDataRepository = WeatherDataRepository;

export async function updateWeatherData(
  id: number,
  updatedWeatherData: Partial<WeatherData>
): Promise<WeatherData> {
  console.log(`Updating weather data with id: ${id}`);

  try {
    const existingWeatherData = await weatherDataRepository.findById(id);

    if (existingWeatherData) {
      // Update the fields you want to change
      const weatherDataToUpdate: WeatherData = {
        ...existingWeatherData,
        highTemp: updatedWeatherData.highTemp ?? existingWeatherData.highTemp,
        lowTemp: updatedWeatherData.lowTemp ?? existingWeatherData.lowTemp,
        weather: updatedWeatherData.weather ?? existingWeatherData.weather,
        windSpeed:
          updatedWeatherData.windSpeed ?? existingWeatherData.windSpeed,
        queryId: updatedWeatherData.queryId ?? existingWeatherData.queryId,
        // Add more fields as necessary
      };

      const updatedData = await weatherDataRepository.save(weatherDataToUpdate);
      return updatedData;
    } else {
      console.warn(`Weather data with id ${id} not found`);
      throw new Error("Weather data not found");
    }
  } catch (error) {
    console.error(`Error updating weather data with id ${id}:`, error);
    throw new Error(`Failed to update weather data: ${JSON.stringify(error)}`);
  }
}
