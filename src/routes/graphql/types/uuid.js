"use strict";
exports.__esModule = true;
exports.UUIDType = void 0;
var graphql_1 = require("graphql");
var isUUID = function (value) {
    return typeof value === 'string' &&
        new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$').test(value);
};
exports.UUIDType = new graphql_1.GraphQLScalarType({
    name: 'UUID',
    serialize: function (value) {
        if (!isUUID(value)) {
            throw new TypeError("Invalid UUID.");
        }
        return value;
    },
    parseValue: function (value) {
        if (!isUUID(value)) {
            throw new TypeError("Invalid UUID.");
        }
        return value;
    },
    parseLiteral: function (ast) {
        if (ast.kind === graphql_1.Kind.STRING) {
            if (isUUID(ast.value)) {
                return ast.value;
            }
        }
        return undefined;
    }
});
