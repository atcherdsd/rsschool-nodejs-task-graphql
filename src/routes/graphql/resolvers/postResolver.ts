import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPostsByUserId = async (id: string) => {
  const posts = await prisma.post.findMany({
    where: {
      authorId: id
    }
  })
  return posts;
};
