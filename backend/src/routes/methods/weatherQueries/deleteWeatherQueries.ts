import { WeatherQueriesRepository } from "../../../repository";

const weatherQueriesRepository = WeatherQueriesRepository;

export async function deleteWeatherQuery(id: number): Promise<void> {
  console.log(`Deleting weather query with id: ${id}`);

  try {
    const exists = await weatherQueriesRepository.existsById(id);
    if (exists) {
      await weatherQueriesRepository.deleteById(id);
    } else {
      console.warn(`Weather query with id ${id} not found`);
      throw new Error("Weather query not found");
    }
  } catch (error) {
    console.error(`Error deleting weather query with id ${id}:`, error);
    throw new Error(`Failed to delete weather query: ${JSON.stringify(error)}`);
  }
}
