import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLFloat, GraphQLSchema, GraphQLList, GraphQLInputObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { User, PrismaClient } from '@prisma/client';
import { FastifyReply } from 'fastify';
import { ResourceNotFoundError } from './NotFoundError.js';

const prisma = new PrismaClient();

type UserBody = {
  name: string;
  balance: number;
}

const userType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

const userUpdateInputType = new GraphQLInputObjectType({
  name: 'UserUpdate',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});

const queryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    getUser: {
      type: userType,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, args: { userId: string }) => {
        const user = await userType[args.userId] as User;
        if (user === null) {
          throw new ResourceNotFoundError();
        }
        return user;
      },
    },
    getUsers: {
      type: new GraphQLList(userType),
      resolve: async () => {
        return [userType] as unknown as [User];
      }
    }
  }
});
const mutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createUser: {
      type: userType,
      args: {             // first option - without additional type
        name: { type: new GraphQLNonNull(GraphQLString) },
        balance: { type: new GraphQLNonNull(GraphQLFloat) },
      },
      resolve: async (_, args: { body: UserBody }) => {
        return prisma.user.create({
          data: args.body
        });
      }
    },
    updateUser: {
      type: userType,
      args: {             // second option - with additional input type
        userBody: { type: userUpdateInputType },
        userId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, args: { userId: string, userBody: UserBody }) => {
        return prisma.user.update({
          where: {
            id: args.userId
          },
          data: args.userBody
        });
      }
    },
    deleteUser: {
      type: UUIDType,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, args: {userId: string }, reply: FastifyReply) => {
        void reply.code(204);
        await prisma.user.delete({
          where: {
            id: args.userId
          }
        });
      }
    }
  }
});

export const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
