import { CompareWeatherData } from "@/utils/types";
import {
  createContext,
  useState,
  useContext,
  useCallback,
  ReactNode,
} from "react";
import { findWeatherDataById, searchWeatherQueries } from "@/utils/api";

interface CompareListContextType {
  compareList: CompareWeatherData[];
  addToCompareList: (month: number, year: number) => void;
  removeFromCompareList: (id: string) => void;
  clearCompareList: () => void;
}

const CompareListContext = createContext<CompareListContextType | undefined>(
  undefined
);

export function CompareListProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareList] = useState<CompareWeatherData[]>([]);

  const addToCompareList = useCallback(async (month: number, year: number) => {
    const monthStr = month.toString();
    const yearStr = year.toString();
    const query = `${monthStr}-${yearStr}`;
    console.log("query param >>", query);

    const results = await searchWeatherQueries(query);

    if (results.length > 0) {
      const weatherData = await findWeatherDataById(results[0]?.id);

      const newItem = {
        weatherData,
        month,
        year,
        id: Date.now().toString(),
      };
      setCompareList((prevList) => [...prevList, newItem]);
    }
  }, []);

  const removeFromCompareList = useCallback((id: string) => {
    setCompareList((prevList) => prevList.filter((item) => item.id !== id));
  }, []);

  const clearCompareList = useCallback(() => {
    setCompareList([]);
  }, []);

  const value = {
    compareList,
    addToCompareList,
    removeFromCompareList,
    clearCompareList,
  };

  return (
    <CompareListContext.Provider value={value}>
      {children}
    </CompareListContext.Provider>
  );
}

export function useCompareList() {
  const context = useContext(CompareListContext);
  if (context === undefined) {
    throw new Error("useCompareList must be used within a CompareListProvider");
  }
  return context;
}
