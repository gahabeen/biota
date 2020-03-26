"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const faunadb_1 = require("faunadb");
exports.forget = {
    database: function databaseForget(name) {
        return faunadb_1.query.Delete(faunadb_1.query.Database(name));
    },
    collection: function collectionForget(name) {
        return faunadb_1.query.Delete(faunadb_1.query.Collection(name));
    },
    index: function indexForget(name) {
        return faunadb_1.query.Delete(faunadb_1.query.Index(name));
    },
    function: function functionForget(name) {
        return faunadb_1.query.Delete(faunadb_1.query.Function(name));
    },
    role: function roleForget(name) {
        return faunadb_1.query.Delete(faunadb_1.query.Role(name));
    },
    token: function tokenForget(id) {
        return faunadb_1.query.Delete(faunadb_1.query.Ref(faunadb_1.query.Tokens(), id));
    },
    key: function keyForget(id) {
        return faunadb_1.query.Delete(faunadb_1.query.Ref(faunadb_1.query.Keys(), id));
    }
};
//# sourceMappingURL=forget.js.map