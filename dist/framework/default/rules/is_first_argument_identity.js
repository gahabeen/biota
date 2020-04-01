"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const rule_1 = require("~/factory/rule");
exports.is_first_argument_identity = rule_1.Rule({
    name: "is_first_argument_identity",
    query: faunadb_1.query.Lambda("args", faunadb_1.query.Equals(faunadb_1.query.Select(0, faunadb_1.query.Var("args"), null), faunadb_1.query.Identity()))
});
//# sourceMappingURL=is_first_argument_identity.js.map