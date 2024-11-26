import { SiteTitle, DateForm, Sidebar, WeatherTable, CompareView } from "./ui";
import { useQueries, useQuery } from "@tanstack/react-query";
import {
  searchWeatherQueries,
  findWeatherQueriesByUserId,
  createWeatherData,
  createWeatherQueries,
  deleteWeatherQueries,
  findWeatherDataById,
} from "./utils/api";
import { WeatherQueries, WeatherData, CompareWeatherData } from "./utils/types";
import { useCallback, useEffect, useId, useState } from "react";
import { convertToMonthsYears, defaultMonth, defaultYear } from "./utils";

const defaultQuery = `${defaultMonth}-${defaultYear}`;
const NBWeatherApp = () => {
  const [query, setQuery] = useState<string>(defaultQuery);
  const [userId, setUserId] = useState<string | null>(null);
  const [comparisonMode, setComparisonMode] = useState(false);
  const randomId = useId();

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");

    if (!storedUserId) {
      localStorage.setItem("user_id", randomId);
      console.log("New user_id set in localStorage:", randomId);
    } else {
      console.log("Existing user_id found in localStorage:", storedUserId);
      setUserId(storedUserId);
    }
  }, [randomId]);

  const { data: weatherQueryByUser, refetch } = useQuery({
    queryKey: ["weatherQueryByUser", userId],
    queryFn: () => findWeatherQueriesByUserId(userId as string),
    enabled: userId !== null,
  });

  const queries = useQueries({
    queries: [
      {
        queryKey: ["weatherQuery", query],
        queryFn: () => searchWeatherQueries(query),
        enabled: !!query,
      },
      {
        queryKey: ["weatherData", query],
        queryFn: async (context) => {
          refetch();

          const [, currentQuery] = context.queryKey;
          const weatherQueries = await searchWeatherQueries(
            currentQuery as string
          );

          if (!weatherQueries || weatherQueries.length === 0) {
            const createWeatherQuery = await createWeatherQueries(
              currentQuery as string,
              userId as string
            );

            return createWeatherData(query, createWeatherQuery[0].id);
          }

          return createWeatherData(query, weatherQueries[0].id);
        },
      },
    ],
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, weatherDataResult] = queries;

  // Use the results
  const weatherData = weatherDataResult.data;

  const clearHistoryList = useCallback(() => {
    (weatherQueryByUser as WeatherQueries[]).forEach(async (data) => {
      await deleteWeatherQueries(data?.id);
    });
  }, [weatherQueryByUser]);

  const [compareList, setCompareList] = useState<CompareWeatherData[]>([]);

  const clearCompareList = useCallback(() => {
    setCompareList([]);
  }, [setCompareList]);

  const removeFromCompareList = useCallback(
    (id: string) => {
      setCompareList((prevList) => prevList.filter((item) => item.id !== id));
    },
    [setCompareList]
  );

  const addToCompareList = useCallback(
    async (query: string) => {
      const month = convertToMonthsYears(query, 0);
      const year = convertToMonthsYears(query, 1);

      const results = await searchWeatherQueries(query);

      if (results.length > 0) {
        const weatherData = await findWeatherDataById(results[0]?.id);

        const newItem = {
          weatherData,
          month,
          year,
          id: Date.now().toString(),
          query,
        };

        setCompareList((prevList) => [...prevList, newItem]);
      } else {
        const storedUserId = localStorage.getItem("user_id");
        if (storedUserId) {
          const createWeatherQuery = await createWeatherQueries(
            query,
            storedUserId as string
          );

          const newWeatherData = await createWeatherData(
            query,
            createWeatherQuery.id as number
          );

          const newItem = {
            weatherData: newWeatherData,
            month,
            year,
            id: Date.now().toString(),
            query,
          };

          setCompareList((prevList) => [...prevList, newItem]);
        }
      }
    },
    [setCompareList]
  );

  return (
    <>
      <main className="flex">
        <Sidebar
          weatherQueries={(weatherQueryByUser as WeatherQueries[]) || []}
          compareWeather={compareList || []}
          setQuery={setQuery}
          clearQueries={clearHistoryList}
          clearCompare={clearCompareList}
          comparisonMode={comparisonMode}
          compareList={compareList}
          addToCompareList={addToCompareList}
          removeFromCompareList={removeFromCompareList}
        />
        <div className="flex flex-col w-full py-8 px-4 bg-rose-100">
          <SiteTitle />
          <DateForm
            setQuery={setQuery}
            setComparisonMode={setComparisonMode}
            comparisonMode={comparisonMode}
            addToCompareList={addToCompareList}
          />
          {weatherData && !comparisonMode && (
            <div className="min-h-screen w-full sm:w-3/4">
              <WeatherTable
                weatherData={weatherData as WeatherData[]}
                query={query}
              />
            </div>
          )}
          {compareList && comparisonMode && (
            <CompareView compareList={compareList} />
          )}
        </div>
      </main>
    </>
  );
};

export default NBWeatherApp;
