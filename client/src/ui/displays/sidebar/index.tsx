import { CompareWeatherData, WeatherQueries } from "@/utils/types";
import classNames from "classnames";

import { RouteButton } from "./RoutePopover";
import React, { useCallback } from "react";
import { searchWeatherQueries, findWeatherDataById } from "@/utils/api";
import { convertToMonthsYears } from "@/utils";

interface SidebarProps {
  title: string;
  displayShadow?: boolean;
  items: WeatherQueries[] | CompareWeatherData[];
  setQuery: (query: string) => void;
  setToggleView: (toggleView: boolean) => void;
  setCompareList: (compareList: CompareWeatherData[]) => void;
}

export const Sidebar = ({
  title,
  items,
  displayShadow = false,
  setQuery,
  setToggleView,
  setCompareList,
}: SidebarProps) => {
  const addToCompareList = useCallback(
    async (query: string) => {
      const month = convertToMonthsYears(query, 0);
      const year = convertToMonthsYears(query, 1);
      console.log("query param >>", query);

      const results = await searchWeatherQueries(query);

      if (results.length > 0) {
        const weatherData = await findWeatherDataById(results[0]?.id);

        const newItem = {
          weatherData,
          month,
          year,
          id: Date.now().toString(),
          query,
        };

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        setCompareList((prevList) => [...prevList, newItem]);
      }
    },
    [setCompareList]
  );

  // const clearCompareList = useCallback(() => {
  //   setCompareList([]);
  // }, [setCompareList]);

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
            items
              .sort((a, b) => (a?.id < b?.id ? 1 : -1))
              .map((item, index) => {
                return (
                  <React.Fragment key={index}>
                    {title.includes("History") ? (
                      <li className="flex items-center space-x-2 text-sm uppercase tracking-tight font-semibold text-rose-600 cursor-pointer hover:text-rose-900 bg-transparent">
                        <RouteButton
                          onVisualize={() => {
                            setQuery(item.query);
                            setToggleView(true);
                          }}
                          onCompare={() => {
                            console.log("item.query", item.query);
                            addToCompareList(item.query);
                            setToggleView(false);
                          }}
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
