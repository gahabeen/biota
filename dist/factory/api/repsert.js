"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const faunadb_1 = require("faunadb");
// biota
const helpers_1 = require("~/helpers");
const create_1 = require("~/factory/api/create");
const replace_1 = require("~/factory/api/replace");
exports.repsert = {
    database: function databaseReplace(name, options) {
        let definition = helpers_1.nameOrOptions(name, options);
        return faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Database(definition.name)), replace_1.replace.database(definition.name, definition), create_1.create.database(definition.name, definition));
    },
    collection: function collectionReplace(name, options) {
        let definition = helpers_1.nameOrOptions(name, options);
        return faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Collection(definition.name)), replace_1.replace.collection(definition.name, definition), create_1.create.collection(definition.name, definition));
    },
    index: function indexReplace(name, options) {
        let definition = helpers_1.nameOrOptions(name, options);
        return faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Index(definition.name)), replace_1.replace.index(definition.name, definition), create_1.create.index(definition.name, definition));
    },
    function: function fuctionReplace(name, options) {
        let definition = helpers_1.nameOrOptions(name, options);
        return faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Function(definition.name)), replace_1.replace.function(definition.name, definition), create_1.create.function(definition.name, definition));
    },
    role: function roleReplace(name, options) {
        let definition = helpers_1.nameOrOptions(name, options);
        return faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Role(definition.name)), replace_1.replace.role(definition.name, definition), create_1.create.role(definition.name, definition));
    },
    token: function tokenReplace(id, options) {
        let definition = helpers_1.nameOrOptions(id, options);
        return faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Ref(faunadb_1.query.Tokens(), definition.name)), replace_1.replace.token(definition.name, definition), create_1.create.token(definition.name, definition));
    },
    key: function keyReplace(id, options) {
        let definition = helpers_1.nameOrOptions(id, options);
        return faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Ref(faunadb_1.query.Keys(), definition.name)), replace_1.replace.key(definition.name, definition), create_1.create.key(definition));
    }
};
//# sourceMappingURL=repsert.js.map