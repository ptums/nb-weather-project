import { WeatherQueries } from "@prisma/client";
import { WeatherQueriesRepository } from "../../repository";

export async function createWeatherQuery(
  queryData: Omit<WeatherQueries, "id">
): Promise<WeatherQueries | null> {
  try {
    return await WeatherQueriesRepository.create(queryData);
  } catch (error) {
    console.error("Error creating weather query:", error);
    return null;
  }
}

export async function findWeatherQueryById(
  id: number
): Promise<WeatherQueries | null> {
  try {
    return await WeatherQueriesRepository.findById(id);
  } catch (error) {
    console.error(`Error finding weather query with id ${id}:`, error);
    return null;
  }
}

export async function findWeatherQueriesByUserId(
  userId: string
): Promise<WeatherQueries[]> {
  try {
    return await WeatherQueriesRepository.findByUserId(userId);
  } catch (error) {
    console.error(`Error finding weather queries for user ${userId}:`, error);
    return [];
  }
}

export async function updateWeatherQuery(
  id: number,
  queryData: Partial<Omit<WeatherQueries, "id">>
): Promise<WeatherQueries | null> {
  try {
    return await WeatherQueriesRepository.update(id, queryData);
  } catch (error) {
    console.error(`Error updating weather query ${id}:`, error);
    return null;
  }
}

export async function deleteWeatherQuery(id: number): Promise<boolean> {
  try {
    await WeatherQueriesRepository.deleteById(id);
    return true;
  } catch (error) {
    console.error(`Error deleting weather query ${id}:`, error);
    return false;
  }
}

export async function getAllWeatherQueries(): Promise<WeatherQueries[]> {
  try {
    return await WeatherQueriesRepository.findAll();
  } catch (error) {
    console.error("Error fetching all weather queries:", error);
    return [];
  }
}

export async function addUserToWeatherQuery(
  queryId: number,
  userId: number
): Promise<WeatherQueries | null> {
  console.log({
    queryId,
    userId,
  });
  try {
    return await WeatherQueriesRepository.addUserToQuery(queryId, userId);
  } catch (error) {
    console.error(`Error adding user ${userId} to query ${queryId}:`, error);
    return null;
  }
}

export async function removeUserFromWeatherQuery(
  queryId: number,
  userId: number
): Promise<WeatherQueries | null> {
  try {
    return await WeatherQueriesRepository.removeUserFromQuery(queryId, userId);
  } catch (error) {
    console.error(
      `Error removing user ${userId} from query ${queryId}:`,
      error
    );
    return null;
  }
}

export async function findWeatherQueriesByQueryString(
  query: string
): Promise<WeatherQueries | null> {
  try {
    return await WeatherQueriesRepository.findByQuery(query);
  } catch (error) {
    console.error(`Error finding weather queries matching "${query}":`, error);
    return null;
  }
}

export async function weatherQueryExists(id: number): Promise<boolean> {
  try {
    return await WeatherQueriesRepository.existsById(id);
  } catch (error) {
    console.error(`Error checking existence of weather query ${id}:`, error);
    return false;
  }
}

export async function userWeatherQueryExists(
  queryId: number,
  userId: string
): Promise<boolean> {
  try {
    return await WeatherQueriesRepository.existsUser(queryId, userId);
  } catch (error) {
    console.error(
      `Error checking existence of weather queryId ${queryId}, userId ${userId}:`,
      error
    );
    return false;
  }
}
