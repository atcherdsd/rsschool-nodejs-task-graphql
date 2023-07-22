import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLInputObjectType } from 'graphql';
import { UUIDType } from './uuid.js';

export interface PostPATCHBody {
  title: string;
  content: string;
}
export interface PostPOSTBody extends PostPATCHBody {
  authorId: string;
}

export const postType = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  }
});

export const postCreateInputType = new GraphQLInputObjectType({
  name: 'PostCreate',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
});
export const postUpdateInputType = new GraphQLInputObjectType({
  name: 'PostUpdate',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  },
});
