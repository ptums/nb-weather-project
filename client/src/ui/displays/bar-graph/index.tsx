import { WeatherData } from "@/utils/types";

const BarGraph = ({
  weatherData,
  query,
}: {
  weatherData: WeatherData[];
  query: string;
}) => {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-2">Comparison Mode</h1>
      <h2 className="text-lg font-semibold mb-2">{query}</h2>
      <pre className="whitespace-pre-wrap break-words">
        {JSON.stringify(weatherData, null, 2)}
      </pre>
    </div>
  );
};

export default BarGraph;
