import { WeatherQueriesRepository } from "../../../repository";
import { WeatherQueries } from "../../../types";

const weatherQueriesRepository = WeatherQueriesRepository;

export async function getAllWeatherQueries(): Promise<WeatherQueries[]> {
  console.log("Fetching all weather query entries");

  try {
    const allWeatherQueries = await weatherQueriesRepository.findAll();
    return allWeatherQueries;
  } catch (error) {
    console.error("Error fetching all weather query entries:", error);
    throw new Error(
      `Failed to fetch all weather query entries: ${JSON.stringify(error)}`
    );
  }
}
