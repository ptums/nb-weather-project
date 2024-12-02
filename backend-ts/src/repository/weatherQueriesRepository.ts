import { PrismaClient, WeatherQueries, User } from "@prisma/client";

const prisma = new PrismaClient();

export const WeatherQueriesRepository = {
  create: async (
    weatherQueryData: Omit<WeatherQueries, "id">
  ): Promise<WeatherQueries> => {
    return prisma.weatherQueries.create({
      data: weatherQueryData,
      include: { weatherData: true, users: true },
    });
  },

  findById: async (id: number): Promise<WeatherQueries | null> => {
    return prisma.weatherQueries.findUnique({
      where: { id },
      include: { weatherData: true, users: true },
    });
  },

  findByUserId: async (userId: string): Promise<WeatherQueries[]> => {
    return prisma.weatherQueries.findMany({
      where: {
        users: {
          some: {
            uniqueId: userId,
          },
        },
      },
      include: { weatherData: true, users: true },
    });
  },

  update: async (
    id: number,
    weatherQueryData: Partial<Omit<WeatherQueries, "id">>
  ): Promise<WeatherQueries> => {
    return prisma.weatherQueries.update({
      where: { id },
      data: weatherQueryData,
      include: { weatherData: true, users: true },
    });
  },

  deleteById: async (id: number): Promise<void> => {
    await prisma.weatherQueries.delete({
      where: { id },
    });
  },

  findAll: async (): Promise<WeatherQueries[]> => {
    return prisma.weatherQueries.findMany({
      include: { weatherData: true, users: true },
    });
  },

  addUserToQuery: async (
    queryId: number,
    userId: number
  ): Promise<WeatherQueries> => {
    return prisma.weatherQueries.update({
      where: { id: queryId },
      data: {
        users: {
          connect: { id: userId },
        },
      },
      include: { weatherData: true, users: true },
    });
  },

  removeUserFromQuery: async (
    queryId: number,
    userId: number
  ): Promise<WeatherQueries> => {
    return prisma.weatherQueries.update({
      where: { id: queryId },
      data: {
        users: {
          disconnect: { id: userId },
        },
      },
      include: { weatherData: true, users: true },
    });
  },

  findByQuery: async (query: string): Promise<WeatherQueries | null> => {
    return prisma.weatherQueries.findFirst({
      where: {
        query: {
          contains: query,
          // mode: "insensitive",
        },
      },
      include: { weatherData: true, users: true },
    });
  },

  existsById: async (id: number): Promise<boolean> => {
    const count = await prisma.weatherQueries.count({
      where: { id },
    });
    return count > 0;
  },

  existsUser: async (queryId: number, userId: string): Promise<boolean> => {
    const count = await prisma.weatherQueries.count({
      where: {
        id: queryId,
        users: {
          some: {
            uniqueId: userId,
          },
        },
      },
    });

    return count > 0;
  },
};
