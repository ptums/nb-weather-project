import { WeatherQueriesRepository } from "../../../repository";
import { WeatherQueries } from "../../../types";
const weatherQueriesRepository = WeatherQueriesRepository;

export async function createWeatherQueries(
  query: string,
  userId: string
): Promise<WeatherQueries> {
  console.log("Creating or retrieving weather query entry");

  try {
    const existingQuery = await weatherQueriesRepository.findByQueryAndUserId(
      query,
      userId
    );

    if (existingQuery) {
      console.log(
        `Existing weather query found for query: ${query} and userId: ${userId}`
      );
      return existingQuery;
    } else {
      console.log(
        `Creating new weather query entry for query: ${query} and userId: ${userId}`
      );
      return await weatherQueriesRepository.save(query, userId);
    }
  } catch (error) {
    console.error("Error creating or retrieving weather query entry:", error);
    throw new Error(
      `Failed to create or retrieve weather query entry: ${JSON.stringify(
        error
      )}`
    );
  }
}
