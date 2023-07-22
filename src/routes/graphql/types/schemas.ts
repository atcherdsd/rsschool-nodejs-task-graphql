import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { UserBody, userType, createUserInputType, changeUserInputType } from './users.js';
import { UUIDType } from './uuid.js';
import { PrismaClient } from '@prisma/client';
import { ResourceNotFoundError } from './NotFoundError.js';
import { FastifyReply } from 'fastify';
import { IDEnum, memberType } from './member.js';
import { PostPATCHBody, PostPOSTBody, changePostInputType, createPostInputType, postType } from './posts.js';
import { ProfilePATCHBody, ProfilePOSTBody, profileCreateInputType, profileType, profileUpdateInputType } from './profiles.js';
import { ToSubscribeBody, toSubscribeCreateInputType } from './userId/userSubscribedTo.js';

const prisma = new PrismaClient();

const queryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    user: {
      type: userType,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, args: { userId: string }) => {
        const user = await prisma.user.findUnique({
          where: {
            id: args.userId,
          },
        });
        if (user === null) {
          throw new ResourceNotFoundError();
        }
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
        memberTypeId: { type: new GraphQLNonNull(IDEnum) } 
      },
      resolve: async (_, args: {memberTypeId: string}) => {
        const memberType = await prisma.memberType.findUnique({
          where: {
            id: args.memberTypeId,
          },
        });
        if (memberType === null){
          throw new ResourceNotFoundError();
        }
        return memberType;
      }
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
        postId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, args: { postId: string }) => {
        const post = await prisma.post.findUnique({
          where: {
            id: args.postId,
          }
        });
        if (post === null) {
          throw new ResourceNotFoundError();
        }
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
        profileId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, args: { profileId: string }) => {
        const profile = await prisma.profile.findUnique({
          where: {
            id: args.profileId,
          },
        });
        if (profile === null) {
          throw new ResourceNotFoundError();
        }
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
    getPostsByUserId: {
      type: new GraphQLList(postType),
      args: { 
       userId: { type: new GraphQLNonNull(UUIDType) } 
      },
      resolve: async (_, args: { userId: string }) => {
        const posts = await prisma.post.findMany({
          where: {
            authorId: args.userId
          }
        })
        return posts;
      }
    },
    getProfileByUserId: {
      type: new GraphQLList(profileType),
      args: { 
       userId: { type: new GraphQLNonNull(UUIDType) } 
      },
      resolve: async (_, args: { userId: string }) => {
        const profile = await prisma.profile.findUnique({
          where: {
            userId: args.userId,
          }
        })
        if (profile === null) {
          throw new ResourceNotFoundError();
        }
        return profile;
      }
    },
    subscribedToUser: {
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
    },
    userSubscribedTo: {
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
    },
  }
});
const mutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createUser: {
      type: userType,
      args: {
        dto: { type: createUserInputType },
      },
      resolve: async (_, args: { dto: UserBody }) => {
        return prisma.user.create({
          data: args.dto
        });
      }
    },
    changeUser: {
      type: userType,
      args: {
        dto: { type: changeUserInputType },
        userId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, args: { userId: string, dto: UserBody }) => {
        return prisma.user.update({
          where: {
            id: args.userId
          },
          data: args.dto
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
    },
    createPost: {
      type: postType,
      args: {
        dto: { type: createPostInputType },
      },
      resolve: async (_, args: { dto: PostPOSTBody }) => {
        return prisma.post.create({
          data: args.dto
        });
      }
    },
    changePost: {
      type: postType,
      args: {
        dto: { type: changePostInputType },
        postId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, args: { postId: string, dto: PostPATCHBody }) => {
        return prisma.post.update({
          where: {
            id: args.postId
          },
          data: args.dto
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
    },
    createProfile: {
      type: profileType,
      args: {
        dto: { type: profileCreateInputType },
      },
      resolve: async (_, args: { dto: ProfilePOSTBody }) => {
        return prisma.profile.create({
          data: args.dto
        });
      }
    },
    changeProfile: {
      type: profileType,
      args: {
        dto: { type: profileUpdateInputType },
        profileId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, args: { profileId: string, dto: ProfilePATCHBody }) => {
        return prisma.profile.update({
          where: {
            id: args.profileId
          },
          data: args.dto
        });
      }
    },
    deleteProfile: {
      type: UUIDType,
      args: {
        profileId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, args: {profileId: string }, reply: FastifyReply) => {
        void reply.code(204);
        await prisma.profile.delete({
          where: {
            id: args.profileId
          }
        });
      }
    },
    subscribeTo: {
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
    unsubscribeFrom: {
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
    },
  }
});

export const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
