"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// imports
const faunadb_1 = require("faunadb");
// lib
const role_1 = require("~/factory/classes/role");
const udfunction_1 = require("~/factory/classes/udfunction");
const index_1 = require("~/factory/classes/index");
exports.system = {
    name: "system",
    privileges: [
        /**
         * Indexes
         */
        role_1.Privilege({
            resource: faunadb_1.query.Indexes(),
            actions: { read: "all", unrestricted_read: "all" }
        }),
        role_1.Privilege({
            resource: faunadb_1.query.Index(index_1.indexNameNormalized("indexes__by__resource")),
            actions: { read: "all", unrestricted_read: "all" }
        }),
        role_1.Privilege({
            resource: faunadb_1.query.Index(index_1.indexNameNormalized("indexes__by__terms")),
            actions: { read: "all", unrestricted_read: "all" }
        }),
        /**
         * Functions
         */
        role_1.Privilege({
            resource: faunadb_1.query.Function(udfunction_1.udfunctionNameNormalized("FindIndex")),
            actions: { call: "all" }
        })
    ]
};
//# sourceMappingURL=system.js.map