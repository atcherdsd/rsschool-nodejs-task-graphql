import { GraphQLObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLInt, GraphQLInputObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { IDEnum, memberType } from './member.js';
import { MemberTypeId } from '../../member-types/schemas.js';
import { getMemberType } from '../resolvers/memberTypeResolver.js';

export interface ProfilePATCHBody {
  isMale: boolean;
  yearOfBirth: number;
  memberTypeId: MemberTypeId;
}
export interface ProfilePOSTBody extends ProfilePATCHBody {
  userId: string;
}
export interface Profile extends ProfilePATCHBody {
  id: string;
}

export const profileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberType: {
      type: new GraphQLNonNull(memberType),
      resolve: async (source: Profile) => (
        await getMemberType({ id: source.memberTypeId })
      ),
    }
  }),
});

export const profileCreateInputType = new GraphQLInputObjectType({
  name: 'ProfileCreate',
  fields: {
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(IDEnum) },
  },
});
export const profileUpdateInputType = new GraphQLInputObjectType({
  name: 'ProfileUpdate',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: IDEnum },
  },
});
