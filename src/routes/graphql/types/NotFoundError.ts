import { GraphQLError } from 'graphql';

export class ResourceNotFoundError extends GraphQLError {
  constructor() {
    super('Requested resource not found');
  }
};
