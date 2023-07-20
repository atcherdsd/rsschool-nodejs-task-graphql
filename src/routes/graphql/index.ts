import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql } from 'graphql';
import { schema } from './types/users.js';

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
      return await graphql({
        schema: schema,
        source: req.body.query,
        variableValues: req.body.variables,
      })
      // graphql({
      //   schema,
      //   source: req.body.query,
      //   rootValue: () => {'Hello'},
      //   variables: req.body.variables,
      // });
    },
  });
};

export default plugin;
