"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faunadb_1 = require("faunadb");
const collection_1 = require("./../collection");
exports.create = {
    database: function databaseCreate(name, options = {}) {
        return faunadb_1.query.CreateDatabase({
            name,
            ...options
        });
    },
    collection: function collectionCreate(name, options = {}) {
        return faunadb_1.query.CreateCollection(collection_1.Collection({
            name,
            ...options
        }));
    },
    index: function indexCreate(name, options) {
        return faunadb_1.query.CreateIndex({
            name,
            ...options
        });
    },
    function: function functionCreate(name, options) {
        return faunadb_1.query.CreateFunction({
            name
        });
    },
    role: function roleCreate(nameOrDefinition, andDefinition = {}) {
        let name = typeof nameOrDefinition === 'string' ? nameOrDefinition : undefined;
        let definition = typeof nameOrDefinition === 'object' ? nameOrDefinition : andDefinition;
        return faunadb_1.query.CreateRole({ name, ...definition });
    },
    token: function tokenCreate(ref) {
        return faunadb_1.query.Create(faunadb_1.query.Tokens(), { instance: ref });
    },
    key: function keyCreate(opt) {
        return faunadb_1.query.CreateKey(opt);
    }
};
//# sourceMappingURL=create.js.map