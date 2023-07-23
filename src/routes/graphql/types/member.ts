import { GraphQLObjectType, GraphQLNonNull, GraphQLEnumType, GraphQLInt, GraphQLFloat } from 'graphql';
import { MemberTypeId } from '../../member-types/schemas.js';

export const IDEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    [MemberTypeId.BASIC]: { value: MemberTypeId.BASIC },
    [MemberTypeId.BUSINESS]: { value: MemberTypeId.BUSINESS }
  }
});

export const memberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: {
    id: { type: new GraphQLNonNull(IDEnum) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
  },
});
