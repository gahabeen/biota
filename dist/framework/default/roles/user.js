"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// imports
const faunadb_1 = require("faunadb");
// lib
const role_1 = require("~/factory/api/role");
// local
const has_role_1 = require("~/framework/default/rules/has_role");
const is_document_available_1 = require("~/framework/default/rules/is_document_available");
exports.User = role_1.Role({
    name: "User",
    membership: {
        resource: faunadb_1.query.Collection("users"),
        predicate: faunadb_1.query.Query(has_role_1.has_role("User"))
    },
    privileges: [
        // collections
        role_1.CustomPrivilege({
            resource: faunadb_1.query.Collection("users"),
            actions: {
                // create: q.Query(very_safe_query),
                delete: false,
                read: faunadb_1.query.Query(is_document_available_1.is_document_available),
                // write: q.Query(very_safe_query),
                history_read: false,
                history_write: false,
                unrestricted_read: false
            }
        }),
        // indexes
        // functions
        role_1.Privilege({ resource: faunadb_1.query.Function("Match"), actions: { call: "all" } }),
        role_1.Privilege({ resource: faunadb_1.query.Function("Owner"), actions: { call: "all" } }),
        role_1.Privilege({
            resource: faunadb_1.query.Function("ChangePassword"),
            actions: { call: "all" }
        }),
        role_1.Privilege({ resource: faunadb_1.query.Function("Assign"), actions: { call: "all" } }),
        role_1.Privilege({ resource: faunadb_1.query.Function("Import"), actions: { call: "all" } }),
        role_1.Privilege({ resource: faunadb_1.query.Function("Create"), actions: { call: "all" } }),
        role_1.Privilege({ resource: faunadb_1.query.Function("Update"), actions: { call: "all" } }),
        role_1.Privilege({ resource: faunadb_1.query.Function("Replace"), actions: { call: "all" } }),
        role_1.Privilege({ resource: faunadb_1.query.Function("Expire"), actions: { call: "all" } }),
        role_1.Privilege({ resource: faunadb_1.query.Function("Delete"), actions: { call: "all" } }),
        role_1.Privilege({ resource: faunadb_1.query.Function("Archive"), actions: { call: "all" } })
    ]
});
//# sourceMappingURL=user.js.map