import { CompareView, SiteTitle, WeatherTable, DateForm, Sidebar } from "./ui";
import { useWeatherQueries } from "./context/weather-queries-context";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useWeatherData } from "./context/weather-data-context";
import { WeatherData, WeatherQueries } from "./utils/types";
import { localDate } from "./utils";
import { useToggleView } from "./context/toggle-view-context";
import { useCurrentDateDB } from "./hooks/useCurrentDateDB";
import { useWeatherDataDB } from "./hooks/useWeatherDataDB";
import { findWeatherDataById, findWeatherQueriesByUserId } from "./utils/api";

function App() {
  // const {
  //   weatherDataDB,
  //   isLoading: isWeatherLoading,
  //   error: weatherError,
  //   addWeatherData,
  // } = useWeatherDataDB();
  // const {
  //   localDateDB,
  //   isLoading: isDateLoading,
  //   error: dateError,
  // } = useCurrentDateDB();

  // const [shouldFetch, setShouldFetch] = useState(false);
  const { setWeatherData } = useWeatherData();
  const { queryId, queryList, setQueryList } = useWeatherQueries();
  const { decision } = useToggleView();
  const [userId, setUserId] = useState<string | null>(null);

  // get the latest weather data
  // useEffect(() => {
  //   const checkData = async () => {
  //     if (isWeatherLoading || isDateLoading) {
  //       return; // Wait until both hooks have loaded
  //     }

  //     if (weatherError || dateError) {
  //       console.error("Error loading data:", weatherError || dateError);
  //       setShouldFetch(true);
  //       return;
  //     }

  //     if (weatherDataDB.length > 0) {
  //       if (localDate === localDateDB) {
  //         console.log("Weather data is up to date");
  //         setWeatherData(weatherDataDB);
  //         setShouldFetch(false);
  //       } else {
  //         console.log(
  //           "Stored date doesn't match current date, fetching new data"
  //         );
  //         setShouldFetch(true);
  //       }
  //     } else {
  //       console.log("No existing weather data, fetching new data");
  //       setShouldFetch(true);
  //     }
  //   };

  //   checkData();
  // }, [
  //   weatherDataDB,
  //   isWeatherLoading,
  //   isDateLoading,
  //   weatherError,
  //   dateError,
  //   localDateDB,
  //   setWeatherData,
  // ]);

  // Set weather data to context
  const { data: weatherData } = useQuery<WeatherData[], Error>({
    queryKey: ["weatherData"],
    queryFn: () => findWeatherDataById(queryId as number),
    enabled: queryId !== null,
  });

  useEffect(() => {
    if (weatherData) {
      // addWeatherData(weatherData);
      setWeatherData(weatherData as WeatherData[]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weatherData]);

  // Set weather queries to context
  const { data: weatherQueries } = useQuery<WeatherQueries[], Error>({
    queryKey: ["weatherQueries"],
    queryFn: () => findWeatherQueriesByUserId(userId as string),
    enabled: userId !== null,
  });

  useEffect(() => {
    if (!userId) {
      const storedUserId = localStorage.getItem("user_id");
      setUserId(storedUserId);
    }
  }, [userId]);

  useEffect(() => {
    if (queryList.length <= 0 && weatherQueries && weatherQueries?.length > 0) {
      setQueryList(weatherQueries);
    }
  }, [weatherQueries, queryList, setQueryList]);

  return (
    <main className="flex">
      <Sidebar title="History" items={queryList} />
      {/*  <Sidebar title="Compare" items={compareList} displayShadow={true} /> */}
      <div className="flex flex-col w-full py-8 px-4 bg-rose-100">
        <SiteTitle />
        <DateForm />
        <div className="min-h-screen w-full sm:w-3/4">
          {decision.includes("compare") ? <CompareView /> : <WeatherTable />}
        </div>
      </div>
    </main>
  );
}

export default App;
