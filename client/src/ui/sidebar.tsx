import { CompareWeatherData, WeatherQueries } from "@/utils/types";

interface SidebarProps {
  weatherQueries: WeatherQueries[];
  compareWeather: CompareWeatherData[];
  setQuery: (query: string) => void;
  clearQueries: () => void;
  clearCompare: () => void;
  comparisonMode: boolean;
  compareList: CompareWeatherData[];
  addToCompareList: (query: string) => void;
  removeFromCompareList: (id: string) => void;
}

export const Sidebar = ({
  weatherQueries,
  compareList,
  setQuery,
  clearQueries,
  clearCompare,
  comparisonMode,
  addToCompareList,
  removeFromCompareList,
}: SidebarProps) => {
  return (
    <div className="h-screen w-2/12 border-r bg-white border-silver">
      <div className="p-4 relative h-full">
        <h2>
          <button
            onClick={() => clearQueries()}
            className="text-lg tracking-tight font-semibold text-rose-900 mb-4"
          >
            History
          </button>
        </h2>
        <ul className="space-y-4">
          {weatherQueries &&
            weatherQueries
              .sort((a, b) => (a?.id < b?.id ? 1 : -1))
              .map((item, index) => {
                return (
                  <li
                    key={index}
                    onClick={() => {
                      if (comparisonMode) {
                        addToCompareList(item.query);
                      } else {
                        setQuery(item.query);
                      }
                    }}
                    className="flex items-center space-x-2 text-sm tracking-tight font-semibold text-rose-600 cursor-pointer hover:text-rose-900"
                  >
                    <span>{item.query}</span>
                  </li>
                );
              })}
        </ul>
        {comparisonMode && (
          <div className="mt-4">
            <h2>
              <button
                onClick={() => clearCompare()}
                className="text-lg tracking-tight font-semibold text-rose-900 mb-4"
              >
                Compare
              </button>
            </h2>
            <ul className="space-y-4">
              {compareList &&
                compareList
                  .sort((a, b) => (a?.id < b?.id ? 1 : -1))
                  .map((item, index) => {
                    return (
                      <li
                        key={index}
                        onClick={() => removeFromCompareList(item.id)}
                        className="flex items-center space-x-2 text-sm tracking-tight font-semibold text-rose-600 cursor-pointer hover:text-rose-900"
                      >
                        <span>{item.query}</span>
                      </li>
                    );
                  })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
