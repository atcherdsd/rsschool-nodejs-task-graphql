import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql } from 'graphql';
import { schema } from './types/schemas.js';
import memberTypeResolver from './resolvers/memberTypeResolver.js';

const rootValue = memberTypeResolver;

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const result = await graphql({
        schema,
        source: req.body.query,
        rootValue,
        variableValues: req.body.variables,
      });
      return result;
    },
  });
};

export default plugin;
