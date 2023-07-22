import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLFloat, GraphQLInputObjectType } from 'graphql';
import { UUIDType } from './uuid.js';

export type UserBody = {
  name: string;
  balance: number;
}

export const userType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

export const userUpdateInputType = new GraphQLInputObjectType({
  name: 'UserUpdate',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});
