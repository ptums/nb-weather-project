import { useState, useCallback, useEffect } from "react";
import { IndexedDBTable } from "@/utils/db";
import { WeatherData } from "@/utils/types";

const weatherDataTable = new IndexedDBTable<WeatherData>("weatherData");

export function useWeatherDataDB() {
  const [weatherDataDB, setWeatherDataDB] = useState<WeatherData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWeatherData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await weatherDataTable.getAll();

      if (data.length > 0) {
        setWeatherDataDB(data);
        setError(null);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred")
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  const addWeatherData = async (newData: WeatherData[]) => {
    try {
      newData.forEach(async (data) => {
        await weatherDataTable.set(data);
      });
      await fetchWeatherData();
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to add weather data")
      );
    }
  };

  const updateWeatherData = async (
    id: number,
    updatedData: Partial<WeatherData>
  ) => {
    try {
      await weatherDataTable.update(id, updatedData);
      await fetchWeatherData();
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to update weather data")
      );
    }
  };

  const deleteWeatherData = async (id: number) => {
    try {
      await weatherDataTable.delete(id);
      await fetchWeatherData();
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to delete weather data")
      );
    }
  };

  const getWeatherDataByDate = async (
    date: number
  ): Promise<WeatherData | undefined> => {
    try {
      const allData = await weatherDataTable.getAll();
      return allData.find((data) => data.date === date);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to get weather data by date")
      );
      return undefined;
    }
  };

  return {
    weatherDataDB,
    isLoading,
    error,
    addWeatherData,
    setWeatherDataDB,
    updateWeatherData,
    deleteWeatherData,
    getWeatherDataByDate,
    refreshWeatherData: fetchWeatherData,
  };
}
