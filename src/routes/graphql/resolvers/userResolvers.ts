import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSubscriptions = async (id: string) => {
  const subscriptions = await prisma.user.findMany({
    where: {
      subscribedToUser: {
        some: {
          subscriberId: id,
        },
      },
    },
  });
  return subscriptions;
};

export const getFollowers = async (id: string) => {
  const followers = await prisma.user.findMany({
    where: {
      userSubscribedTo: {
        some: {
          authorId: id,
        },
      },
    },
  });
  return followers;
};
