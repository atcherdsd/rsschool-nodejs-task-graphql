import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLFloat, GraphQLInputObjectType, GraphQLList } from 'graphql';
import { UUIDType } from './uuid.js';
import { profileType } from './profiles.js';
import { getProfileByUserId } from '../resolvers/profileResolver.js';
import { postType } from './posts.js';
import { getFollowers, getSubscriptions } from '../resolvers/userResolvers.js';
import { Context } from '../dataloader/dataLoader.js';

export type UserBody = {
  name: string;
  balance: number;
}
export interface User extends UserBody {
  id: string;
}

export const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: profileType as GraphQLObjectType,
      resolve: async (source: User) => (
        await getProfileByUserId(source.id)
      ),
    },
    posts: {
      type: new GraphQLList(postType),
      resolve: async (source: User, _args, { postsByUserIdLoader }: Context) => (
        await postsByUserIdLoader.load(source.id)
      )
    },
    subscribedToUser: {
      type: new GraphQLList(userType as GraphQLObjectType),
      resolve: async (source: User) => (
        await getFollowers(source.id)
      ),
    },
    userSubscribedTo: {
      type: new GraphQLList(userType as GraphQLObjectType),
      resolve: async (source: User) => (
        await getSubscriptions(source.id)
      ),
    },
  }),
});

export const createUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});
export const changeUserInputType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});
