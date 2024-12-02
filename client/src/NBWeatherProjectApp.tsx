import { useMutation, useQuery } from "@tanstack/react-query";
import { useId, useState, useEffect } from "react";
import {
  WEAHTER_DATA_ENDPOINT,
  WEAHTER_QUERY_ENDPOINT,
} from "./utils/constants";
import { CompareWeatherData, WeatherData, WeatherQueries } from "./utils/types";
import { CompareView, DateForm, WeatherTable } from "./ui";
import { buildApiUrl, buildComparionList } from "./utils";
import BarGraph from "./ui/displays/bar-graph";

export function NBWeatherProjectApp() {
  const generatedUserId = useId();
  const [userId, setUserId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("table");
  const [compareList, setCompareList] = useState<CompareWeatherData[]>([]);

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      localStorage.setItem("user_id", generatedUserId);
      setUserId(generatedUserId);
    }

    const now = new Date();
    const currentMonth = (now.getMonth() + 1).toString().padStart(2, "0");
    const currentYear = now.getFullYear().toString();
    setQuery(`${currentMonth}-${currentYear}`);
  }, [generatedUserId]);

  const {
    data: userQueries,
    isLoading: isLoadingQueries,
    error: queriesError,
    refetch,
  } = useQuery<WeatherQueries[], Error>({
    queryKey: ["userQueries", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID not found");
      const path = `${WEAHTER_QUERY_ENDPOINT}/user/${userId}`;
      const url = buildApiUrl(path);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch user queries");
      }
      return response.json();
    },
    enabled: !!userId,
  });

  const fetchWeatherMutation = useMutation<
    WeatherData[],
    Error,
    { query: string; userId: string }
  >({
    mutationFn: async ({ query, userId }) => {
      const path = `${WEAHTER_DATA_ENDPOINT}/fetch-weather`;
      const url = buildApiUrl(path);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, userId }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      refetch();
      return response.json();
    },
  });

  useEffect(() => {
    if (query && userId) {
      fetchWeatherMutation.mutate({ query, userId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, userId]);

  const handleComparisionList = async (query: string) => {
    if (fetchWeatherMutation.isSuccess) {
      const newItem = await buildComparionList(
        fetchWeatherMutation.data,
        query
      );

      setCompareList((prevList) => [...prevList, newItem]);
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-row justify-between">
        <DateForm setQuery={setQuery} />
        <button
          onClick={() => setMode(mode === "table" ? "graph" : "table")}
          className="underline"
        >
          {mode === "table" ? "Comparison " : "Table "}
          view
        </button>
      </div>
      <div className="flex flex-row justify-between	mt-4">
        <div className="w-1/6">
          {isLoadingQueries && (
            <div className="text-blue-500 mb-4">Loading user queries...</div>
          )}
          {queriesError && (
            <div className="text-red-500 mb-4">
              Error loading queries: {queriesError.message}
            </div>
          )}
          {userQueries && (
            <div className="mb-4">
              <h2 className="text-sm font-semibold mb-2">History</h2>
              <ul className="text-sm">
                {userQueries.map((q) => (
                  <li className="mb-2" key={q.id}>
                    <button
                      className="underline"
                      onClick={() => {
                        setQuery(q.query);
                        handleComparisionList(q.query);
                      }}
                    >
                      {q.query}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="bg-gray-100 p-4 rounded w-full">
          {mode.includes("table") && (
            <>
              {fetchWeatherMutation.isPending && (
                <div className="text-blue-500 mb-4">
                  Loading weather data...
                </div>
              )}
              {fetchWeatherMutation.isError && (
                <div className="text-red-500 mb-4">
                  Error: {fetchWeatherMutation.error.message}
                </div>
              )}
              {fetchWeatherMutation.isSuccess && (
                <>
                  <h2 className="text-lg font-semibold mb-2">{query}</h2>
                  {/* <pre className="whitespace-pre-wrap break-words">
            {JSON.stringify(fetchWeatherMutation.data, null, 2)}
          </pre> */}
                  <WeatherTable weatherData={fetchWeatherMutation.data} />
                </>
              )}
            </>
          )}
          {mode.includes("graph") && fetchWeatherMutation.isSuccess && (
            <CompareView compareList={compareList} />
          )}
        </div>
      </div>
    </div>
  );
}
