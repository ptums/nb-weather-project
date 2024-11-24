import { PrismaClient } from "@prisma/client";
import { WeatherData } from "../types";

const prisma = new PrismaClient();

export const WeatherDataRepository = {
  findByQueryId: async (queryId: number): Promise<WeatherData[]> => {
    return prisma.weatherData.findMany({
      where: { queryId },
    });
  },

  saveAll: async (
    weatherDataList: Omit<WeatherData, "id">[]
  ): Promise<WeatherData[]> => {
    return prisma.$transaction(
      weatherDataList.map((data) =>
        prisma.weatherData.create({
          data,
        })
      )
    );
  },

  findAll: async (): Promise<WeatherData[]> => {
    return prisma.weatherData.findMany();
  },

  findById: async (id: number): Promise<WeatherData | null> => {
    return prisma.weatherData.findUnique({
      where: { id },
    });
  },

  save: async (weatherData: Omit<WeatherData, "id">): Promise<WeatherData> => {
    return prisma.weatherData.create({
      data: weatherData,
    });
  },

  existsById: async (id: number): Promise<boolean> => {
    const count = await prisma.weatherData.count({
      where: { id },
    });
    return count > 0;
  },

  deleteById: async (id: number): Promise<void> => {
    await prisma.weatherData.delete({
      where: { id },
    });
  },
};
