"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const faunadb_1 = require("faunadb");
// biota
// import { DB } from "~/db";
exports.replace = {
    database: function databaseReplace(name, options) {
        return faunadb_1.query.Replace(faunadb_1.query.Database(name), options);
    },
    collection: function collectionReplace(name, options) {
        return faunadb_1.query.Replace(faunadb_1.query.Collection(name), options);
    },
    index: function indexReplace(name, options) {
        return faunadb_1.query.Replace(faunadb_1.query.Index(name), options);
    },
    function: function fuctionReplace(name, options) {
        return faunadb_1.query.Replace(faunadb_1.query.Function(name), options);
    },
    role: function roleReplace(name, options) {
        return faunadb_1.query.Replace(faunadb_1.query.Role(name), options);
    },
    token: function tokenReplace(id, options) {
        return faunadb_1.query.Replace(faunadb_1.query.Ref(faunadb_1.query.Tokens(), id), options);
    },
    key: function keyReplace(id, options) {
        return faunadb_1.query.Replace(faunadb_1.query.Ref(faunadb_1.query.Keys(), id), options);
    }
};
//# sourceMappingURL=replace.js.map