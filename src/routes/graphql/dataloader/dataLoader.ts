import { MemberType, Post, PrismaClient } from "@prisma/client";
import DataLoader from "dataloader";
import { MemberTypeId } from "../../member-types/schemas.js";

export type Context = {
  prisma: PrismaClient,
  postsByUserIdLoader: DataLoader<string, Post[]>,
  memberTypesLoader: DataLoader<MemberTypeId, MemberType>,
}

export const createLoaders = (prisma: PrismaClient) => {

  const batchGetPostsByUserId = async (ids: readonly string[]) => {
    const posts = await prisma.post.findMany({
      where: {
        authorId: {
          in: ids as string[]
        }
      }
    });
    return ids.map(
      (id: string) => posts.filter(post => id === post.authorId)
    );
  };

  const batchGetMemberTypes = async (ids: readonly MemberTypeId[]) => {
    const memberTypes = await prisma.memberType.findMany({
      where: {
        id: {
          in: ids as MemberTypeId[]
        }
      }
    });
    return ids.map(
      id => memberTypes.find(memberType => id === memberType.id)
    );
  }

  const postsByUserIdLoader = new DataLoader(batchGetPostsByUserId);
  const memberTypesLoader = new DataLoader(batchGetMemberTypes);
  return { postsByUserIdLoader, memberTypesLoader }
}
