import { WeatherDataRepository } from "../../../repository";
import { WeatherData, OpenMeteoData } from "../../../types";
import { fetchWeatherData, mapOpenMeteoToWeatherData } from "../../../utils";

const weatherDataRepository = WeatherDataRepository;

export async function createWeatherData(
  query: string,
  queryId: number
): Promise<WeatherData[]> {
  const [month, year] = query.split("-").map(Number);

  try {
    const weatherDataList = await weatherDataRepository.findByQueryId(queryId);

    if (weatherDataList.length === 0) {
      try {
        console.log("4. Create new weather data");
        const openMeteoData: OpenMeteoData = await fetchWeatherData(
          month,
          year
        );

        const openMeteoToWeatherData = mapOpenMeteoToWeatherData(
          openMeteoData,
          queryId
        );

        console.log(
          `Mapped ${openMeteoToWeatherData.length} weather data entries`
        );

        const savedWeatherData = await weatherDataRepository.saveAll(
          openMeteoToWeatherData
        );

        console.log(
          `Successfully saved ${savedWeatherData.length} weather data entries`
        );
        return savedWeatherData;
      } catch (e) {
        console.error("Error while fetching or saving weather data", e);
        throw new Error("Failed to fetch or save weather data");
      }
    } else {
      return weatherDataList;
    }
  } catch (e) {
    console.error("Error creating weather data entry:", e);
    throw new Error("Failed to create weather data entry");
  }
}
