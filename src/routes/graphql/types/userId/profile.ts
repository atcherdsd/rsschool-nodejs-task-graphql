import { Profile } from '@prisma/client';
import { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLSchema } from 'graphql';
import { UUIDType } from '../uuid.js';
import { profileType } from '../profiles.js';
import { ResourceNotFoundError } from '../NotFoundError.js';

const queryType = new GraphQLObjectType({
  name: "Query",
  fields: {
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
    }
  }
});

export const schema = new GraphQLSchema({
  query: queryType
});
