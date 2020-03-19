"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faunadb_1 = require("faunadb");
exports.replace = {
    database: function databaseReplace(name, options) {
        return faunadb_1.query.Replace(faunadb_1.query.Database(name), {});
    },
    collection: function collectionReplace(name, options) {
        return faunadb_1.query.Replace(faunadb_1.query.Collection(name), {});
    },
    index: function indexReplace(name, options) {
        return faunadb_1.query.Replace(faunadb_1.query.Index(name), {});
    },
    function: function fuctionReplace(name, options) {
        return faunadb_1.query.Replace(faunadb_1.query.Function(name), {});
    },
    role: function roleReplace(name, options) {
        return faunadb_1.query.Replace(faunadb_1.query.Role(name), {});
    },
    token: function tokenReplace(id, options) {
        return faunadb_1.query.Replace(faunadb_1.query.Ref(faunadb_1.query.Tokens(), id), options);
    },
    key: function keyReplace(id, options) {
        return faunadb_1.query.Replace(faunadb_1.query.Ref(faunadb_1.query.Keys(), id), options);
    }
};
//# sourceMappingURL=replace.js.map