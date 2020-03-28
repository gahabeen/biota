"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// imports
const faunadb_1 = require("faunadb");
// lib
const role_1 = require("~/factory/api/role");
const udfunction_1 = require("~/factory/api/udfunction");
const has_role_1 = require("~/framework/default/rules/has_role");
const wrapDoc_1 = require("~/framework/helpers/wrapDoc");
const rules_1 = require("~/framework/api/default/rules");
exports.augmented_user = {
    name: "augmented_user",
    membership: {
        resource: faunadb_1.query.Collection("users"),
        predicate: faunadb_1.query.Query(faunadb_1.query.Lambda("ref", wrapDoc_1.wrapDoc("ref", has_role_1.has_role("user"))))
    },
    privileges: [
        role_1.Privilege({
            resource: faunadb_1.query.Function(udfunction_1.BiotaUDFunctionName("Create")),
            actions: { call: faunadb_1.query.Query(rules_1.is_first_argument_identity) }
        })
        // Privilege({ resource: q.Function(BiotaUDFunctionName("Match")), actions: { call: "all" } }),
        // Privilege({ resource: q.Function(BiotaUDFunctionName("Owner")), actions: { call: "all" } }),
        // Privilege({
        //   resource: q.Function(BiotaUDFunctionName("ChangePassword")),
        //   actions: { call: "all" }
        // }),
        // Privilege({ resource: q.Function(BiotaUDFunctionName("Assign")), actions: { call: "all" } }),
        // Privilege({ resource: q.Function(BiotaUDFunctionName("Import")), actions: { call: "all" } }),
        // Privilege({ resource: q.Function(BiotaUDFunctionName("Update")), actions: { call: "all" } }),
        // Privilege({ resource: q.Function(BiotaUDFunctionName("Replace")), actions: { call: "all" } }),
        // Privilege({ resource: q.Function(BiotaUDFunctionName("Expire")), actions: { call: "all" } }),
        // Privilege({ resource: q.Function(BiotaUDFunctionName("Delete")), actions: { call: "all" } }),
        // Privilege({ resource: q.Function(BiotaUDFunctionName("Archive")), actions: { call: "all" } })
    ]
};
//# sourceMappingURL=augmented_user.js.map