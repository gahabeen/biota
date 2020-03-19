"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faunadb_1 = require("faunadb");
exports.get = {
    get: function documentGet(ref) {
        return faunadb_1.query.Get(ref);
    },
    collections: function collectionsGet() {
        return faunadb_1.query.Paginate(faunadb_1.query.Collections(), {});
    },
    indexes: function indexesGet() {
        return faunadb_1.query.Paginate(faunadb_1.query.Indexes(), {});
    },
    functions: function functionsGet() {
        return faunadb_1.query.Paginate(faunadb_1.query.Functions(), {});
    },
    roles: function rolesGet() {
        return faunadb_1.query.Paginate(faunadb_1.query.Roles(), {});
    },
    keys: function keysGet() {
        return faunadb_1.query.Paginate(faunadb_1.query.Keys());
    },
    tokens: function keysGet() {
        return faunadb_1.query.Paginate(faunadb_1.query.Documents(faunadb_1.query.Tokens()));
    },
    credentials: function credentialsGet() {
        return faunadb_1.query.Paginate(faunadb_1.query.Documents(faunadb_1.query.Credentials()));
    }
};
//# sourceMappingURL=get.js.map