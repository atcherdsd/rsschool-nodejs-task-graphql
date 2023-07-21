import { MemberType } from '@prisma/client';
import { GraphQLObjectType, GraphQLError, GraphQLNonNull, GraphQLEnumType, GraphQLInt, GraphQLFloat, GraphQLList, GraphQLSchema } from 'graphql';

class MemberTypeNotFoundError extends GraphQLError {
  constructor() {
    super('Requested member type not found');
  }
}

const IDEnum = new GraphQLEnumType({
  name: 'MemberID',
  values: {
    BASIC: { value: 'basic' },
    BUSINESS: { value: 'business' }
  }
});

const memberType = new GraphQLObjectType({
  name: 'MemberTypes',
  fields: {
    id: { type: new GraphQLNonNull(IDEnum) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
  },
});

const queryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    getMemberTypeById: {
      type: memberType,
      args: { 
        memberTypeId: { type: new GraphQLNonNull(IDEnum) } 
      },
      resolve: async (_, args: { memberTypeId: string }) => {
        const member = memberType[args.memberTypeId] as MemberType;
        if (member === null){
          throw new MemberTypeNotFoundError();
        }
        return member;
      }
    },
    getMemberTypes: {
      type: new GraphQLList(memberType),
      resolve: async () => {
        return [memberType] as unknown as [MemberType];
      }
    }
  }
});

export const schema = new GraphQLSchema({
  query: queryType
});
