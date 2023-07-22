import { GraphQLObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLInt, GraphQLInputObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { IDEnum } from './member.js';
import { MemberTypeId } from '../../member-types/schemas.js';

export interface ProfilePATCHBody {
  isMale: boolean;
  yearOfBirth: number;
  memberTypeId: MemberTypeId;
}
export interface ProfilePOSTBody extends ProfilePATCHBody {
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
