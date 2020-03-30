"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const faunadb_1 = require("faunadb");
// biota
const helpers_1 = require("~/helpers");
// relative
const database_1 = require("./database");
const collection_1 = require("./collection");
const index_1 = require("./index");
const udfunction_1 = require("./udfunction");
const role_1 = require("./role");
exports.create = {
    // document: function documentCreate(collectionName, options){
    //   return q.Create(Database(definition));
    // },
    database: function databaseCreate(name, options = {}) {
        let definition = helpers_1.nameOrOptions(name, options);
        return faunadb_1.query.CreateDatabase(database_1.Database(definition));
    },
    collection: function collectionCreate(name, options = {}) {
        let definition = helpers_1.nameOrOptions(name, options);
        return faunadb_1.query.CreateCollection(collection_1.Collection(definition));
    },
    index: function indexCreate(name, options = {}) {
        let definition = helpers_1.nameOrOptions(name, options);
        return faunadb_1.query.CreateIndex(index_1.Index(definition));
    },
    function: function functionCreate(name, options = {}) {
        let definition = helpers_1.nameOrOptions(name, options);
        return faunadb_1.query.CreateFunction(udfunction_1.UDFunction(definition));
    },
    role: function roleCreate(name, options = {}) {
        let definition = helpers_1.nameOrOptions(name, options);
        return faunadb_1.query.CreateRole(role_1.Role(definition));
    },
    token: function tokenCreate(ref, options = {}) {
        return faunadb_1.query.Create(faunadb_1.query.Tokens(), { instance: ref, ...options });
    },
    key: function keyCreate(options) {
        return faunadb_1.query.CreateKey(options);
    }
};
//# sourceMappingURL=create.js.map