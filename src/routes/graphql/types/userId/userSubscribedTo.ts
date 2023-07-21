import { PrismaClient } from '@prisma/client';
import { GraphQLObjectType, GraphQLInputObjectType, GraphQLNonNull, GraphQLList, GraphQLSchema } from 'graphql';
import { UUIDType } from '../uuid.js';
import { userType } from '../users.js';
import { FastifyReply } from 'fastify';

const prisma = new PrismaClient();

type ToSubscribeBody = {
  authorId: string;
};

const toSubscribeCreateInputType = new GraphQLInputObjectType({
  name: 'ToSubscribeCreate',
  fields: {
    authorId: { type: new GraphQLNonNull(UUIDType) }
  },
});

const queryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    getUserSubscribedTo: {
      type: new GraphQLList(userType),
      args: { 
       userId: { type: new GraphQLNonNull(UUIDType) } 
      },
      resolve: async (_, args: { userId: string }) => {
        return prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                subscriberId: args.userId,
              },
            },
          },
        });
      },
    }
  }
});
const mutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createUserToSubscribe: {
      type: userType,
      args: {
        toSubscribeBody: { type: toSubscribeCreateInputType },
        userId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, args: { body: ToSubscribeBody, id: string }) => {
        return prisma.user.update({
          where: {
            id: args.id,
          },
          data: {
            userSubscribedTo: {
              create: {
                authorId: args.body.authorId,
              }
            }
          }
        })
      }
    },
    deleteUser: {
      type: UUIDType,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, args: {userId: string, authorId: string }, reply: FastifyReply) => {
        void reply.code(204);
        await prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: args.userId,
              authorId: args.authorId,
            }
          }
        });
      }
    }
  }
});

export const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});
