import { WeatherData, WeatherQueries } from "@/utils/types";
import classNames from "classnames";
import { useMutation } from "@tanstack/react-query";
import { fetchMonthWeatherData } from "@/utils/api";
import { useWeatherData } from "@/context/weather-data-context";
import { useToggleView } from "@/context/toggle-view-context";
import { RouteButton } from "./RoutePopover";
import { useWeatherDataDB } from "@/hooks/useWeatherDataDB";
import { useCompareList } from "@/context/compare-list-context";
import React from "react";
import { findWeatherDataById } from "@/utils/api2";

interface SidebarProps {
  title: string;
  displayShadow?: boolean;
  items: WeatherQueries[];
}
export const Sidebar = ({
  title,
  items,
  displayShadow = false,
}: SidebarProps) => {
  const { setWeatherData } = useWeatherData();
  const { setDecision } = useToggleView();
  // const { addToCompareList, removeFromCompareList } = useCompareList();
  //   const { setWeatherDataDB } = useWeatherDataDB();

  const mutation = useMutation<WeatherData[], Error, { queryId: number }>({
    mutationFn: ({ queryId }) => findWeatherDataById(queryId),
    onSuccess: (data) => {
      setWeatherData(data as WeatherData[]);
    },
    onError: (error) => {
      console.error("Error fetching weather data:", error);
    },
  });

  const handleVisualize = (queryId: number) => {
    setDecision("history");

    mutation.mutate({ queryId });
  };

  const handleCompare = () => {
    setDecision("compare");
  };

  return (
    <div
      className={classNames("h-screen w-2/12 border-r bg-white", {
        "border-silver": displayShadow,
      })}
    >
      <div className="p-4 relative h-full">
        <h2 className="text-lg uppercase tracking-tight font-semibold text-rose-900 mb-4 uppercase">
          {title}
        </h2>
        <ul className="space-y-4">
          {items &&
            items.map((item, index) => {
              return (
                <React.Fragment key={index}>
                  {title.includes("History") ? (
                    <li className="flex items-center space-x-2 text-sm uppercase tracking-tight font-semibold text-rose-600 cursor-pointer hover:text-rose-900 bg-transparent">
                      <RouteButton
                        onVisualize={() => handleVisualize(item.id)}
                        onCompare={() => handleCompare()}
                        label={item.query}
                      />
                    </li>
                  ) : (
                    <li
                      // onClick={() =>
                      //   removeFromCompareList(item.id.toString() as string)
                      // }
                      className="flex items-center space-x-2 text-sm tracking-tight font-semibold text-rose-600 cursor-pointer hover:text-rose-900"
                    >
                      <span>{item.query}</span>
                    </li>
                  )}
                </React.Fragment>
              );
            })}
        </ul>
      </div>
    </div>
  );
};
