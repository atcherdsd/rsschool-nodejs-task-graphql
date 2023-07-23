import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLError, validate, parse } from 'graphql';
import { schema } from './types/schemas.js';
import memberTypeResolver from './resolvers/memberTypeResolver.js';
import depthLimit from 'graphql-depth-limit';

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
      const errors: readonly GraphQLError[] = validate(
        schema, parse(req.body.query), [depthLimit(5)]
      );
      if (errors.length) return { errors };

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
