import { SiteTitle, DateForm, Sidebar, WeatherTable, CompareView } from "./ui";
import { useQueries, useQuery } from "@tanstack/react-query";
import {
  searchWeatherQueries,
  findWeatherQueriesByUserId,
  createWeatherData,
  createWeatherQueries,
} from "./utils/api";
import { WeatherQueries, WeatherData, CompareWeatherData } from "./utils/types";
import { useEffect, useId, useState } from "react";
import { defaultMonth, defaultYear } from "./utils";

const defaultQuery = `${defaultMonth}-${defaultYear}`;

const NBWeatherApp = () => {
  const [toggleView, setToggleView] = useState<boolean>(true);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [query, setQuery] = useState<string>(defaultQuery);
  const [userId, setUserId] = useState<string | null>(null);
  const [compareList, setCompareList] = useState<CompareWeatherData[]>([]);
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
    enabled: !!userId,
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

  const [_, weatherDataResult] = queries;

  // Use the results
  const weatherData = weatherDataResult.data;

  return (
    <main className="flex">
      <Sidebar
        title="History"
        items={(weatherQueryByUser as WeatherQueries[]) || []}
        setQuery={setQuery}
        setToggleView={setToggleView}
        setCompareList={setCompareList}
      />
      <Sidebar
        title="Compare"
        items={compareList}
        setQuery={setQuery}
        setToggleView={setToggleView}
        setCompareList={setCompareList}
      />
      <div className="flex flex-col w-full py-8 px-4 bg-rose-100">
        <SiteTitle />
        <DateForm
          setQuery={setQuery}
          setToggleView={setToggleView}
          setIsSubmitted={setIsSubmitted}
        />
        {weatherData && (
          <div className="min-h-screen w-full sm:w-3/4">
            {toggleView ? (
              <WeatherTable
                weatherData={weatherData as WeatherData[]}
                query={query}
              />
            ) : (
              <CompareView compareList={compareList} />
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default NBWeatherApp;
