"use client";

import { useState, useCallback, useEffect } from "react";
import { localDate } from "@/utils";

const LOCAL_STORAGE_KEY = "currentDate";

export function useCurrentDateDB() {
  const [localDateDB, setLocalDateDB] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCurrentDate = useCallback(() => {
    try {
      setIsLoading(true);
      const storedDate = localStorage.getItem(LOCAL_STORAGE_KEY);

      if (storedDate) {
        setLocalDateDB(storedDate);
      } else {
        localStorage.setItem(LOCAL_STORAGE_KEY, localDate);
        setLocalDateDB(localDate);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred")
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateCurrentDate = useCallback(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, localDate);
      setLocalDateDB(localDate);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred")
      );
    }
  }, []);

  useEffect(() => {
    fetchCurrentDate();
  }, [fetchCurrentDate]);

  return {
    localDateDB,
    isLoading,
    error,
    updateCurrentDate,
    refreshCurrentDate: fetchCurrentDate,
  };
}
