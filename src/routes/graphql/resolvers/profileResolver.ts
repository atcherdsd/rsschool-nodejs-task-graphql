import { PrismaClient } from '@prisma/client';
import { MemberTypeId } from '../../member-types/schemas.js';
const prisma = new PrismaClient();

export const getProfileByUserId = async (id: string) => {
  const profile = await prisma.profile.findUnique({
    where: {
      userId: id,
    },
  });
  return profile;
};

export const getProfilesByMemberTypeId = async (id: MemberTypeId) => {
  const profiles = await prisma.profile.findMany({
    where: {
      memberTypeId: id
    }
  })
  return profiles;
};
