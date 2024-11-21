import { SiteTitle, DateForm, Sidebar, WeatherTable, CompareView } from "./ui";
import { useQueries } from "@tanstack/react-query";
import {
  searchWeatherQueries,
  findWeatherDataById,
  findWeatherQueriesByUserId,
} from "./utils/api";
import { WeatherQueries, WeatherData, CompareWeatherData } from "./utils/types";
import { useEffect, useId, useState } from "react";
import { defaultMonth, defaultYear } from "./utils";

const defaultQuery = `${defaultMonth}-${defaultYear}`;

const NBWeatherApp = () => {
  const [toggleView, setToggleView] = useState<boolean>(true);
  const [query, setQuery] = useState<string>(defaultQuery);
  const [queryId, setQueryId] = useState<number | null>(null);
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
          const [, currentQuery] = context.queryKey;
          const weatherQueries = await searchWeatherQueries(
            currentQuery as string
          );

          if (!weatherQueries || weatherQueries.length === 0) {
            throw new Error("No weather query data available");
          }
          setQueryId(weatherQueries[0].id);
          return findWeatherDataById(weatherQueries[0].id);
        },
      },
      {
        queryKey: ["weatherQueryByUser", userId],
        queryFn: () => findWeatherQueriesByUserId(userId as string),
        enabled: !!userId,
      },
    ],
  });

  const [_, weatherDataResult, weatherQueryByUserResult] = queries;

  // Use the results
  const weatherData = weatherDataResult.data;
  const weatherQueryByUser = weatherQueryByUserResult.data;
  console.log({
    weatherData,
  });
  // Rest of your component logic here

  // const removeFromCompareList = useCallback(
  //   (id: string) => {
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     //@ts-expect-error
  //     setCompareList((prevList) => prevList.filter((item) => item.id !== id));
  //   },
  //   [setCompareList]
  // );

  console.log("compareList >> above", compareList);

  return (
    <main className="flex">
      <Sidebar
        title="History"
        items={weatherQueryByUser as WeatherQueries[]}
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
        <DateForm setQuery={setQuery} setToggleView={setToggleView} />
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
