import { CompareWeatherData } from "@/utils/types";

import { BarGraph } from "./bar-graph";
interface CompareView {
  compareList: CompareWeatherData[];
}

export const CompareView = ({ compareList }: CompareView) => {
  return <BarGraph compareList={compareList} />;
};
