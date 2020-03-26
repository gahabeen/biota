"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const faunadb_1 = require("faunadb");
// biota
const helpers_1 = require("~/helpers");
const create_1 = require("~/factory/api/create");
const update_1 = require("~/factory/api/update");
exports.upsert = {
    database: function databaseUpsert(name, options = {}) {
        let definition = helpers_1.nameOrOptions(name, options);
        return faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Database(definition.name)), update_1.update.database(definition.name, definition), create_1.create.database(definition.name, definition));
    },
    collection: function collectionUpsert(name, options = {}) {
        let definition = helpers_1.nameOrOptions(name, options);
        return faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Collection(definition.name)), update_1.update.collection(definition.name, definition), create_1.create.collection(definition.name, definition));
    },
    index: function indexUpsert(name, options = {}) {
        let definition = helpers_1.nameOrOptions(name, options);
        return faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Index(definition.name)), update_1.update.index(definition.name, definition), create_1.create.index(definition.name, definition));
    },
    function: function functionUpsert(name, options = {}) {
        let definition = helpers_1.nameOrOptions(name, options);
        return faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Function(definition.name)), update_1.update.function(definition.name, definition), create_1.create.function(definition.name, definition));
    },
    role: function roleUpsert(name, options = {}) {
        let definition = helpers_1.nameOrOptions(name, options);
        return faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Role(definition.name)), update_1.update.role(definition.name, definition), create_1.create.role(definition.name, definition));
    },
    token: function tokenUpsert(id, options = {}) {
        let definition = helpers_1.nameOrOptions(id, options);
        return faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Ref(faunadb_1.query.Tokens(), definition.name)), update_1.update.token(definition.name, definition), create_1.create.token(definition.name, definition));
    },
    key: function keyUpsert(id, options = {}) {
        let definition = helpers_1.nameOrOptions(id, options);
        return faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Ref(faunadb_1.query.Keys(), definition.name)), update_1.update.key(definition.name, definition), create_1.create.key(definition));
    }
};
//# sourceMappingURL=upsert.js.map