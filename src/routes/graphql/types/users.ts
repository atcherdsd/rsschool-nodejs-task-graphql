import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLSchema } from 'graphql';
import { UUIDType } from './uuid.js';
import { User } from '@prisma/client';

const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: GraphQLString },
    balance: { type: GraphQLInt },
  }),
});

const queryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    user: {
      type: userType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: (_, args: { id: string }) => {
        return userType[args.id] as User;
      }
    }
  }
});

export const schema = new GraphQLSchema({
  query: queryType
});
