import { WeatherQueriesRepository } from "../../../repository";
import { WeatherQueries } from "../../../types";

const weatherQueriesRepository = WeatherQueriesRepository;

export async function getWeatherQueryById(
  id: number
): Promise<WeatherQueries | null> {
  console.log(`Fetching weather query with id: ${id}`);

  try {
    const weatherQuery = await weatherQueriesRepository.findById(id);
    return weatherQuery;
  } catch (error) {
    console.error(`Error fetching weather query with id ${id}:`, error);
    throw new Error(`Failed to fetch weather query: ${error}`);
  }
}
