"use client";

import { useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { MonthPicker } from "./month-picker";
import { YearInput } from "./year-input";
import { useWeatherQueries } from "@/context/weather-queries-context";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { defaultMonth, defaultYear } from "@/utils";
import { useWeatherData } from "@/context/weather-data-context";
import { WeatherData, WeatherQueries } from "@/utils/types";

// import { useCompareList } from "@/context/compare-list-context";
import { useToggleView } from "@/context/toggle-view-context";
import { createWeatherData, createWeatherQueries } from "@/utils/api2";

const schema = yup.object().shape({
  month: yup
    .mixed()
    .test(
      "is-valid-month",
      'Month must be a number from 1 to 12 or a two-digit string from "01" to "12"',
      (value) => {
        if (typeof value === "string") {
          return /^(0[1-9]|1[0-2])$/.test(value);
        }
        if (typeof value === "number") {
          return value >= 1 && value <= 12;
        }
        return false;
      }
    )
    .required("Month is required"),
  year: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required("Year is required")
    .min(1850, "Year must be 1850 or later")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
});

type FormData = yup.InferType<typeof schema>;

export function DateForm() {
  const randomId = useId();
  const [userId, setUserId] = useState<string>(randomId);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const { query, setQuery, setQueryId, isSubmitted } = useWeatherQueries();
  const { setWeatherData } = useWeatherData();
  const { setDecision } = useToggleView();

  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      month: defaultMonth,
      year: defaultYear,
    },
  });

  const weatherDataMutation = useMutation<
    WeatherData[],
    Error,
    { query: string; queryId: number }
  >({
    mutationFn: ({ query, queryId }) => createWeatherData(query, queryId),
    onSuccess: (data) => {
      setWeatherData(data as WeatherData[]);
      // You can do something with the data here, like updating state or context
    },
    onError: (error) => {
      console.error("Error fetching weather data:", error);
      // You can handle the error here, like showing an error message
    },
  });

  const weatherQueriesMutation = useMutation<
    WeatherQueries,
    Error,
    { query: string }
  >({
    mutationFn: ({ query }) => createWeatherQueries(query, userId),
    onSuccess: (data) => {
      setQueryId(data?.id);
      weatherDataMutation.mutate({
        query,
        queryId: data?.id,
      });
    },
    onError: (error) => {
      console.error("Error fetching weather data:", error);
    },
  });

  const onSubmit = (data: FormData) => {
    const dateQuery = `${data.month as string}-${
      data.year.toString() as string
    }`;
    setQuery(dateQuery);

    if (data.month && data.year) {
      weatherQueriesMutation.mutate({ query: dateQuery });
    }
  };

  const handleCompare = () => {
    // addToCompareList(parseInt(month), parseIyear);
    setDecision("compare");
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");

    if (!storedUserId) {
      localStorage.setItem("user_id", userId);
      console.log("New user_id set in localStorage:", userId);
    } else {
      console.log("Existing user_id found in localStorage:", storedUserId);
      setUserId(storedUserId);
    }
  }, [userId]);

  return (
    <div className="w-full sm:w-3/4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col sm:flex-row items-center gap-4"
      >
        <div className="w-full sm:w-44">
          <MonthPicker
            value={month || defaultMonth}
            onChange={(value) => {
              setMonth(value);
              setValue("month", value, { shouldValidate: true });
            }}
          />
          {errors.month && (
            <p className="text-red-500 text-sm mt-1">{errors.month.message}</p>
          )}
        </div>
        <div className="w-full sm:w-32">
          <YearInput
            value={parseInt(year) || defaultYear}
            onChange={(value) => {
              setYear(value.toString());
              setValue("year", value, { shouldValidate: true });
            }}
            min={1850}
            max={new Date().getFullYear()}
          />
          {errors.year && (
            <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>
          )}
        </div>
        <Button type="button" onClick={handleCompare} variant="compare">
          Compare
        </Button>
        <Button type="submit" disabled={isSubmitted} variant="go">
          Go
        </Button>
      </form>
    </div>
  );
}
