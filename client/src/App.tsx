import { CompareView, SiteTitle, WeatherTable, DateForm, Sidebar } from "./ui";
import { useWeatherQueries } from "./context/weather-queries-context";
import { useEffect, useState } from "react";
import { useWeatherData } from "./context/weather-data-context";
import { localDate } from "./utils";
import { useToggleView } from "./context/toggle-view-context";
import { useCurrentDateDB } from "./hooks/useCurrentDateDB";
import { useWeatherDataDB } from "./hooks/useWeatherDataDB";
import {
  findWeatherDataById,
  findWeatherQueriesByUserId,
  searchWeatherQueries,
} from "./utils/api";

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

  // const [shouldFetch, setShouldFetch] = useState(false);
  const { setWeatherData, weatherData } = useWeatherData();
  const { queryList, setQueryList, query, setQueryId } = useWeatherQueries();
  const { decision } = useToggleView();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialWeatherData = async () => {
      if (isWeatherLoading || isDateLoading) {
        return; // Wait until both hooks have loaded
      }
      if (weatherError || dateError) {
        console.error("Error loading data:", weatherError || dateError);
        return;
      }

      if (weatherDataDB.length > 0 && weatherData.length <= 0) {
        if (localDate === localDateDB) {
          setWeatherData(weatherDataDB);
        } else {
          const weatherQueries = await searchWeatherQueries(query);

          if (weatherQueries.length > 0) {
            const id = weatherQueries[0]?.id;
            setQueryId(id);

            const requestWeatherData = await findWeatherDataById(id);

            if (requestWeatherData.length > 0) {
              setWeatherData(requestWeatherData);
              addWeatherData(requestWeatherData);

              // once the weather data is set update the sidebar
              const requestWeatherQueries = await findWeatherQueriesByUserId(
                userId as string
              );

              if (
                queryList.length <= 0 &&
                requestWeatherQueries &&
                requestWeatherQueries?.length > 0
              ) {
                setQueryList(requestWeatherQueries);
              }
            }
          }
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
