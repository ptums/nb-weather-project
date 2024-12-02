// import { SiteTitle, DateForm, WeatherTable, CompareView } from "./ui";
// import { useQueries, useQuery } from "@tanstack/react-query";
// import {
//   searchWeatherQueries,
//   findWeatherQueriesByUserId,
//   createWeatherData,
//   createWeatherQueries,
//   deleteWeatherQueries,
// } from "./utils/api";
// import { WeatherQueries, WeatherData, CompareWeatherData } from "./utils/types";
// import { useCallback, useEffect, useId, useState } from "react";
// import { defaultMonth, defaultYear } from "./utils";

// const defaultQuery = `${defaultMonth}-${defaultYear}`;

// const NBWeatherApp = () => {
//   const [toggleView, setToggleView] = useState<boolean>(true);
//   const [query, setQuery] = useState<string>(defaultQuery);
//   const [userId, setUserId] = useState<string | null>(null);
//   const [compareList, setCompareList] = useState<CompareWeatherData[]>([]);
//   const randomId = useId();

//   useEffect(() => {
//     const storedUserId = localStorage.getItem("user_id");

//     if (!storedUserId) {
//       localStorage.setItem("user_id", randomId);
//       console.log("New user_id set in localStorage:", randomId);
//     } else {
//       console.log("Existing user_id found in localStorage:", storedUserId);
//       setUserId(storedUserId);
//     }
//   }, [randomId]);

//   const { data: weatherQueryByUser, refetch } = useQuery({
//     queryKey: ["weatherQueryByUser", userId],
//     queryFn: () => findWeatherQueriesByUserId(userId as string),
//     enabled: !!userId,
//   });

//   const queries = useQueries({
//     queries: [
//       {
//         queryKey: ["weatherQuery", query],
//         queryFn: () => searchWeatherQueries(query),
//         enabled: !!query,
//       },
//       {
//         queryKey: ["weatherData", query],
//         queryFn: async (context) => {
//           refetch();

//           const [, currentQuery] = context.queryKey;
//           const weatherQueries = await searchWeatherQueries(
//             currentQuery as string
//           );

//           if (!weatherQueries || weatherQueries.length === 0) {
//             const createWeatherQuery = await createWeatherQueries(
//               currentQuery as string,
//               userId as string
//             );

//             return createWeatherData(query, createWeatherQuery[0].id);
//           }

//           return createWeatherData(query, weatherQueries[0].id);
//         },
//       },
//     ],
//   });

//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const [_, weatherDataResult] = queries;

//   // Use the results
//   const weatherData = weatherDataResult.data;

//   const clearCompareList = useCallback(() => {
//     setCompareList([]);
//   }, [setCompareList]);

//   const clearHistoryList = useCallback(() => {
//     (weatherQueryByUser as WeatherQueries[]).forEach(async (data) => {
//       await deleteWeatherQueries(data?.id);
//     });
//   }, [weatherQueryByUser]);

//   return (
//     <main className="flex">
//       <div className="flex flex-col w-full py-8 px-4 bg-rose-100">
//         <SiteTitle />
//         <DateForm setQuery={setQuery} setToggleView={setToggleView} />
//         {weatherData && (
//           <div className="min-h-screen w-full sm:w-3/4">
//             {toggleView ? (
//               <WeatherTable
//                 weatherData={weatherData as WeatherData[]}
//                 query={query}
//               />
//             ) : (
//               <CompareView compareList={compareList} />
//             )}
//           </div>
//         )}
//       </div>
//     </main>
//   );
// };

// export default NBWeatherApp;
