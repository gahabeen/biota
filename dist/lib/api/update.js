"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faunadb_1 = require("faunadb");
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
        return faunadb_1.query.Update(faunadb_1.query.Function(name), {});
    },
    role: function roleUpdate(name, options) {
        return faunadb_1.query.Update(faunadb_1.query.Role(name), {});
    }
    // token: function tokenUpdate(id: FaunaId, options) {
    //   return (q.Update(q.Ref(q.Tokens(), id), {}))
    // },
    // key: function keyUpdate(id: FaunaId, options) {
    //   return (q.Update(q.Ref(q.Keys(), id), {}))
    // }
};
//# sourceMappingURL=update.js.map