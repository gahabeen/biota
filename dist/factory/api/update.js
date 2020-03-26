"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const faunadb_1 = require("faunadb");
// biota
exports.update = {
    database: function databaseUpdate(name, options) {
        return faunadb_1.query.Update(faunadb_1.query.Database(name), options);
    },
    collection: function collectionUpdate(name, options) {
        return faunadb_1.query.Update(faunadb_1.query.Collection(name), options);
    },
    index: function indexUpdate(name, options) {
        return faunadb_1.query.Update(faunadb_1.query.Index(name), options);
    },
    function: function functionUpdate(name, options) {
        return faunadb_1.query.Update(faunadb_1.query.Function(name), options);
    },
    role: function roleUpdate(name, options) {
        return faunadb_1.query.Update(faunadb_1.query.Role(name), options);
    },
    token: function tokenUpdate(id, options) {
        return faunadb_1.query.Update(faunadb_1.query.Ref(faunadb_1.query.Tokens(), id), options);
    },
    key: function keyUpdate(id, options) {
        return faunadb_1.query.Update(faunadb_1.query.Ref(faunadb_1.query.Keys(), id), options);
    }
};
//# sourceMappingURL=update.js.map