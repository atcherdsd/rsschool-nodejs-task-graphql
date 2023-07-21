import { PrismaClient } from '@prisma/client';
import { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLSchema } from 'graphql';
import { UUIDType } from '../uuid.js';
import { userType } from '../users.js';

const prisma = new PrismaClient();

const queryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    getSubscribedToUser: {
      type: new GraphQLList(userType),
      args: { 
       userId: { type: new GraphQLNonNull(UUIDType) } 
      },
      resolve: async (_, args: { userId: string }) => {
        return prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                authorId: args.userId,
              },
            },
          },
        });
      },
    }
  }
});

export const schema = new GraphQLSchema({
  query: queryType
});
