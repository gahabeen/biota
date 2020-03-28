"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// imports
const faunadb_1 = require("faunadb");
// factory
const role_1 = require("~/factory/api/role");
const udfunction_1 = require("~/factory/api/udfunction");
// framework
const has_role_1 = require("~/framework/default/rules/has_role");
const wrapDoc_1 = require("~/framework/helpers/wrapDoc");
const is_document_available_1 = require("~/framework/default/rules/is_document_available");
exports.user = role_1.Role({
    name: "user",
    membership: {
        resource: faunadb_1.query.Collection("users"),
        predicate: faunadb_1.query.Query(faunadb_1.query.Lambda("ref", wrapDoc_1.wrapDoc("ref", has_role_1.has_role("user"))))
    },
    privileges: [
        // collections
        role_1.CustomPrivilege({
            resource: faunadb_1.query.Collection("users"),
            actions: {
                // create: q.Query(very_safe_query),
                delete: false,
                read: faunadb_1.query.Query(faunadb_1.query.Lambda("ref", wrapDoc_1.wrapDoc("ref", is_document_available_1.is_document_available))),
                // write: q.Query(very_safe_query),
                history_read: false,
                history_write: false,
                unrestricted_read: false
            }
        }),
        // indexes
        // functions
        // Privilege({ resource: q.Function(BiotaUDFunctionName("Match")), actions: { call: "all" } }),
        // Privilege({ resource: q.Function(BiotaUDFunctionName("Owner")), actions: { call: "all" } }),
        // Privilege({
        //   resource: q.Function(BiotaUDFunctionName("ChangePassword")),
        //   actions: { call: "all" }
        // }),
        // Privilege({ resource: q.Function(BiotaUDFunctionName("Assign")), actions: { call: "all" } }),
        // Privilege({ resource: q.Function(BiotaUDFunctionName("Import")), actions: { call: "all" } }),
        role_1.Privilege({
            resource: faunadb_1.query.Function(udfunction_1.BiotaUDFunctionName("Create")),
            actions: { call: "all" }
        }),
        role_1.Privilege({
            resource: faunadb_1.query.Function(udfunction_1.BiotaUDFunctionName("Update")),
            actions: { call: "all" }
        })
        // Privilege({ resource: q.Function(BiotaUDFunctionName("Replace")), actions: { call: "all" } }),
        // Privilege({ resource: q.Function(BiotaUDFunctionName("Expire")), actions: { call: "all" } }),
        // Privilege({ resource: q.Function(BiotaUDFunctionName("Delete")), actions: { call: "all" } }),
        // Privilege({ resource: q.Function(BiotaUDFunctionName("Archive")), actions: { call: "all" } })
    ]
});
//# sourceMappingURL=user.js.map