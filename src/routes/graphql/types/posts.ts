import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLSchema, GraphQLList, GraphQLInputObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { PrismaClient, Post } from '@prisma/client';
import { FastifyReply } from 'fastify';
import { ResourceNotFoundError } from './NotFoundError.js';

const prisma = new PrismaClient();

interface PATCHBody {
  title: string;
  content: string;
}
interface POSTBody extends PATCHBody {
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

const postCreateInputType = new GraphQLInputObjectType({
  name: 'PostCreate',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
});
const postUpdateInputType = new GraphQLInputObjectType({
  name: 'PostUpdate',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  },
});

const queryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    getPost: {
      type: postType,
      args: {
        postId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, args: { postId: string }) => {
        const post = await postType[args.postId] as Post;
        if (post === null) {
          throw new ResourceNotFoundError();
        }
        return post;
      },
    },
    getPosts: {
      type: new GraphQLList(postType),
      resolve: async () => {
        return [postType] as unknown as [Post];
      }
    }
  }
});
const mutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createPost: {
      type: postType,
      args: {
        postBody: { type: postCreateInputType },
      },
      resolve: async (_, args: { body: POSTBody }) => {
        return prisma.post.create({
          data: args.body
        });
      }
    },
    updatePost: {
      type: postType,
      args: {
        postBody: { type: postUpdateInputType },
        postId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, args: { postId: string, postBody: PATCHBody }) => {
        return prisma.post.update({
          where: {
            id: args.postId
          },
          data: args.postBody
        });
      }
    },
    deletePost: {
      type: UUIDType,
      args: {
        postId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, args: {postId: string }, reply: FastifyReply) => {
        void reply.code(204);
        await prisma.post.delete({
          where: {
            id: args.postId
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
