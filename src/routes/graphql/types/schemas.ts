import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { UserBody, userType, createUserInputType, changeUserInputType } from './users.js';
import { UUIDType } from './uuid.js';
import { PrismaClient } from '@prisma/client';
import { FastifyReply } from 'fastify';
import { IDEnum, memberType } from './member.js';
import { PostPATCHBody, PostPOSTBody, changePostInputType, createPostInputType, postType } from './posts.js';
import { ProfilePATCHBody, ProfilePOSTBody, profileCreateInputType, profileType, profileUpdateInputType } from './profiles.js';

const prisma = new PrismaClient();

const queryType = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    user: {
      type: userType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, args: { id: string }) => {
        const user = await prisma.user.findUnique({
          where: {
            id: args.id,
          },
        });
        return user;
      },
    },
    users: {
      type: new GraphQLList(userType),
      resolve: async () => {
        const users = await prisma.user.findMany();
        return users;
      }
    },
    memberType: {
      type: memberType,
      args: { 
        id: { type: new GraphQLNonNull(IDEnum) } 
      },
    },
    memberTypes: {
      type: new GraphQLList(memberType),
      resolve: async () => {
        const memberTypes = await prisma.memberType.findMany();
        return memberTypes;
      }
    },
    post: {
      type: postType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, args: { id: string }) => {
        const post = await prisma.post.findUnique({
          where: {
            id: args.id,
          }
        });
        return post;
      },
    },
    posts: {
      type: new GraphQLList(postType),
      resolve: async () => {
        const posts = await prisma.post.findMany();
        return posts;
      }
    },
    profile: {
      type: profileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, args: { id: string }) => {
        const profile = await prisma.profile.findUnique({
          where: {
            id: args.id,
          },
        });
        return profile;
      },
    },
    profiles: {
      type: new GraphQLList(profileType),
      resolve: async () => {
        const profiles = await prisma.profile.findMany();
        return profiles;
      }
    },
  })
});
const mutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    createUser: {
      type: userType,
      args: {
        dto: { type: createUserInputType },
      },
      resolve: async (_, args: { dto: UserBody }) => {
        const user = await prisma.user.create({
          data: args.dto
        });
        return user;
      }
    },
    changeUser: {
      type: userType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: changeUserInputType },
      },
      resolve: async (_, args: { id: string, dto: UserBody }) => {
        try {
          const user = await prisma.user.update({
            where: {
              id: args.id
            },
            data: args.dto
          });
          return user;
        } catch {
          return null;
        }
      }
    },
    deleteUser: {
      type: UUIDType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, args: {id: string }, reply: FastifyReply) => {
        try {
          void reply.code(204);
          await prisma.user.delete({
            where: {
              id: args.id
            }
          });
        } catch {
          return null;
        }
      }
    },
    createPost: {
      type: postType,
      args: {
        dto: { type: createPostInputType },
      },
      resolve: async (_, args: { dto: PostPOSTBody }) => {
        const post = await prisma.post.create({
          data: args.dto
        });
        return post;
      }
    },
    changePost: {
      type: postType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: changePostInputType },
      },
      resolve: async (_, args: { id: string, dto: PostPATCHBody }) => {
        try {
          const post = await prisma.post.update({
            where: {
              id: args.id
            },
            data: args.dto
          });
          return post;
        } catch {
          return null;
        }
      }
    },
    deletePost: {
      type: UUIDType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, args: {id: string }, reply: FastifyReply) => {
        try {
          void reply.code(204);
          await prisma.post.delete({
            where: {
              id: args.id
            }
          });
        } catch {
          return null;
        }
      }
    },
    createProfile: {
      type: profileType,
      args: {
        dto: { type: profileCreateInputType },
      },
      resolve: async (_, args: { dto: ProfilePOSTBody }) => {
        try {
          const profile = await prisma.profile.create({
            data: args.dto
          });
          return profile;
        } catch {
          return null;
        }
      }
    },
    changeProfile: {
      type: profileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: profileUpdateInputType },
      },
      resolve: async (_, args: { id: string, dto: ProfilePATCHBody }) => {
        try {
          const profile = await prisma.profile.update({
            where: {
              id: args.id
            },
            data: args.dto
          });
          return profile;
        } catch {
          return null;
        }
      }
    },
    deleteProfile: {
      type: UUIDType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, args: {id: string }, reply: FastifyReply) => {
        try {
          void reply.code(204);
          await prisma.profile.delete({
            where: {
              id: args.id
            }
          });
        } catch {
          return null;
        }
      }
    },
    subscribeTo: {
      type: userType,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) }
      },
      resolve: async (_, args: { userId: string, authorId: string }) => {
        try {
          const user = await prisma.user.update({
            where: {
              id: args.userId,
            },
            data: {
              userSubscribedTo: {
                create: {
                  authorId: args.authorId,
                }
              }
            }
          });
          return user;
        } catch {
          return null;
        }
      }
    },
    unsubscribeFrom: {
      type: UUIDType,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, args: {userId: string, authorId: string }, reply: FastifyReply) => {
        try {
          void reply.code(204);
          await prisma.subscribersOnAuthors.delete({
            where: {
              subscriberId_authorId: {
                subscriberId: args.userId,
                authorId: args.authorId,
              }
            }
          });
        } catch {
          return null;
        }
      }
    },
  })
});

export const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
