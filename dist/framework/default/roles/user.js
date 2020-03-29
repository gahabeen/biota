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
// import { is_document_available } from "~/framework/default/rules/is_document_available";
exports.user = role_1.Role({
    name: "user",
    membership: {
        resource: faunadb_1.query.Collection("users"),
        predicate: faunadb_1.query.Query(faunadb_1.query.Lambda("ref", wrapDoc_1.wrapDoc("ref", has_role_1.has_role("user"))))
    },
    privileges: [
        /**
         * Indexes
         */
        /**
         * Collections
         */
        role_1.Privilege({
            resource: faunadb_1.query.Collection("users"),
            actions: { read: "self" }
        }),
        /**
         * Functions
         */
        role_1.Privilege({
            resource: faunadb_1.query.Function(udfunction_1.BiotaUDFunctionName("SearchQuery")),
            actions: { call: "all" }
        })
    ]
});
//# sourceMappingURL=user.js.map