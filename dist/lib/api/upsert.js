"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faunadb_1 = require("faunadb");
exports.upsert = {
    database: function databaseUpsert(name) {
        return faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Database(name)), this.update.database(name, {}), this.create.database(name, {}));
    },
    collection: function collectionUpsert(name, options) {
        return faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Collection(name)), this.update.collection(name, options), this.create.collection(name, options));
    },
    index: function indexUpsert(name, options) {
        return faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Index(name)), this.update.index(name, options), this.create.index(name, options));
    },
    function: function functionUpsert(name) {
        return faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Function(name)), this.update.function(name, {}), this.create.function(name, {}));
    },
    role: function roleUpsert(name) {
        return faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Role(name)), this.update.role(name, {}), this.create.role(name, {}));
    }
    // token: function tokenUpsert(id: FaunaId) {
    //   return (q.If(q.Exists(q.Ref(q.Tokens(), id)), update.token(id, {}), create.token(id, {})))
    // },
    // key: function keyUpsert(id: FaunaId, opt) {
    //   return (q.If(q.Exists(q.Ref(q.Keys(), id)), update.key(opt), create.key(opt)))
    // }
};
//# sourceMappingURL=upsert.js.map