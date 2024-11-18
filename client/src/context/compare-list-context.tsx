import { CompareWeatherData } from "@/utils/types";
import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  ReactNode,
} from "react";
import { fetchMonthWeatherData } from "@/utils/api";

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
    const weatherData = await fetchMonthWeatherData(month, year);
    console.log({
      weatherData,
    });
    const newItem = { weatherData, month, year, id: Date.now().toString() };
    setCompareList((prevList) => [...prevList, newItem]);
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
