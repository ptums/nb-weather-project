import { WeatherQueriesRepository } from "../../../repository";
import { WeatherQueries } from "../../../types";

const weatherQueriesRepository = WeatherQueriesRepository;

export async function updateWeatherQueries(
  id: number,
  query: string
): Promise<WeatherQueries> {
  console.log(`Updating weather query with id: ${id}`);

  try {
    const existingWeatherQuery = await weatherQueriesRepository.findById(id);
    if (existingWeatherQuery) {
      // Add more fields as necessary
      const updatedWeatherQuery = await weatherQueriesRepository.save(
        query,
        existingWeatherQuery.userId
      );
      return updatedWeatherQuery;
    } else {
      console.warn(`Weather query with id ${id} not found`);
      throw new Error("Weather query not found");
    }
  } catch (error) {
    console.error(`Error updating weather query with id ${id}:`, error);
    throw new Error(`Failed to update weather query: ${JSON.stringify(error)}`);
  }
}
