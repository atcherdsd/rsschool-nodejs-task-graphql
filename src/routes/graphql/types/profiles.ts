import { GraphQLObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLInt, GraphQLSchema, GraphQLList, GraphQLInputObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { PrismaClient, Profile } from '@prisma/client';
import { FastifyReply } from 'fastify';
import { ResourceNotFoundError } from './NotFoundError.js';
import { IDEnum } from './member.js';
import { MemberTypeId } from '../../member-types/schemas.js';

const prisma = new PrismaClient();

interface PATCHBody {
  isMale: boolean;
  yearOfBirth: number;
  memberTypeId: MemberTypeId;
}
interface POSTBody extends PATCHBody {
  userId: string;
}

export const profileType = new GraphQLObjectType({
  name: 'Profile',
  fields: {
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(IDEnum) }
  }
});

const profileCreateInputType = new GraphQLInputObjectType({
  name: 'ProfileCreate',
  fields: {
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(IDEnum) },
  },
});
const profileUpdateInputType = new GraphQLInputObjectType({
  name: 'ProfileUpdate',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: IDEnum },
  },
});

const queryType = new GraphQLObjectType({
  name: "Query",
  fields: {
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
    }
  }
});
const mutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createProfile: {
      type: profileType,
      args: {
        profileBody: { type: profileCreateInputType },
      },
      resolve: async (_, args: { body: POSTBody }) => {
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
      resolve: async (_, args: { profileId: string, profileBody: PATCHBody }) => {
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
    }
  }
});

export const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
