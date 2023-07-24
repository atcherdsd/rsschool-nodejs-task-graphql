import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ID {
  id: string;
}

const getMemberType = async (args: ID) => {
  const memberType = await prisma.memberType.findUnique({
    where: {
      id: args.id,
    },
  });
  return memberType;
};

export default { memberType: getMemberType };
