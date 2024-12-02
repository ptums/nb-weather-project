import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export const UserRepository = {
  create: async (userData: Omit<User, "id">): Promise<User> => {
    return prisma.user.create({
      data: userData,
    });
  },

  findById: async (id: number): Promise<User | null> => {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  findByUniqueId: async (uniqueId: string): Promise<User | null> => {
    const results = await prisma.user.findFirst({
      where: {
        uniqueId,
      },
    });

    return results;
  },

  deleteById: async (id: number): Promise<void> => {
    await prisma.user.delete({
      where: { id },
    });
  },

  // Additional utility functions

  findAll: async (): Promise<User[]> => {
    return prisma.user.findMany();
  },

  update: async (
    id: number,
    userData: Partial<Omit<User, "id">>
  ): Promise<User> => {
    return prisma.user.update({
      where: { id },
      data: userData,
    });
  },

  existsById: async (id: number): Promise<boolean> => {
    const count = await prisma.user.count({
      where: { id },
    });
    return count > 0;
  },
};
