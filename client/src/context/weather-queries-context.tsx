import { defaultMonth, defaultYear } from "@/utils";
import { WeatherQueries } from "@/utils/types";
import React, { createContext, useState, useContext, ReactNode } from "react";

type WeatherQueriesContextType = {
  query: string;
  setQuery: (month: string) => void;
  queryId: number | null;
  setQueryId: (queryId: number) => void;
  isSubmitted: boolean;
  setIsSubmitted: (submitted: boolean) => void;
  setQueryList: (queryList: WeatherQueries[]) => void;
  queryList: WeatherQueries[];
};

const WeatherQueriesContext = createContext<
  WeatherQueriesContextType | undefined
>(undefined);

interface WeatherQueriesProviderProps {
  children: ReactNode;
}

export const WeatherQueriesProvider: React.FC<WeatherQueriesProviderProps> = ({
  children,
}) => {
  const [query, setQuery] = useState<string>(
    `${defaultMonth} - ${defaultYear}`
  );
  const [queryId, setQueryId] = useState<number | null>(null);
  const [queryList, setQueryList] = useState<string[]>([]);

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  return (
    <WeatherQueriesContext.Provider
      value={{
        query,
        setQuery,
        queryId,
        setQueryId,
        isSubmitted,
        setIsSubmitted,
        queryList,
        setQueryList,
      }}
    >
      {children}
    </WeatherQueriesContext.Provider>
  );
};

export const useWeatherQueries = () => {
  const context = useContext(WeatherQueriesContext);
  if (context === undefined) {
    throw new Error(
      "useWeatherQueries must be used within a WeatherQueriesProvider"
    );
  }
  return context;
};
