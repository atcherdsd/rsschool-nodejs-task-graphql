import { GraphQLInputObjectType, GraphQLNonNull } from 'graphql';
import { UUIDType } from '../uuid.js';

export type ToSubscribeBody = {
  authorId: string;
};

export const toSubscribeCreateInputType = new GraphQLInputObjectType({
  name: 'ToSubscribeCreate',
  fields: {
    authorId: { type: new GraphQLNonNull(UUIDType) }
  },
});
