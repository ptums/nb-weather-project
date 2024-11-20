import { CompareView, SiteTitle, WeatherTable, DateForm, Sidebar } from "./ui";
import { useWeatherQueries } from "./context/weather-queries-context";
import { useEffect, useState } from "react";
import { useWeatherData } from "./context/weather-data-context";
import { useToggleView } from "./context/toggle-view-context";
import { useCurrentDateDB } from "./hooks/useCurrentDateDB";
import { useWeatherDataDB } from "./hooks/useWeatherDataDB";
import {
  findWeatherDataById,
  findWeatherQueriesByUserId,
  searchWeatherQueries,
} from "./utils/api";
import { WeatherData, WeatherQueries } from "./utils/types";
import { useQuery } from "@tanstack/react-query";

function App() {
  const {
    weatherDataDB,
    isLoading: isWeatherLoading,
    error: weatherError,
    addWeatherData,
  } = useWeatherDataDB();
  const {
    localDateDB,
    isLoading: isDateLoading,
    error: dateError,
  } = useCurrentDateDB();

  const { setWeatherData } = useWeatherData();
  const { queryList, setQueryList, query, setQueryId, queryId } =
    useWeatherQueries();
  const { decision } = useToggleView();
  const [userId, setUserId] = useState<string | null>(null);
  const [shouldSearchWeatherQuery, setShouldSearchWeatherQuery] =
    useState<boolean>(false);
  const [shouldFindWeatherDataById, setShouldSFindWeatherDataById] =
    useState<boolean>(false);
  const [
    shouldFindWeatherQueriesByUserId,
    setShouldFindWeatherQueriesByUserId,
  ] = useState<boolean>(false);

  // Add tan stack queries here ...
  const { data: weatherQuery } = useQuery<WeatherQueries[], Error>({
    queryKey: ["weatherQuery"],
    queryFn: () => searchWeatherQueries(query),
    enabled: shouldSearchWeatherQuery && query !== null,
  });

  const { data: weatherData } = useQuery<WeatherData[], Error>({
    queryKey: ["weatherData"],
    queryFn: () => findWeatherDataById(queryId as number),
    enabled: shouldFindWeatherDataById,
  });

  const { data: userWeatherQueriesByUser } = useQuery<WeatherQueries[], Error>({
    queryKey: ["userWeatherQueries"],
    queryFn: () => findWeatherQueriesByUserId(userId as string),
    enabled: shouldFindWeatherQueriesByUserId && userId !== null,
  });

  useEffect(() => {
    const fetchInitialWeatherData = async () => {
      if (isWeatherLoading || isDateLoading) {
        return; // Wait until both hooks have loaded
      }
      if (weatherError || dateError) {
        console.error("Error loading data:", weatherError || dateError);
        return;
      }

      if (weatherDataDB.length > 0) {
        setWeatherData(weatherDataDB);
      } else {
        setShouldSearchWeatherQuery(true);

        if (weatherQuery && weatherQuery.length > 0) {
          const id = weatherQuery[0]?.id;
          setQueryId(id);

          setShouldSFindWeatherDataById(true);

          if (weatherData && weatherData.length > 0) {
            setWeatherData(weatherData);
            addWeatherData(weatherData);
            setShouldSearchWeatherQuery(false);
          }
        }
      }

      if (userId) {
        // once the weather data is set update the sidebar
        setShouldFindWeatherQueriesByUserId(true);
        if (
          queryList.length <= 0 &&
          userWeatherQueriesByUser &&
          userWeatherQueriesByUser.length > 0
        ) {
          setQueryList(userWeatherQueriesByUser);
          setShouldSFindWeatherDataById(false);
          setShouldFindWeatherQueriesByUserId(false);
        }
      }
    };
    fetchInitialWeatherData();
  }, [
    isWeatherLoading,
    isDateLoading,
    dateError,
    weatherError,
    weatherDataDB,
    localDateDB,
    setWeatherData,
    query,
    weatherData,
    setQueryId,
    addWeatherData,
    userId,
    queryList.length,
    setQueryList,
    weatherQuery,
    userWeatherQueriesByUser,
  ]);

  // Get userId from local storage
  useEffect(() => {
    if (!userId) {
      const storedUserId = localStorage.getItem("user_id");
      setUserId(storedUserId);
    }
  }, [userId]);

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
