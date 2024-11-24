import { PrismaClient } from "@prisma/client";
import { WeatherQueries } from "../types";

const prisma = new PrismaClient();

export const WeatherQueriesRepository = {
  findByQueryAndUserId: async (
    query: string,
    userId: string
  ): Promise<WeatherQueries | null> => {
    return prisma.weatherQueries.findFirst({
      where: {
        query,
        userId,
      },
    });
  },

  save: async (query: string, userId: string): Promise<WeatherQueries> => {
    return prisma.weatherQueries.create({
      data: {
        query,
        userId,
      },
    });
  },

  findById: async (id: number): Promise<WeatherQueries | null> => {
    return prisma.weatherQueries.findUnique({
      where: { id },
    });
  },

  findAll: async (): Promise<WeatherQueries[]> => {
    return prisma.weatherQueries.findMany();
  },

  findAllByUserId: async (userId: string): Promise<WeatherQueries[]> => {
    return prisma.weatherQueries.findMany({
      where: { userId },
    });
  },

  existsById: async (id: number): Promise<boolean> => {
    const count = await prisma.weatherQueries.count({
      where: { id },
    });
    return count > 0;
  },

  deleteById: async (id: number): Promise<void> => {
    await prisma.weatherQueries.delete({
      where: { id },
    });
  },

  findByQueryContainingIgnoreCase: async (
    query: string
  ): Promise<WeatherQueries[]> => {
    return prisma.weatherQueries.findMany({
      where: {
        query: {
          contains: query,
          lte: "insensitive",
        },
      },
    });
  },
};
