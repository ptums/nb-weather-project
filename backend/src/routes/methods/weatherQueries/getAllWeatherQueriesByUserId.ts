import { WeatherQueriesRepository } from "../../../repository";
import { WeatherQueries } from "../../../types";

const weatherQueriesRepository = WeatherQueriesRepository;

export async function getAllWeatherQueriesByUserId(
  userId: string
): Promise<WeatherQueries[]> {
  console.log(`Fetching all weather query entries by userId: ${userId}`);

  try {
    const userWeatherQueries = await weatherQueriesRepository.findAllByUserId(
      userId
    );
    return userWeatherQueries;
  } catch (error) {
    console.error(
      `Error fetching all weather query entries for userId ${userId}:`,
      error
    );
    throw new Error(
      `Failed to fetch all weather query entries: ${JSON.stringify(error)}`
    );
  }
}
