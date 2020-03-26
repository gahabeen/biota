"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// imports
const faunadb_1 = require("faunadb");
// lib
// import * as fn from '~/factory/function'
// import * as rule from '~/factory/rule'
const role_1 = require("~/factory/api/role");
// local
const has_role_1 = require("../rules/has_role");
exports.Advanced = role_1.Role({
    name: "Advanced",
    membership: {
        resource: faunadb_1.query.Collection("users"),
        predicate: faunadb_1.query.Query(has_role_1.has_role("Advanced"))
    },
    privileges: [
    // Privilege({
    //   resource: q.Function(fn.MatchHidden.name),
    //   actions: { call:"all" }
    // })
    ]
});
//# sourceMappingURL=advanced.js.map