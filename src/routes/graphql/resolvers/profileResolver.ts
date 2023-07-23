import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getProfileByUserId = async (id: string) => {
  const profile = await prisma.profile.findUnique({
    where: {
      userId: id,
    },
  });
  return profile;
};
