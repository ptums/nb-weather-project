import { WeatherQueriesRepository } from "../../../repository";
import { WeatherQueries } from "../../../types";

const weatherQueriesRepository = WeatherQueriesRepository;

export async function searchWeatherQueries(
  query: string
): Promise<WeatherQueries[]> {
  console.log(`Searching weather queries with query: ${query}`);

  try {
    const weatherQueries =
      await weatherQueriesRepository.findByQueryContainingIgnoreCase(query);
    return weatherQueries;
  } catch (error) {
    console.error(
      `Error searching weather queries with query ${query}:`,
      error
    );
    throw new Error(
      `Failed to search weather queries: ${JSON.stringify(error)}`
    );
  }
}
