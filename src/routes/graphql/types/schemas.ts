import { GraphQLFloat, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import { UserBody, userType, userUpdateInputType } from './users.js';
import { UUIDType } from './uuid.js';
import { MemberType, Post, PrismaClient, Profile, User } from '@prisma/client';
import { ResourceNotFoundError } from './NotFoundError.js';
import { FastifyReply } from 'fastify';
import { IDEnum, memberType } from './member.js';
import { PostPATCHBody, PostPOSTBody, postCreateInputType, postType, postUpdateInputType } from './posts.js';
import { ProfilePATCHBody, ProfilePOSTBody, profileCreateInputType, profileType, profileUpdateInputType } from './profiles.js';
import { ToSubscribeBody, toSubscribeCreateInputType } from './userId/userSubscribedTo.js';

const prisma = new PrismaClient();

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
    },
    getMemberTypeById: {
      type: memberType,
      args: { 
        memberTypeId: { type: new GraphQLNonNull(IDEnum) } 
      },
      resolve: async (_, args: { memberTypeId: string }) => {
        const member = await memberType[args.memberTypeId] as MemberType;
        if (member === null){
          throw new ResourceNotFoundError();
        }
        return member;
      }
    },
    getMemberTypes: {
      type: new GraphQLList(memberType),
      resolve: async () => {
        return [memberType] as unknown as [MemberType];
      }
    },
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
    },
    getProfile: {
      type: profileType,
      args: {
        profileId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, args: { profileId: string }) => {
        const profile = await profileType[args.profileId] as Profile;
        if (profile === null) {
          throw new ResourceNotFoundError();
        }
        return profile;
      },
    },
    getProfiles: {
      type: new GraphQLList(profileType),
      resolve: async () => {
        return [profileType] as unknown as [Profile];
      }
    },
    getPostsByUserId: {
      type: new GraphQLList(postType),
      args: { 
       userId: { type: new GraphQLNonNull(UUIDType) } 
      },
      resolve: async (_, args: { userId: string }) => {
        return [postType[args.userId]] as [Post];
      }
    },
    getProfileByUserId: {
      type: new GraphQLList(profileType),
      args: { 
       userId: { type: new GraphQLNonNull(UUIDType) } 
      },
      resolve: async (_, args: { userId: string }) => {
        const profile = await profileType[args.userId] as Profile;
        if (profile === null) {
          throw new ResourceNotFoundError();
        }
        return profile;
      }
    },
    getSubscribedToUser: {
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
    },
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
    },
    createPost: {
      type: postType,
      args: {
        postBody: { type: postCreateInputType },
      },
      resolve: async (_, args: { body: PostPOSTBody }) => {
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
      resolve: async (_, args: { postId: string, postBody: PostPATCHBody }) => {
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
    },
    createProfile: {
      type: profileType,
      args: {
        profileBody: { type: profileCreateInputType },
      },
      resolve: async (_, args: { body: ProfilePOSTBody }) => {
        return prisma.profile.create({
          data: args.body
        });
      }
    },
    updateProfile: {
      type: profileType,
      args: {
        profileBody: { type: profileUpdateInputType },
        profileId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, args: { profileId: string, profileBody: ProfilePATCHBody }) => {
        return prisma.profile.update({
          where: {
            id: args.profileId
          },
          data: args.profileBody
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
    deleteUserToSubscribe: {
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
