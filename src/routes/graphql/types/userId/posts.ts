import { Post } from '@prisma/client';
import { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLSchema } from 'graphql';
import { postType } from '../posts.js';
import { UUIDType } from '../uuid.js';

const queryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    getPostsByUserId: {
      type: new GraphQLList(postType),
      args: { 
       userId: { type: new GraphQLNonNull(UUIDType) } 
      },
      resolve: async (_, args: { userId: string }) => {
        return [postType[args.userId]] as [Post];
      }
    }
  }
});

export const schema = new GraphQLSchema({
  query: queryType
});
